using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.Exceptions;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.DTOs.Shared;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ICEDT_TamilApp.Web.Controllers
{
    [ApiController]
    [Route("api/multilingual")]
    public class MultilingualActivitiesController : ControllerBase
    {
        private readonly IActivityService _service;

        public MultilingualActivitiesController(IActivityService service) => _service = service;

        [HttpGet("activities/{id:int}")]
        [Authorize(Roles = "admin,Student")]
        public async Task<IActionResult> Get(int id)
        {
            if (id <= 0)
                throw new BadRequestException("Invalid Activity ID.");
            var activity = await _service.GetActivityAsync(id);
            return Ok(MapToMultilingualResponse(activity));
        }

        [HttpGet("activities")]
        [Authorize(Roles = "admin,Student")]
        public async Task<IActionResult> GetAll()
        {
            var activities = await _service.GetAllActivitiesAsync();
            var multilingualActivities = activities.Select(MapToMultilingualResponse).ToList();
            return Ok(multilingualActivities);
        }

        [HttpGet("lessons/{lessonId:int}/activities")]
        [Authorize(Roles = "admin,Student")]
        public async Task<IActionResult> GetActivitiesByLessonId(int lessonId)
        {
            if (lessonId <= 0)
                throw new BadRequestException("Invalid Lesson ID.");
            var activities = await _service.GetActivitiesByLessonIdAsync(lessonId);
            var multilingualActivities = activities.Select(MapToMultilingualResponse).ToList();
            return Ok(multilingualActivities);
        }

        [HttpPost("activities")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] MultilingualActivityRequestDto dto)
        {
            // Convert multilingual DTO to regular DTO
            var regularDto = new ActivityRequestDto
            {
                LessonId = dto.LessonId,
                ActivityTypeId = dto.ActivityTypeId,
                Title = System.Text.Json.JsonSerializer.Serialize(dto.Title),
                SequenceOrder = dto.SequenceOrder,
                ContentJson = dto.ContentJson,
                MainActivityId = dto.MainActivityId
            };

            var activity = await _service.CreateActivityAsync(regularDto);
            return CreatedAtAction(nameof(Get), new { id = activity.ActivityId }, MapToMultilingualResponse(activity));
        }

        [HttpPut("activities/{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromBody] MultilingualActivityRequestDto dto)
        {
            if (id <= 0)
                throw new BadRequestException("Invalid Activity ID.");

            // Convert multilingual DTO to regular DTO
            var regularDto = new ActivityRequestDto
            {
                LessonId = dto.LessonId,
                ActivityTypeId = dto.ActivityTypeId,
                Title = System.Text.Json.JsonSerializer.Serialize(dto.Title),
                SequenceOrder = dto.SequenceOrder,
                ContentJson = dto.ContentJson,
                MainActivityId = dto.MainActivityId
            };

            var activity = await _service.UpdateActivityAsync(id, regularDto);
            return Ok(MapToMultilingualResponse(activity));
        }

        [HttpDelete("activities/{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
                throw new BadRequestException("Invalid Activity ID.");
            await _service.DeleteActivityAsync(id);
            return Ok(new { message = $"Activity with ID {id} deleted successfully." });
        }

        private MultilingualActivityResponseDto MapToMultilingualResponse(ActivityResponseDto activity)
        {
            try
            {
                var multilingualTitle = System.Text.Json.JsonSerializer.Deserialize<MultilingualText>(
                    activity.Title,
                    new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                ) ?? new MultilingualText { Ta = activity.Title, En = activity.Title, Si = activity.Title };

                return new MultilingualActivityResponseDto
                {
                    ActivityId = activity.ActivityId,
                    LessonId = activity.LessonId,
                    Title = multilingualTitle,
                    SequenceOrder = activity.SequenceOrder,
                    ContentJson = activity.ContentJson,
                    ActivityTypeId = activity.ActivityTypeId,
                    ActivityTypeName = activity.ActivityTypeName,
                    MainActivityId = activity.MainActivityId,
                    MainActivityName = activity.MainActivityName
                };
            }
            catch
            {
                // Fallback if JSON parsing fails
                return new MultilingualActivityResponseDto
                {
                    ActivityId = activity.ActivityId,
                    LessonId = activity.LessonId,
                    Title = new MultilingualText { Ta = activity.Title, En = activity.Title, Si = activity.Title },
                    SequenceOrder = activity.SequenceOrder,
                    ContentJson = activity.ContentJson,
                    ActivityTypeId = activity.ActivityTypeId,
                    ActivityTypeName = activity.ActivityTypeName,
                    MainActivityId = activity.MainActivityId,
                    MainActivityName = activity.MainActivityName
                };
            }
        }
    }
}
