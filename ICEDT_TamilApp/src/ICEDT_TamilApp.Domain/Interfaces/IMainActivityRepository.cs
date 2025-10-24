using System.Collections.Generic;
using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Entities;

namespace ICEDT_TamilApp.Domain.Interfaces
{
    public interface IMainActivityRepository
    {
        Task<MainActivity?> GetByIdAsync(int mainActivityTypeId);
        Task<List<MainActivity>> GetAllAsync();
        Task CreateAsync(MainActivity mainActivity);
        Task UpdateAsync(MainActivity mainActivity);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int mainActivityId);

    }
}
