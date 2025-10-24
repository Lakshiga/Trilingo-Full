using Microsoft.AspNetCore.JsonPatch;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using Microsoft.AspNetCore.Http;

namespace ICEDT_TamilApp.Application.Services.Interfaces
{
    public interface ILevelService
    {
        Task<LevelResponseDto> GetLevelAsync(int id);
        Task<List<LevelResponseDto>> GetAllLevelsAsync();
        Task<LevelResponseDto> CreateLevelAsync(LevelRequestDto dto);
        Task UpdateLevelAsync(int id, LevelRequestDto dto);
        Task DeleteLevelAsync(int id);

        Task<LevelResponseDto> UpdateLevelCoverImageAsync(int levelId, IFormFile file);

        Task<LevelResponseDto?> PartialUpdateLevelAsync(int id, JsonPatchDocument<LevelUpdateRequestDto> patchDoc);

        Task<LevelResponseDto> UnlockLevelByBarcodeAsync(int userId, string barcode);
        Task<List<LevelResponseDto>> GetUnlockedLevelsForUserAsync(int userId);
    }
}
