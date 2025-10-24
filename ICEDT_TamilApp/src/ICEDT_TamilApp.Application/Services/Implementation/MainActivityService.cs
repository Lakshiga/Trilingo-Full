using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ICEDT_TamilApp.Application.DTOs;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.Exceptions;
using ICEDT_TamilApp.Application.Services.Interfaces;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;

namespace ICEDT_TamilApp.Application.Services.Implementation
{
    public class MainActivityService : IMainActivityService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MainActivityService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<MainActivityResponseDto?> GetByIdAsync(int id)
        {
            var mainActivity = await _unitOfWork.MainActivities.GetByIdAsync(id);
            if (mainActivity == null)
                return null;

            return new MainActivityResponseDto { Id = mainActivity.Id, Name = mainActivity.Name };
        }

        public async Task<List<MainActivityResponseDto>> GetAllAsync()
        {
            var mainActivities = await _unitOfWork.MainActivities.GetAllAsync();
            return mainActivities
                .Select(ma => new MainActivityResponseDto { Id = ma.Id, Name = ma.Name })
                .ToList();
        }

        public async Task<MainActivityResponseDto> CreateAsync(MainActivityRequestDto requestDto)
        {
            var mainActivity = new MainActivity { Name = requestDto.Name };

            await _unitOfWork.MainActivities.CreateAsync(mainActivity);
            await _unitOfWork.CompleteAsync(); // Save changes to the database

            return new MainActivityResponseDto { Id = mainActivity.Id, Name = mainActivity.Name };
        }

        public async Task UpdateAsync(int id, MainActivityRequestDto requestDto)
        {
            var mainActivityToUpdate = await _unitOfWork.MainActivities.GetByIdAsync(id);

            if (mainActivityToUpdate == null)
            {
                throw new NotFoundException($"{nameof(MainActivity)}, with {id} not found.");
            }

            // Update properties
            mainActivityToUpdate.Name = requestDto.Name;

            // EF Core is already tracking this entity, so we just need to save.
            // The repository's UpdateAsync method can be empty or just mark the state as Modified.
            await _unitOfWork.MainActivities.UpdateAsync(mainActivityToUpdate); // This might just be context.Update(entity)
            await _unitOfWork.CompleteAsync(); // Save changes to the database
        }

        public async Task DeleteAsync(int id)
        {
            var mainActivityToDelete = await _unitOfWork.MainActivities.GetByIdAsync(id);

            if (mainActivityToDelete == null)
            {
                throw new NotFoundException($"{nameof(MainActivity)}, with {id} not found.");
            }

            await _unitOfWork.MainActivities.DeleteAsync(id);
            await _unitOfWork.CompleteAsync(); // Save changes to the database
        }
    }
}
