using System.ComponentModel.DataAnnotations;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.DTOs.Shared;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace ICEDT_TamilApp.Web.Controllers
{
    [ApiController]
    [Route("api/multilingual/[controller]")]
    [Authorize(Roles = "admin")]
    public class MultilingualLevelsController : ControllerBase
    {
        private readonly ILevelService _service;

        public MultilingualLevelsController(ILevelService service) => _service = service;

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Level ID." });
            var level = await _service.GetLevelAsync(id);
            return Ok(MapToMultilingualResponse(level));
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var levels = await _service.GetAllLevelsAsync();
            var multilingualLevels = levels.Select(MapToMultilingualResponse).ToList();
            return Ok(multilingualLevels);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MultilingualLevelRequestDto dto)
        {
            // Convert multilingual DTO to regular DTO
            var regularDto = new LevelRequestDto
            {
                LevelName = System.Text.Json.JsonSerializer.Serialize(dto.LevelName),
                Slug = dto.Slug,
                SequenceOrder = dto.SequenceOrder,
                CoverImageUrl = dto.CoverImageUrl,
                Barcode = dto.Barcode
            };

            var level = await _service.CreateLevelAsync(regularDto);
            return CreatedAtAction(nameof(Get), new { id = level.LevelId }, MapToMultilingualResponse(level));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] MultilingualLevelRequestDto dto)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Level ID." });

            // Convert multilingual DTO to regular DTO
            var regularDto = new LevelRequestDto
            {
                LevelName = System.Text.Json.JsonSerializer.Serialize(dto.LevelName),
                Slug = dto.Slug,
                SequenceOrder = dto.SequenceOrder,
                CoverImageUrl = dto.CoverImageUrl,
                Barcode = dto.Barcode
            };

            await _service.UpdateLevelAsync(id, regularDto);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Level ID." });
            await _service.DeleteLevelAsync(id);
            return NoContent();
        }

        [HttpPost("{levelId}/cover-image")]
        public async Task<IActionResult> UploadLevelCoverImage(
            int levelId,
            [Required] IFormFile file
        )
        {
            var updatedLevel = await _service.UpdateLevelCoverImageAsync(levelId, file);
            return Ok(MapToMultilingualResponse(updatedLevel));
        }

        private MultilingualLevelResponseDto MapToMultilingualResponse(LevelResponseDto level)
        {
            try
            {
                var multilingualName = System.Text.Json.JsonSerializer.Deserialize<MultilingualText>(
                    level.LevelName,
                    new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                ) ?? new MultilingualText { Ta = level.LevelName, En = level.LevelName, Si = level.LevelName };

                return new MultilingualLevelResponseDto
                {
                    LevelId = level.LevelId,
                    LevelName = multilingualName,
                    Slug = level.Slug,
                    SequenceOrder = level.SequenceOrder,
                    CoverImageUrl = level.CoverImageUrl,
                    Barcode = level.Barcode
                };
            }
            catch
            {
                // Fallback if JSON parsing fails
                return new MultilingualLevelResponseDto
                {
                    LevelId = level.LevelId,
                    LevelName = new MultilingualText { Ta = level.LevelName, En = level.LevelName, Si = level.LevelName },
                    Slug = level.Slug,
                    SequenceOrder = level.SequenceOrder,
                    CoverImageUrl = level.CoverImageUrl,
                    Barcode = level.Barcode
                };
            }
        }
    }
}
