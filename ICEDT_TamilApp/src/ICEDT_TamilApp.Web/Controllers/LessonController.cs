using System.ComponentModel.DataAnnotations;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ICEDT_TamilApp.Web.Controllers
{
    [ApiController]
    [Route("api")]
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _service;

        public LessonController(ILessonService service) => _service = service;

        [HttpPost("levels/{levelId:int}/lessons")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddLesson(int levelId, [FromBody] LessonRequestDto dto)
        {
            if (levelId <= 0)
                return BadRequest(new { message = "Invalid Level ID." });
            var lesson = await _service.CreateLessonToLevelAsync(levelId, dto);
            return CreatedAtAction(nameof(GetLessonsByLevelId), new { levelId }, lesson);
        }

        [HttpDelete("levels/{levelId:int}/lessons/{lessonId:int}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> RemoveLesson(int levelId, int lessonId)
        {
            if (levelId <= 0 || lessonId <= 0)
                return BadRequest(new { message = "Invalid  ID." });
            await _service.RemoveLessonFromLevelAsync(levelId, lessonId);
            return NoContent();
        }

        [HttpGet("levels/{levelId:int}/lessons")]
        [Authorize(Roles = "admin,Student")]
        public async Task<IActionResult> GetLessonsByLevelId(int levelId)
        {
            if (levelId <= 0)
                return BadRequest(new { message = "Invalid Level ID." });
            var result = await _service.GetLessonsByLevelIdAsync(levelId);
            return Ok(result);
        }

        [HttpPut("lessons/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateLesson(
            int id,
            [FromBody] LessonRequestDto updateLessonDto
        )
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid  ID." });
            var result = await _service.UpdateLessonAsync(id, updateLessonDto);
            return Ok(result);
        }

        [HttpDelete("lessons/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            var success = await _service.DeleteLessonAsync(id);
            if (!success)
            {
                return NotFound($"Lesson with ID {id} not found.");
            }
            return NoContent(); // Standard 204 response for a successful delete
        }

        [HttpGet("lessons/{id:int}")]
        [Authorize(Roles = "admin,Student")]
        public async Task<IActionResult> Get(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Lesson ID." });
            var lesson = await _service.GetLessonByIdAsync(id);
            return Ok(lesson);
        }

        [HttpPost("{lessonId}/image")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UploadLessonImage(int lessonId, [Required] IFormFile file)
        {
            var updatedLesson = await _service.UpdateLessonImageAsync(lessonId, file);
            return Ok(updatedLesson);
        }

        /// <summary>
        /// Gets a summary of the types of main activities (e.g., Video, Learning) available in a specific lesson.
        /// </summary>
        /// <param name="lessonId">The ID of the lesson.</param>
        /// <returns>A list of available main activity types for the lesson.</returns>
        [HttpGet("lessons/{lessonId}/main-activity-summary")]
        [Authorize(Roles = "admin,Student")]
        [ProducesResponseType(typeof(List<MainActivityResponseDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetMainActivitySummary(int lessonId)
        {
            var summary = await _service.GetMainActivitySummaryAsync(lessonId);
            return Ok(summary);
        }
    }
}
