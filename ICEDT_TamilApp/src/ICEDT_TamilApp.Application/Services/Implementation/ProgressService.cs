using System.Threading.Tasks;
using ICEDT_TamilApp.Application.DTOs;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.Exceptions;
using ICEDT_TamilApp.Application.Services.Interfaces;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;

namespace ICEDT_TamilApp.Application.Services.Implementation
{
    public class ProgressService : IProgressService
    {
        private readonly IUnitOfWork _unitOfWork;


        public ProgressService(
            IUnitOfWork unitOfWork
        )
        {
            _unitOfWork = unitOfWork;
        }

      public async Task<CurrentLessonResponseDto?> GetCurrentLessonForUserAsync(int userId)
        {
            var currentProgress = await _unitOfWork.Progress.GetCurrentProgressAsync(userId);
            int lessonIdToFetch;

            if (currentProgress == null)
            {
                // New user case: find the very first lesson in the entire course.
                var firstLesson = await _unitOfWork.Progress.GetFirstLessonAsync();
                if (firstLesson == null)
                {
                    // This is a critical state where the application has no content.
                    throw new NotFoundException("No lessons found in the system. Cannot set initial progress.");
                }

                // Create the initial progress bookmark for the user.
                await _unitOfWork.Progress.CreateInitialProgressAsync(userId, firstLesson.LessonId);
                await _unitOfWork.CompleteAsync(); // Commit the new progress entry.
                lessonIdToFetch = firstLesson.LessonId;
            }
            else
            {
                lessonIdToFetch = currentProgress.CurrentLessonId;
            }

            // Fetch the lesson AND its related activities using the specific repository method.
            var lesson = await _unitOfWork.Lessons.GetByIdWithActivitiesAsync(lessonIdToFetch);
            if (lesson == null)
            {
                // This would indicate a data integrity issue (e.g., UserCurrentProgress points to a deleted lesson).
                // Returning null is a safe way to handle it.
                return null;
            }

            // Map the entity to our DTO, safely handling potential nulls.
            var response = new CurrentLessonResponseDto
            {
                LessonId = lesson.LessonId,
                LessonName = lesson.LessonName,
                
                // Use the null-coalescing operator to provide an empty string if Description is null.
                Description = lesson.Description ?? string.Empty,
                
                // Use the null-conditional and null-coalescing operators to safely handle the Activities collection.
                Activities = lesson.Activities?.Select(a => new ActivityResponseDto
                {
                    ActivityId = a.ActivityId,
                    ActivityTypeId = a.ActivityTypeId,
                    MainActivityId = a.MainActivityId, // Assuming DTO has these
                    Title = a.Title,
                    SequenceOrder = a.SequenceOrder,
                    ContentJson = a.ContentJson,
                })
                .OrderBy(a => a.SequenceOrder)
                .ToList() ?? new List<ActivityResponseDto>() // If lesson.Activities is null, return an empty list.
            };

            return response;
        }

        public async Task<ActivityCompletionResponseDto> CompleteActivityAsync(
            int userId,
            ActivityCompletionRequestDto request
        )
        {
            // 1. Mark the activity as complete in the database
            await _unitOfWork.Progress.MarkActivityAsCompleteAsync(
                userId,
                request.ActivityId,
                request.Score
            );

            // 2. Get the lesson this activity belongs to
            var activity = await _unitOfWork.Progress.GetActivityByIdAsync(request.ActivityId);
            if (activity == null)
            {
                throw new NotFoundException(
                    $"Activity with ID {request.ActivityId} and name {nameof(activity)}not found."
                );
            }
            int currentLessonId = activity.LessonId;

            // 3. Check if the entire lesson is now complete
            int totalActivities = await _unitOfWork.Progress.GetTotalActivitiesForLessonAsync(
                currentLessonId
            );
            int completedActivities = await _unitOfWork.Progress.GetCompletedActivitiesCountAsync(
                userId,
                currentLessonId
            );

            if (completedActivities < totalActivities)
            {
                return new ActivityCompletionResponseDto
                {
                    IsLessonCompleted = false,
                    IsCourseCompleted = false,
                    Message = "Activity marked complete. Keep going!",
                };
            }

            // 4. If lesson is complete, find the next lesson
            var nextLesson = await _unitOfWork.Progress.GetNextLessonAsync(currentLessonId);

            if (nextLesson == null)
            {
                // User has finished the entire course!
                return new ActivityCompletionResponseDto
                {
                    IsLessonCompleted = true,
                    IsCourseCompleted = true,
                    Message = "Congratulations! You have completed the entire course!",
                };
            }

            // 5. Unlock the next lesson for the user
            await _unitOfWork.Progress.UpdateCurrentLessonAsync(userId, nextLesson.LessonId);

            return new ActivityCompletionResponseDto
            {
                IsLessonCompleted = true,
                IsCourseCompleted = false,
                Message = $"Lesson completed! You have unlocked: {nextLesson.LessonName}",
            };
        }

        public async Task<ProgressSummaryDto> GetUserProgressSummaryAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException($"{nameof(User)}, {userId} not found.");

            var currentProgress = await _unitOfWork.Progress.GetCurrentProgressAsync(userId);
            if (currentProgress == null || currentProgress.CurrentLesson == null || currentProgress.CurrentLesson.Level == null)
            {
                // Handle case where user might not have started yet
                return new ProgressSummaryDto { UserId = userId, Username = user.Username, CurrentLessonName = "Not Started" };
            }

            var lesson = currentProgress.CurrentLesson;
            var level = lesson.Level;

            // Run queries in parallel for efficiency
            var totalActivitiesTask = _unitOfWork.Progress.GetTotalActivitiesForLessonAsync(lesson.LessonId);
            var completedActivitiesTask = _unitOfWork.Progress.GetCompletedActivitiesCountAsync(userId, lesson.LessonId);
            var totalLessonsInLevelTask = _unitOfWork.Lessons.GetLessonCountByLevelIdAsync(level.LevelId); // New repo method needed
            var completedLessonsInLevelTask = _unitOfWork.Progress.GetCompletedLessonCountForUserAsync(userId, level.LevelId); // New repo method needed
            var totalCourseLessonsTask = _unitOfWork.Progress.GetTotalLessonCountAsync();
            var totalCompletedCourseLessonsTask = _unitOfWork.Progress.GetCompletedLessonCountForUserAsync(userId);

            await Task.WhenAll(
                totalActivitiesTask, completedActivitiesTask, totalLessonsInLevelTask,
                completedLessonsInLevelTask, totalCourseLessonsTask, totalCompletedCourseLessonsTask
            );

            double overallCompletion = 0;
            if (totalCourseLessonsTask.Result > 0)
            {
                overallCompletion = ((double)totalCompletedCourseLessonsTask.Result / totalCourseLessonsTask.Result) * 100;
            }

            return new ProgressSummaryDto
            {
                UserId = userId,
                Username = user.Username,
                CurrentLevelId = level.LevelId,
                CurrentLevelName = level.LevelName,
                CurrentLessonId = lesson.LessonId,
                CurrentLessonName = lesson.LessonName,
                TotalActivitiesInLesson = totalActivitiesTask.Result,
                CompletedActivitiesInLesson = completedActivitiesTask.Result,
                TotalLessonsInLevel = totalLessonsInLevelTask.Result,
                CompletedLessonsInLevel = completedLessonsInLevelTask.Result,
                OverallCourseCompletionPercentage = Math.Round(overallCompletion, 2)
            };
        }

        public async Task<List<DetailedProgressDto>> GetDetailedProgressForUserAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException($"{nameof(User)}, {userId} not found.");

            var progressLog = await _unitOfWork.Progress.GetDetailedProgressForUserAsync(userId);

            // Use null-safe operators to prevent NullReferenceException
            return progressLog.Select(p => new DetailedProgressDto
            {
                ProgressId = p.ProgressId,
                ActivityId = p.ActivityId,
                ActivityTitle = p.Activity?.Title ?? "Untitled Activity", // If Activity is null or Title is null, use fallback

                // Safely access Lesson properties
                LessonId = p.Activity?.LessonId ?? 0, // Fallback to 0 if Activity is null
                LessonName = p.Activity?.Lesson?.LessonName ?? "Unknown Lesson", // If Activity or Lesson is null, use fallback

                // Safely access Level properties
                LevelId = p.Activity?.Lesson?.Level?.LevelId ?? 0, // If any part of the chain is null, fallback to 0
                LevelName = p.Activity?.Lesson?.Level?.LevelName ?? "Unknown Level", // Fallback to a string

                IsCompleted = p.IsCompleted,
                Score = p.Score,
                CompletedAt = p.CompletedAt ?? DateTime.UtcNow
            }).ToList();
        }
    }
}
