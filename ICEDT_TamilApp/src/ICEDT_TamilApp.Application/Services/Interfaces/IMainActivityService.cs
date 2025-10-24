using System.Collections.Generic;
using System.Threading.Tasks;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;

namespace ICEDT_TamilApp.Application.Services.Interfaces
{
    public interface IMainActivityService
    {
        Task<MainActivityResponseDto?> GetByIdAsync(int id);
        Task<List<MainActivityResponseDto>> GetAllAsync();
        Task<MainActivityResponseDto> CreateAsync(MainActivityRequestDto requestDto);
        Task UpdateAsync(int id, MainActivityRequestDto requestDto);
        Task DeleteAsync(int id);
    }
}
