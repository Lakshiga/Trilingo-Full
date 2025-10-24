using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.Exceptions;
using ICEDT_TamilApp.Application.Services.Interfaces;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;

namespace ICEDT_TamilApp.Application.Services.Implementation
{
    public class ActivityTypeService : IActivityTypeService
    {
        // Single dependency on IUnitOfWork
        private readonly IUnitOfWork _unitOfWork;

        public ActivityTypeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ActivityTypeResponseDto> GetActivityTypeAsync(int id)
        {
            var type = await _unitOfWork.ActivityTypes.GetByIdAsync(id);
            if (type == null)
                throw new NotFoundException("ActivityType not found.");
            return MapToActivityTypeResponseDto(type);
        }

        public async Task<List<ActivityTypeResponseDto>> GetAllActivityTypesAsync()
        {
            var types = await _unitOfWork.ActivityTypes.GetAllAsync();
            return types.Select(MapToActivityTypeResponseDto).ToList();
        }

        public async Task<ActivityTypeResponseDto> AddActivityTypeAsync(ActivityTypeRequestDto dto)
        {
            var type = new ActivityType { Name = dto.ActivityName };
            
            await _unitOfWork.ActivityTypes.CreateAsync(type);
            
            // Commit the transaction
            await _unitOfWork.CompleteAsync();

            return MapToActivityTypeResponseDto(type);
        }

        public async Task UpdateActivityTypeAsync(int id, ActivityTypeRequestDto dto)
        {
            var type = await _unitOfWork.ActivityTypes.GetByIdAsync(id);
            if (type == null)
                throw new NotFoundException("ActivityType not found.");
            
            type.Name = dto.ActivityName;
            
            await _unitOfWork.ActivityTypes.UpdateAsync(type);
            
            // Commit the transaction
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteActivityTypeAsync(int id)
        {
            var type = await _unitOfWork.ActivityTypes.GetByIdAsync(id);
            if (type == null)
                throw new NotFoundException("ActivityType not found.");

            // Business Rule: Check for dependent activities before deleting.
            // This is a perfect use case for the Unit of Work, as it provides
            // access to the Activities repository within the same transaction context.
            var hasActivities = await _unitOfWork.Activities.HasActivitiesOfTypeAsync(id); // A more efficient repository method
            if (hasActivities)
            {
                throw new BadRequestException("Cannot delete ActivityType because it is currently in use by one or more Activities.");
            }

            await _unitOfWork.ActivityTypes.DeleteAsync(id);
            
            // Commit the transaction
            await _unitOfWork.CompleteAsync();
        }

        private ActivityTypeResponseDto MapToActivityTypeResponseDto(ActivityType type)
        {
            return new ActivityTypeResponseDto
            {
                ActivityTypeId = type.ActivityTypeId,
                ActivityName = type.Name,
            };
        }
    }
}