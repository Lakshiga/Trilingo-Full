using System.Threading.Tasks;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;

namespace ICEDT_TamilApp.Application.Services.Interfaces
{
    public interface IProgressService
    {
        Task<CurrentLessonResponseDto?> GetCurrentLessonForUserAsync(int userId);
        Task<ActivityCompletionResponseDto> CompleteActivityAsync(
            int userId,
            ActivityCompletionRequestDto request
        );

        Task<ProgressSummaryDto> GetUserProgressSummaryAsync(int userId);
        Task<List<DetailedProgressDto>> GetDetailedProgressForUserAsync(int userId);
    }
}
