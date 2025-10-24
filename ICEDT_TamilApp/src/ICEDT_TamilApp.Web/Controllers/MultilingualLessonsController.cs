using System.ComponentModel.DataAnnotations;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.DTOs.Shared;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ICEDT_TamilApp.Web.Controllers
{
    [ApiController]
    [Route("api/multilingual/lessons")]
    public class MultilingualLessonsController : ControllerBase
    {
        private readonly ILessonService _service;

        public MultilingualLessonsController(ILessonService service) => _service = service;

        [HttpGet("{id:int}")]
        [Authorize(Roles = "admin,Student")]
        public async Task<IActionResult> Get(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Lesson ID." });
            
            var lesson = await _service.GetLessonByIdAsync(id);
            if (lesson == null)
                return NotFound($"Lesson with ID {id} not found.");
            
            return Ok(MapToMultilingualResponse(lesson));
        }

        [HttpGet]
        [Authorize(Roles = "admin,Student")]
        public async Task<IActionResult> GetAll()
        {
            // This endpoint might not be needed as lessons are typically fetched by level
            return BadRequest(new { message = "Lessons should be fetched by level ID. Use GET /api/multilingual/levels/{levelId}/lessons" });
        }

        [HttpGet("levels/{levelId:int}/lessons")]
        [Authorize(Roles = "admin,Student")]
        public async Task<IActionResult> GetLessonsByLevelId(int levelId)
        {
            if (levelId <= 0)
                return BadRequest(new { message = "Invalid Level ID." });
            
            var lessons = await _service.GetLessonsByLevelIdAsync(levelId);
            var multilingualLessons = lessons.Select(MapToMultilingualResponse).ToList();
            return Ok(multilingualLessons);
        }

        [HttpPost("levels/{levelId:int}/lessons")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create(int levelId, [FromBody] MultilingualLessonRequestDto dto)
        {
            if (levelId <= 0)
                return BadRequest(new { message = "Invalid Level ID." });

            // Convert multilingual DTO to regular DTO
            var regularDto = new LessonRequestDto
            {
                LessonName = System.Text.Json.JsonSerializer.Serialize(dto.LessonName),
                Description = dto.Description != null ? System.Text.Json.JsonSerializer.Serialize(dto.Description) : null,
                SequenceOrder = dto.SequenceOrder,
                Slug = dto.Slug
            };

            var lesson = await _service.CreateLessonToLevelAsync(levelId, regularDto);
            return CreatedAtAction(nameof(GetLessonsByLevelId), new { levelId }, MapToMultilingualResponse(lesson));
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromBody] MultilingualLessonRequestDto dto)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Lesson ID." });

            // Convert multilingual DTO to regular DTO
            var regularDto = new LessonRequestDto
            {
                LessonName = System.Text.Json.JsonSerializer.Serialize(dto.LessonName),
                Description = dto.Description != null ? System.Text.Json.JsonSerializer.Serialize(dto.Description) : null,
                SequenceOrder = dto.SequenceOrder,
                Slug = dto.Slug
            };

            var lesson = await _service.UpdateLessonAsync(id, regularDto);
            return Ok(MapToMultilingualResponse(lesson));
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Lesson ID." });
            
            var success = await _service.DeleteLessonAsync(id);
            if (!success)
            {
                return NotFound($"Lesson with ID {id} not found.");
            }
            return NoContent();
        }

        [HttpPost("{lessonId}/image")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UploadLessonImage(int lessonId, [Required] IFormFile file)
        {
            var updatedLesson = await _service.UpdateLessonImageAsync(lessonId, file);
            return Ok(MapToMultilingualResponse(updatedLesson));
        }

        private MultilingualLessonResponseDto MapToMultilingualResponse(LessonResponseDto lesson)
        {
            try
            {
                var multilingualName = System.Text.Json.JsonSerializer.Deserialize<MultilingualText>(
                    lesson.LessonName,
                    new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                ) ?? new MultilingualText { Ta = lesson.LessonName, En = lesson.LessonName, Si = lesson.LessonName };

                MultilingualText? multilingualDescription = null;
                if (!string.IsNullOrEmpty(lesson.Description))
                {
                    try
                    {
                        multilingualDescription = System.Text.Json.JsonSerializer.Deserialize<MultilingualText>(
                            lesson.Description,
                            new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                        );
                    }
                    catch
                    {
                        multilingualDescription = new MultilingualText { Ta = lesson.Description, En = lesson.Description, Si = lesson.Description };
                    }
                }

                return new MultilingualLessonResponseDto
                {
                    LessonId = lesson.LessonId,
                    LevelId = lesson.LevelId,
                    LessonName = multilingualName,
                    Description = multilingualDescription,
                    SequenceOrder = lesson.SequenceOrder,
                    Slug = lesson.Slug,
                    ImageUrl = lesson.LessonImageUrl,
                    Level = null // Level information is not included in LessonResponseDto
                };
            }
            catch
            {
                // Fallback if JSON parsing fails
                return new MultilingualLessonResponseDto
                {
                    LessonId = lesson.LessonId,
                    LevelId = lesson.LevelId,
                    LessonName = new MultilingualText { Ta = lesson.LessonName, En = lesson.LessonName, Si = lesson.LessonName },
                    Description = !string.IsNullOrEmpty(lesson.Description) ? 
                        new MultilingualText { Ta = lesson.Description, En = lesson.Description, Si = lesson.Description } : null,
                    SequenceOrder = lesson.SequenceOrder,
                    Slug = lesson.Slug,
                    ImageUrl = lesson.LessonImageUrl,
                    Level = null // Level information is not included in LessonResponseDto
                };
            }
        }
    }
}
