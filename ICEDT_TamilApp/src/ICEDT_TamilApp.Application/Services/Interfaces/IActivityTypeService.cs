using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;

namespace ICEDT_TamilApp.Application.Services.Interfaces
{
    public interface IActivityTypeService
    {
        // ActivityType
        Task<ActivityTypeResponseDto> GetActivityTypeAsync(int id);
        Task<List<ActivityTypeResponseDto>> GetAllActivityTypesAsync();
        Task<ActivityTypeResponseDto> AddActivityTypeAsync(ActivityTypeRequestDto dto);
        Task UpdateActivityTypeAsync(int id, ActivityTypeRequestDto dto);
        Task DeleteActivityTypeAsync(int id);
    }
}
