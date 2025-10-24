using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;

namespace ICEDT_TamilApp.Application.Services.Interfaces
{
    public interface IActivityService
    {
        // Activity
        Task<ActivityResponseDto> GetActivityAsync(int id);
        Task<List<ActivityResponseDto>> GetAllActivitiesAsync();
        Task<List<ActivityResponseDto>> GetActivitiesByLessonIdAsync(int lessonId);
        Task<ActivityResponseDto> CreateActivityAsync(ActivityRequestDto dto);
        Task<ActivityResponseDto> UpdateActivityAsync(int id, ActivityRequestDto dto);
        Task DeleteActivityAsync(int id);
    }
}
