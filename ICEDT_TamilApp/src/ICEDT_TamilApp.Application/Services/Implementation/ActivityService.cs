using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.Exceptions;
using ICEDT_TamilApp.Application.Services.Interfaces;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace ICEDT_TamilApp.Application.Services.Implementation
{
    public class ActivityService : IActivityService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ActivityService> _logger;

        public ActivityService(IUnitOfWork unitOfWork, ILogger<ActivityService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<ActivityResponseDto> GetActivityAsync(int id)
        {
            _logger.LogInformation("Fetching activity with ID: {ActivityId}", id);
            var activity = await _unitOfWork.Activities.GetByIdAsync(id);
            if (activity == null)
            {
                _logger.LogWarning("Activity with ID {ActivityId} not found.", id);
                throw new NotFoundException($"Activity with ID {id} not found.");
            }
            return MapToActivityResponseDto(activity);
        }

        public async Task<List<ActivityResponseDto>> GetAllActivitiesAsync()
        {
            _logger.LogInformation("Fetching all activities.");
            var activities = await _unitOfWork.Activities.GetAllAsync();
            return activities.Select(MapToActivityResponseDto).ToList();
        }

        public async Task<List<ActivityResponseDto>> GetActivitiesByLessonIdAsync(int lessonId)
        {
            _logger.LogInformation("Fetching activities for Lesson ID: {LessonId}", lessonId);
            if (!await _unitOfWork.Lessons.ExistsAsync(lessonId)) // A more efficient check
            {
                _logger.LogWarning("Lesson with ID {LessonId} not found.", lessonId);
                throw new NotFoundException($"Lesson with ID {lessonId} not found.");
            }
            var activities = await _unitOfWork.Activities.GetByLessonIdAsync(lessonId);
            return activities.Select(MapToActivityResponseDto).ToList();
        }

        public async Task<ActivityResponseDto> CreateActivityAsync(ActivityRequestDto dto)
        {
            _logger.LogInformation("Starting CreateActivityAsync for Lesson ID: {LessonId}", dto.LessonId);

            // --- STEP 1: VALIDATE FOREIGN KEY EXISTENCE (using UnitOfWork) ---
            await ValidateForeignKeysExistAsync(dto.LessonId, dto.ActivityTypeId, dto.MainActivityId);

            // --- STEP 2: VALIDATE BUSINESS RULES ---
            if (await _unitOfWork.Activities.SequenceOrderExistsAsync(dto.LessonId, dto.SequenceOrder))
            {
                _logger.LogError("Validation failed: Sequence order {SequenceOrder} already exists for this lesson.", dto.SequenceOrder);
                throw new ConflictException($"Sequence order {dto.SequenceOrder} already exists for this lesson.");
            }
            _logger.LogInformation("Sequence Order {SequenceOrder} is unique for this lesson.", dto.SequenceOrder);

            // --- STEP 3: CREATE ENTITY ---
            var activity = new Activity
            {
                Title = dto.Title,
                SequenceOrder = dto.SequenceOrder,
                ContentJson = dto.ContentJson,
                LessonId = dto.LessonId,
                ActivityTypeId = dto.ActivityTypeId,
                MainActivityId = dto.MainActivityId,
            };

            await _unitOfWork.Activities.CreateAsync(activity);

            // --- STEP 4: COMMIT TRANSACTION ---
            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("Activity with ID {ActivityId} created successfully.", activity.ActivityId);

            return MapToActivityResponseDto(activity);
        }

        public async Task<ActivityResponseDto> UpdateActivityAsync(int id, ActivityRequestDto dto)
        {
            _logger.LogInformation("Starting UpdateActivityAsync for Activity ID: {ActivityId}", id);
            var activity = await _unitOfWork.Activities.GetByIdAsync(id);
            if (activity == null)
            {
                _logger.LogWarning("Activity with ID {ActivityId} not found for update.", id);
                throw new NotFoundException($"Activity with ID {id} not found.");
            }

            // --- VALIDATE FOREIGN KEY EXISTENCE ---
            await ValidateForeignKeysExistAsync(dto.LessonId, dto.ActivityTypeId, dto.MainActivityId);

            // --- UPDATE ENTITY ---
            activity.LessonId = dto.LessonId;
            activity.ActivityTypeId = dto.ActivityTypeId;
            activity.MainActivityId = dto.MainActivityId;
            activity.Title = dto.Title;
            activity.SequenceOrder = dto.SequenceOrder;
            activity.ContentJson = dto.ContentJson;

            await _unitOfWork.Activities.UpdateAsync(activity);

            // --- COMMIT TRANSACTION ---
            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("Activity with ID {ActivityId} updated successfully.", id);

            return MapToActivityResponseDto(activity);
        }

        public async Task DeleteActivityAsync(int id)
        {
            _logger.LogInformation("Attempting to delete activity with ID: {ActivityId}", id);
            var activity = await _unitOfWork.Activities.GetByIdAsync(id);
            if (activity == null)
            {
                _logger.LogWarning("Activity with ID {ActivityId} not found for deletion.", id);
                throw new NotFoundException($"Activity with ID {id} not found.");
            }
            
            await _unitOfWork.Activities.DeleteAsync(id);

            // --- COMMIT TRANSACTION ---
            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("Activity with ID {ActivityId} deleted successfully.", id);
        }

        // --- Helper Methods ---

        private async Task ValidateForeignKeysExistAsync(int lessonId, int activityTypeId, int mainActivityId)
        {
            var lessonTask = _unitOfWork.Lessons.ExistsAsync(lessonId);
            var activityTypeTask = _unitOfWork.ActivityTypes.ExistsAsync(activityTypeId);
            var mainActivityTask = _unitOfWork.MainActivities.ExistsAsync(mainActivityId);

            await Task.WhenAll(lessonTask, activityTypeTask, mainActivityTask);

            if (!lessonTask.Result)
                throw new NotFoundException($"Cannot create/update activity: Lesson with ID {lessonId} not found.");
            if (!activityTypeTask.Result)
                throw new NotFoundException($"Cannot create/update activity: Activity Type with ID {activityTypeId} not found.");
            if (!mainActivityTask.Result)
                throw new NotFoundException($"Cannot create/update activity: Main Activity with ID {mainActivityId} not found.");

            _logger.LogInformation("All foreign keys validated successfully.");
        }

        private ActivityResponseDto MapToActivityResponseDto(Activity activity)
        {
            return new ActivityResponseDto
            {
                ActivityId = activity.ActivityId,
                LessonId = activity.LessonId,
                ActivityTypeId = activity.ActivityTypeId,
                ActivityTypeName = activity.ActivityType?.Name,
                MainActivityId = activity.MainActivityId,
                MainActivityName = activity.MainActivity?.Name,
                Title = activity.Title,
                SequenceOrder = activity.SequenceOrder,
                ContentJson = activity.ContentJson,
            };
        }
    }

    // You can move this to your Exceptions folder
    public class BusinessValidationException : Exception
    {
        public BusinessValidationException(string message) : base(message) { }
    }
}