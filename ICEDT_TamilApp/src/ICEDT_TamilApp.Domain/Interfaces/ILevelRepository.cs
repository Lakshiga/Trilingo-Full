using System.Collections.Generic;
using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Entities;

namespace ICEDT_TamilApp.Domain.Interfaces
{
    public interface ILevelRepository
    {
        Task<Level?> GetByIdAsync(int id);
        Task<List<Level>> GetAllAsync();
        Task CreateAsync(Level level);
        Task UpdateAsync(Level level);
        Task DeleteAsync(int id);

        Task<bool> SequenceOrderExistsAsync(int sequenceOrder);
        Task<bool> SlugExistsAsync(string slug);
        Task<bool> LevelExistsAsync(int levelId);

        /// <summary>
        /// Finds a level by its unique barcode string.
        /// </summary>
        Task<Level?> GetByBarcodeAsync(string barcode);

        /// <summary>
        /// Gets a list of all levels that a specific user has unlocked.
        /// </summary>
        Task<List<Level>> GetLevelsForUserAsync(int userId);
    }
}
