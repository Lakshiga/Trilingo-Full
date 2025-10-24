using System.Collections.Generic;
using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;
using ICEDT_TamilApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ICEDT_TamilApp.Infrastructure.Repositories
{
    public class MainActivityRepository : IMainActivityRepository
    {
        private readonly ApplicationDbContext _context;

        public MainActivityRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a single MainActivity by its primary key.
        /// Returns null if not found.
        /// </summary>
        public async Task<MainActivity?> GetByIdAsync(int id)
        {
            // FindAsync is highly optimized for finding entities by their primary key.
            return await _context.MainActivities.FindAsync(id);
        }

        /// <summary>
        /// Retrieves all MainActivity entries from the database, ordered by their ID.
        /// </summary>
        public async Task<List<MainActivity>> GetAllAsync()
        {
            return await _context.MainActivities.OrderBy(m => m.Id).ToListAsync();
        }

        /// <summary>
        /// Adds a new MainActivity entity to the database.
        /// </summary>
        public async Task CreateAsync(MainActivity mainActivity)
        {
            await _context.MainActivities.AddAsync(mainActivity);
            // The SaveChangesAsync call is typically handled in a Unit of Work pattern
            // or in the service layer, but for simplicity, we can have it here or in the service.
            // For now, let's assume the service layer will call SaveChanges.
            // If you want the repository to be self-contained for saving:
            // await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Updates an existing MainActivity entity in the database.
        /// </summary>
        public Task UpdateAsync(MainActivity mainActivity)
        {
            _context.Entry(mainActivity).State = EntityState.Modified;
            return Task.CompletedTask;
        }

        /// <summary>
        /// Deletes a MainActivity entity from the database by its ID.
        /// </summary>
        public async Task DeleteAsync(int id)
        {
            var mainActivityToDelete = await GetByIdAsync(id);
            if (mainActivityToDelete != null)
            {
                _context.MainActivities.Remove(mainActivityToDelete);
                // await _context.SaveChangesAsync();
            }
            // If the entity is not found, we do nothing, as the end result (it's gone) is the same.
        }

        /// <summary>
        /// Checks if a MainActivity with the given ID exists.
        /// </summary>
        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.MainActivities.AnyAsync(m => m.Id == id);
        }

    }
}
