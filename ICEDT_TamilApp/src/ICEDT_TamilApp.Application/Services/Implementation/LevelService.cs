using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.Exceptions;
using ICEDT_TamilApp.Application.Services.Interfaces;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ICEDT_TamilApp.Application.Services.Implementation
{
    public class LevelService : ILevelService
    {
        // The service now depends on the Unit of Work, not an individual repository.
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileUploader _fileUploader;

        public LevelService(IUnitOfWork unitOfWork, IFileUploader fileUploader)
        {
            _unitOfWork = unitOfWork;
            _fileUploader = fileUploader;
        }

        public async Task<LevelResponseDto> GetLevelAsync(int id)
        {
            if (id <= 0)
                throw new BadRequestException("Invalid Level ID.");

            // Access the specific repository through the Unit of Work property.
            var level = await _unitOfWork.Levels.GetByIdAsync(id);

            if (level == null)
                throw new NotFoundException("Level not found.");

            return MapToResponseDto(level);
        }

        public async Task<List<LevelResponseDto>> GetAllLevelsAsync()
        {
            var levels = await _unitOfWork.Levels.GetAllAsync();
            return levels.Select(MapToResponseDto).ToList();
        }

        public async Task<LevelResponseDto> CreateLevelAsync(LevelRequestDto dto)
        {
            // Perform validation using the repository.
            if (await _unitOfWork.Levels.SequenceOrderExistsAsync(dto.SequenceOrder))
                throw new BadRequestException(
                    $"Sequence order {dto.SequenceOrder} is already in use."
                );

            if (await _unitOfWork.Levels.SlugExistsAsync(dto.Slug))
                throw new BadRequestException($"Slug '{dto.Slug}' is already in use.");

            var level = new Level
            {
                LevelName = dto.LevelName,
                SequenceOrder = dto.SequenceOrder,
                Slug = dto.Slug,
                Barcode = dto.Barcode,
            };

            // Add the new entity to the context via the repository.
            await _unitOfWork.Levels.CreateAsync(level);

            // *** THE KEY CHANGE ***
            // Commit all changes made in this transaction to the database.
            await _unitOfWork.CompleteAsync();

            return MapToResponseDto(level);
        }

        public async Task UpdateLevelAsync(int id, LevelRequestDto dto)
        {
            if (id <= 0)
                throw new BadRequestException("Invalid Level ID.");

            var level = await _unitOfWork.Levels.GetByIdAsync(id);
            if (level == null)
                throw new NotFoundException("Level not found.");

            // Check if the sequence order is being changed AND if the new one is already taken.
            if (
                level.SequenceOrder != dto.SequenceOrder
                && await _unitOfWork.Levels.SequenceOrderExistsAsync(dto.SequenceOrder)
            )
            {
                throw new BadRequestException(
                    $"Sequence order {dto.SequenceOrder} is already in use."
                );
            }

            // Check if the slug is being changed AND if the new one is already taken.
            if (level.Slug != dto.Slug && await _unitOfWork.Levels.SlugExistsAsync(dto.Slug))
            {
                throw new BadRequestException($"Slug '{dto.Slug}' is already in use.");
            }

            // Update the entity's properties in memory.
            level.LevelName = dto.LevelName;
            level.SequenceOrder = dto.SequenceOrder;
            level.Slug = dto.Slug;
            level.CoverImageUrl = dto.CoverImageUrl;
            level.Barcode = dto.Barcode;

            // The repository's UpdateAsync method just marks the entity as Modified.
            await _unitOfWork.Levels.UpdateAsync(level);

            // *** THE KEY CHANGE ***
            // Commit the update to the database.
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteLevelAsync(int id)
        {
            var level = await _unitOfWork.Levels.GetByIdAsync(id);
            if (level == null)
                throw new NotFoundException("Level not found.");

            // The repository's DeleteAsync method removes the entity from the context.
            await _unitOfWork.Levels.DeleteAsync(id);

            // *** THE KEY CHANGE ***
            // Commit the deletion to the database.
            await _unitOfWork.CompleteAsync();
        }

        // The private DTO mapper function remains the same.
        private LevelResponseDto MapToResponseDto(Level level)
        {
            return new LevelResponseDto
            {
                LevelId = level.LevelId,
                LevelName = level.LevelName,
                Slug = level.Slug,
                SequenceOrder = level.SequenceOrder,
                CoverImageUrl = level.CoverImageUrl,
                Barcode = level.Barcode,
            };
        }

        // Implement the new method
        public async Task<LevelResponseDto> UpdateLevelCoverImageAsync(int levelId, IFormFile file)
        {
            var level = await _unitOfWork.Levels.GetByIdAsync(levelId);
            if (level == null)
            {
                throw new NotFoundException($"{nameof(Level)}, {levelId} not found");
            }

            // 1. Construct the S3 key
            var s3Key = $"levels/{level.Slug}/cover-image/{Guid.NewGuid()}_{file.FileName}";

            // 2. Upload the file using the reusable service
            var imageUrl = await _fileUploader.UploadFileAsync(file, s3Key);

            // 3. Update the entity and save to the database
            level.CoverImageUrl = imageUrl;
            await _unitOfWork.CompleteAsync();

            return MapToResponseDto(level);
        }

        public async Task<LevelResponseDto?> PartialUpdateLevelAsync(
            int id,
            JsonPatchDocument<LevelUpdateRequestDto> patchDoc
        )
        {
            var level = await _unitOfWork.Levels.GetByIdAsync(id);
            if (level == null)
            {
                // Return null or throw NotFoundException based on your preference
                return null;
            }

            // 1. Create a DTO from the existing entity data.
            var levelToPatch = new LevelUpdateRequestDto
            {
                LevelName = level.LevelName,
                Slug = level.Slug,
                SequenceOrder = level.SequenceOrder,
                CoverImageUrl = level.CoverImageUrl,
            };

            // 2. Apply the patch document to the DTO.
            //    The ModelState is needed to capture any validation errors during patching.
            var modelState = new ModelStateDictionary();
            patchDoc.ApplyTo(levelToPatch, modelState);

            if (!modelState.IsValid)
            {
                // This is a simplified way to throw validation errors.
                // In a real app, you might want to format these errors more nicely.
                throw new BadRequestException("Patch document is invalid.");
            }

            // 3. (Optional but recommended) Perform business rule validation on the patched DTO.
            //    For example, check if the new Slug is unique if it was changed.
            if (
                level.Slug != levelToPatch.Slug
                && await _unitOfWork.Levels.SlugExistsAsync(levelToPatch.Slug)
            )
            {
                throw new ConflictException($"Slug '{levelToPatch.Slug}' is already in use.");
            }

            // 4. Map the valid changes from the DTO back to the original entity.
            level.LevelName = levelToPatch.LevelName;
            level.Slug = levelToPatch.Slug;
            level.SequenceOrder = levelToPatch.SequenceOrder;
            level.CoverImageUrl = levelToPatch.CoverImageUrl;

            // 5. Save the changes to the database.
            await _unitOfWork.CompleteAsync();

            return MapToResponseDto(level);
        }

        public async Task<LevelResponseDto> UnlockLevelByBarcodeAsync(int userId, string barcode)
        {
            // 1. Find the level associated with the barcode
            var level = await _unitOfWork.Levels.GetByBarcodeAsync(barcode);
            if (level == null)
            {
                throw new NotFoundException("Invalid barcode. No matching level found.");
            }

            // 2. Check if the user already has access to prevent duplicates
            var alreadyHasAccess = await _unitOfWork.UserLevelAccesses.HasAccessAsync(
                userId,
                level.LevelId
            );
            if (alreadyHasAccess)
            {
                // You can either throw an exception or just return the level info gracefully.
                // Returning the info is a better user experience.
                return MapToResponseDto(level);
            }

            // 3. Grant access by creating a new record in the join table
            await _unitOfWork.UserLevelAccesses.GrantAccessAsync(userId, level.LevelId);
            await _unitOfWork.CompleteAsync();

            //_logger.LogInformation("User {UserId} successfully unlocked Level {LevelId} with barcode {Barcode}", userId, level.LevelId, barcode);

            return MapToResponseDto(level);
        }

        public async Task<List<LevelResponseDto>> GetUnlockedLevelsForUserAsync(int userId)
        {
            var unlockedLevels = await _unitOfWork.Levels.GetLevelsForUserAsync(userId); // New repo method
            return unlockedLevels.Select(MapToResponseDto).ToList();
        }
    }
}
