using System.Collections.Generic;
using System.Linq; // Required for .Where()
using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;
using ICEDT_TamilApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ICEDT_TamilApp.Infrastructure.Repositories
{
    public class LessonRepository : ILessonRepository
    {
        private readonly ApplicationDbContext _context;

        public LessonRepository(ApplicationDbContext context) => _context = context;

        public async Task<Lesson?> GetByIdAsync(int lessonId)
        {
            return await _context.Lessons.AsNoTracking().FirstOrDefaultAsync(l => l.LessonId == lessonId);
        }

        public async Task<List<Lesson>> GetAllAsync()
        {
            // No changes needed here, this is fine.
            return await _context
                .Lessons.AsNoTracking()
                .OrderBy(l => l.SequenceOrder)
                .ToListAsync();
        }

        public async Task<List<Lesson>> GetAllLessonsByLevelIdAsync(int levelId)
        {
            // No changes needed here, this is fine.
            return await _context
                .Lessons.AsNoTracking()
                .Where(l => l.LevelId == levelId)
                .OrderBy(l => l.SequenceOrder)
                .ToListAsync();
        }

        // --- FIX 1: Implement CreateAsync ---
        public async Task<Lesson> CreateAsync(Lesson lesson)
        {
            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();
            return lesson; // The lesson object now has the new ID from the database
        }

        // --- FIX 2: Implement UpdateAsync ---
        public async Task<bool> UpdateAsync(Lesson lesson)
        {
            // Find the existing lesson in the database
            var existingLesson = await _context.Lessons.FindAsync(lesson.LessonId);
            if (existingLesson == null)
            {
                return false; // Indicate that the lesson was not found
            }

            // Update the tracked entity's values. This is more efficient than Attach/Modify.
            _context.Entry(existingLesson).CurrentValues.SetValues(lesson);

            await _context.SaveChangesAsync();
            return true;
        }

        // --- FIX 3: Implement DeleteAsync ---
        public async Task<bool> DeleteAsync(int lessonId)
        {
            var lessonToDelete = await _context.Lessons.FindAsync(lessonId);
            if (lessonToDelete == null)
            {
                return false; // The lesson to delete was not found
            }

            _context.Lessons.Remove(lessonToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SequenceOrderExistsAsync(int sequenceOrder)
        {
            return await _context.Lessons.AnyAsync(l => l.SequenceOrder == sequenceOrder); // Corrected to check Lessons table
        }

        public async Task<bool> ExistsAsync(int lessonId)
        {
            return await _context.Lessons.AnyAsync(l => l.LessonId == lessonId);
        }

        public async Task<List<MainActivity>> GetMainActivitySummaryAsync(int lessonId)
        {
            return await _context.Activities
                // 1. Filter for the lesson AND ensure the navigation property is not null
                .Where(a => a.LessonId == lessonId && a.MainActivity != null)

                // 2. Select the non-null MainActivity
                .Select(a => a.MainActivity!) // The '!' tells the compiler we are sure it's not null now

                // 3. The rest of the query is now safe
                .Distinct()
                .OrderBy(ma => ma.Id)
                .ToListAsync();
        }

        /// <summary>
        /// Efficiently counts the number of lessons within a specific level.
        /// </summary>
        /// <param name="levelId">The ID of the parent level.</param>
        /// <returns>The total count of lessons.</returns>
        public async Task<int> GetLessonCountByLevelIdAsync(int levelId)
        {
            // The CountAsync method is translated directly to a COUNT(*) SQL query,
            // which is highly performant.
            return await _context.Lessons.CountAsync(l => l.LevelId == levelId);
        }

        public async Task<Lesson?> GetByIdWithActivitiesAsync(int lessonId)
        {
            return await _context.Lessons
                .Include(l => l.Activities)
                .FirstOrDefaultAsync(l => l.LessonId == lessonId);
        }
    }
}
