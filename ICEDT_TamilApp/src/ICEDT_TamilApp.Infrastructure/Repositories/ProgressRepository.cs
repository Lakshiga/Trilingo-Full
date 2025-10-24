using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;
using ICEDT_TamilApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ICEDT_TamilApp.Infrastructure.Repositories
{
    public class ProgressRepository : IProgressRepository
    {
        private readonly ApplicationDbContext _context;

        public ProgressRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Creates the initial progress entry for a new user, pointing to the first lesson.
        /// </summary>
        public async Task CreateInitialProgressAsync(int userId, int firstLessonId)
        {
            var initialProgress = new UserCurrentProgress
            {
                UserId = userId,
                CurrentLessonId = firstLessonId,
                LastActivityAt = DateTime.UtcNow,
            };
            await _context.UserCurrentProgress.AddAsync(initialProgress);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Retrieves the user's current "bookmark" (their current lesson).
        /// </summary>
        public async Task<UserCurrentProgress?> GetCurrentProgressAsync(int userId)
        {
            return await _context.UserCurrentProgress.FirstOrDefaultAsync(p => p.UserId == userId);
        }

        /// <summary>
        /// Gets the total number of activities that belong to a specific lesson.
        /// </summary>
        public async Task<int> GetTotalActivitiesForLessonAsync(int lessonId)
        {
            return await _context.Activities.CountAsync(a => a.LessonId == lessonId);
        }

        /// <summary>
        /// Counts how many activities a user has completed for a specific lesson.
        /// </summary>
        public async Task<int> GetCompletedActivitiesCountAsync(int userId, int lessonId)
        {
            // --- FIX #1: Add a null check for the navigation property ---
            return await _context.UserProgresses.CountAsync(p =>
                p.UserId == userId &&
                p.Activity != null && // Ensure the related Activity is not null
                p.Activity.LessonId == lessonId && 
                p.IsCompleted
            );
        }

        /// <summary>
        /// Marks a specific activity as completed for a user. If an entry already exists, it updates it.
        /// </summary>
        public async Task MarkActivityAsCompleteAsync(int userId, int activityId, int? score)
        {
            var existingProgress = await _context.UserProgresses.FirstOrDefaultAsync(p =>
                p.UserId == userId && p.ActivityId == activityId
            );

            if (existingProgress != null)
            {
                // User is re-doing an activity. Update the score and timestamp.
                existingProgress.IsCompleted = true;
                existingProgress.Score = score ?? 0;
                existingProgress.CompletedAt = DateTime.UtcNow;
            }
            else
            {
                // First time completing this activity.
                var newProgress = new UserProgress
                {
                    UserId = userId,
                    ActivityId = activityId,
                    IsCompleted = true,
                    Score = score ?? 0,
                    CompletedAt = DateTime.UtcNow,
                };
                await _context.UserProgresses.AddAsync(newProgress);
            }

            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Updates the user's current lesson bookmark to the next lesson.
        /// </summary>
        public async Task UpdateCurrentLessonAsync(int userId, int newLessonId)
        {
            var currentProgress = await _context.UserCurrentProgress.FirstOrDefaultAsync(p =>
                p.UserId == userId
            );

            if (currentProgress != null)
            {
                currentProgress.CurrentLessonId = newLessonId;
                currentProgress.LastActivityAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            // Optional: Consider what to do if currentProgress is null.
            // This scenario shouldn't happen if initial progress is created on registration.
        }

        /// <summary>
        // Finds the next lesson in the sequence within the same or next level.
        /// </summary>
        public async Task<Lesson?> GetNextLessonAsync(int currentLessonId)
        {
            var currentLesson = await _context.Lessons
                .Include(l => l.Level)
                .FirstOrDefaultAsync(l => l.LessonId == currentLessonId);

            if (currentLesson == null) return null;

            var nextLessonInSameLevel = await _context.Lessons
                .Where(l => l.LevelId == currentLesson.LevelId && l.SequenceOrder > currentLesson.SequenceOrder)
                .OrderBy(l => l.SequenceOrder)
                .FirstOrDefaultAsync();

            if (nextLessonInSameLevel != null) return nextLessonInSameLevel;

            // Use null-forgiving operator as EF Core include guarantees Level is not null here.
            var nextLevel = await _context.Levels
                .Where(lvl => lvl.SequenceOrder > currentLesson.Level!.SequenceOrder)
                .OrderBy(lvl => lvl.SequenceOrder)
                .FirstOrDefaultAsync();

            if (nextLevel == null) return null;

            return await _context.Lessons
                .Where(l => l.LevelId == nextLevel.LevelId)
                .OrderBy(l => l.SequenceOrder)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Gets the very first lesson in the entire curriculum (Level 1, Lesson 1).
        /// </summary>
        public async Task<Lesson?> GetFirstLessonAsync()
        {
            return await _context.Lessons
                .Include(l => l.Level) // Include Level to be safe for OrderBy
                .OrderBy(l => l.Level!.SequenceOrder)
                .ThenBy(l => l.SequenceOrder)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// A helper method to get an activity by its ID, including its parent lesson.
        /// </summary>
        public async Task<Activity?> GetActivityByIdAsync(int activityId)
        {
            return await _context.Activities
                .Include(a => a.Lesson)
                .FirstOrDefaultAsync(a => a.ActivityId == activityId);
        }

        public async Task<List<UserProgress>> GetDetailedProgressForUserAsync(int userId)
        {
            // --- FIX #2: Be more explicit with Includes to help the compiler ---
            // and ensure data integrity.
            return await _context.UserProgresses
                .Where(p => p.UserId == userId)
                // We load the entire graph of related data.
                .Include(p => p.Activity)
                    // EF Core requires a cast to the specific entity type for ThenInclude on collections.
                    .ThenInclude(a => (a as Activity)!.Lesson) 
                        .ThenInclude(l => (l as Lesson)!.Level)
                .OrderByDescending(p => p.CompletedAt)
                .ToListAsync();
        }

        public async Task<int> GetTotalLessonCountAsync()
        {
            return await _context.Lessons.CountAsync();
        }

        public async Task<int> GetCompletedLessonCountForUserAsync(int userId)
        {
            return await _context.Lessons
               .Where(l => l.Activities != null && // Null check
                           l.Activities.Any() &&
                           l.Activities.All(a => _context.UserProgresses
                               .Any(up => up.UserId == userId && up.ActivityId == a.ActivityId && up.IsCompleted)))
               .CountAsync();
        }

        public async Task<int> GetCompletedLessonCountForUserAsync(int userId, int levelId)
        {
            return await _context.Lessons
                .Where(lesson => lesson.LevelId == levelId)
                .Where(lesson => lesson.Activities != null && // Null check
                                 lesson.Activities.Any() &&
                                 lesson.Activities.All(activity =>
                                     _context.UserProgresses.Any(progress =>
                                         progress.UserId == userId &&
                                         progress.ActivityId == activity.ActivityId &&
                                         progress.IsCompleted
                                     )
                                 ))
                .CountAsync();
        }


    }
}
