using System.Collections.Generic;
using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Entities;

namespace ICEDT_TamilApp.Domain.Interfaces
{
    public interface IActivityTypeRepository
    {
        Task<ActivityType?> GetByIdAsync(int id);
        Task<List<ActivityType>> GetAllAsync();
        Task CreateAsync(ActivityType activityType);
        Task UpdateAsync(ActivityType activityType);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int activityTypeId);
        
    }
}
