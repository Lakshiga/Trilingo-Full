using System.Collections.Generic;
using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;
using ICEDT_TamilApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ICEDT_TamilApp.Infrastructure.Repositories
{
    public class LevelRepository : ILevelRepository
    {
        private readonly ApplicationDbContext _context;

        public LevelRepository(ApplicationDbContext context) => _context = context;

        public async Task<Level?> GetByIdAsync(int id)
        {
            // This is now valid because the method is allowed to return null.
            return await _context.Levels.Include(l => l.Lessons).FirstOrDefaultAsync(l => l.LevelId == id);
        }

        public async Task<List<Level>> GetAllAsync()
        {
            return await _context
                .Levels.Include(l => l.Lessons)
                .OrderBy(l => l.SequenceOrder)
                .ToListAsync();
        }

        public async Task CreateAsync(Level level)
        {
            _context.Levels.Add(level);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Level level)
        {
            _context.Levels.Update(level);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var level = await _context.Levels.FindAsync(id);
            if (level != null)
            {
                _context.Levels.Remove(level);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Level?> GetByIdWithLessonsAsync(int id)
        {
            return await _context
                .Levels.Include(l => l.Lessons)
                .Where(l => l.LevelId == id)
                .OrderBy(l => l.SequenceOrder) // Note: OrderBy on a single result doesn't do much, but it's not harmful.
                .FirstOrDefaultAsync();
        }

        public async Task<List<Level>> GetAllWithLessonsAsync()
        {
            var levels = await _context
                .Levels.Include(l => l.Lessons)
                .OrderBy(l => l.SequenceOrder)
                .ToListAsync();
            // Sort child lessons in-memory
            foreach (var level in levels)
            {
                if (level.Lessons != null)
                    level.Lessons = level.Lessons.OrderBy(ls => ls.SequenceOrder).ToList();
            }
            return levels;
        }

        public async Task<bool> SequenceOrderExistsAsync(int sequenceOrder)
        {
            return await _context.Levels.AnyAsync(l => l.SequenceOrder == sequenceOrder);
        }

        public async Task<bool> SlugExistsAsync(string slug)
        {
            return await _context.Levels.AnyAsync(l => l.Slug == slug);
        }

        public async Task<bool> LevelExistsAsync(int levelId)
        {
            return await _context.Levels.AnyAsync(l => l.LevelId == levelId);
        }
        
        public async Task<Level?> GetByBarcodeAsync(string barcode)
        {
            // Use FirstOrDefaultAsync to find the level with the matching barcode.
            // This relies on the unique index we set up in the configuration.
            return await _context.Levels
                .FirstOrDefaultAsync(l => l.Barcode == barcode);
        }

        public async Task<List<Level>> GetLevelsForUserAsync(int userId)
        {
            // This query joins the Levels table with the UserLevelAccesses table
            // to find all levels associated with the given userId.
            return await _context.UserLevelAccesses
                .Where(ula => ula.UserId == userId)
                .Select(ula => ula.Level)
                .OrderBy(l => l.SequenceOrder)
                .ToListAsync();
        }
    }
}
