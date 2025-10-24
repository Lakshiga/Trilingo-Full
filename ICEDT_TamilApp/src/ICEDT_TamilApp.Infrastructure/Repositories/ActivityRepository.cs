using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;
using ICEDT_TamilApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ICEDT_TamilApp.Infrastructure.Repositories
{
    public class ActivityRepository : IActivityRepository
    {
        private readonly ApplicationDbContext _context;

        public ActivityRepository(ApplicationDbContext context) => _context = context;

        public async Task<Activity?> GetByIdAsync(int id)
        {
            return await _context
                .Activities.Include(a => a.ActivityType)
                .Include(a => a.MainActivity)
                .FirstOrDefaultAsync(a => a.ActivityId == id);
        }

        public async Task<List<Activity>> GetAllAsync()
        {
            return await _context
                .Activities.Include(a => a.ActivityType)
                .Include(a => a.MainActivity)
                .OrderBy(a => a.SequenceOrder)
                .ToListAsync();
        }

        public async Task<List<Activity>> GetByLessonIdAsync(int lessonId)
        {
            var query = _context
                .Activities.Include(a => a.ActivityType)
                .Include(a => a.MainActivity)
                .Where(a => a.LessonId == lessonId);

            return await query.OrderBy(a => a.SequenceOrder).ToListAsync();
        }

        public async Task CreateAsync(Activity activity)
        {
            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Activity activity)
        {
            _context.Activities.Update(activity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var activity = await _context.Activities.FindAsync(id);
            if (activity != null)
            {
                _context.Activities.Remove(activity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> SequenceOrderExistsAsync(int sequenceOrder)
        {
            return await _context.Activities.AnyAsync(a => a.SequenceOrder == sequenceOrder);
        }

        public async Task<bool> LessonExistsAsync(int lessonId)
        {
            return await _context.Lessons.AnyAsync(l => l.LessonId == lessonId);
        }

        public async Task<bool> HasActivitiesOfTypeAsync(int activityTypeId)
        {
            // This is highly efficient. It translates to a SQL query like:
            // SELECT CASE WHEN EXISTS (SELECT 1 FROM "Activities" WHERE "ActivityTypeId" = @p0)
            // THEN 1 ELSE 0 END
            return await _context.Activities.AnyAsync(a => a.ActivityTypeId == activityTypeId);
        }

        public async Task<bool> SequenceOrderExistsAsync(int lessonId, int sequenceOrder)
        {
             return await _context.Activities.AnyAsync(a => 
                a.LessonId == lessonId && 
                a.SequenceOrder == sequenceOrder
            );
        }
    }
}
