using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.DTOs.Shared;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ICEDT_TamilApp.Web.Controllers
{
    [ApiController]
    [Route("api/multilingual/mainactivities")]
    public class MultilingualMainActivitiesController : ControllerBase
    {
        private readonly IMainActivityService _service;

        public MultilingualMainActivitiesController(IMainActivityService service) => _service = service;

        [HttpGet("{id:int}")]
        [Authorize(Roles = "admin,Student")]
        public async Task<IActionResult> Get(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Main Activity ID." });
            
            var mainActivity = await _service.GetByIdAsync(id);
            if (mainActivity == null)
                return NotFound($"Main Activity with ID {id} not found.");
            
            return Ok(MapToMultilingualResponse(mainActivity));
        }

        [HttpGet]
        [Authorize(Roles = "admin,Student")]
        public async Task<IActionResult> GetAll()
        {
            var mainActivities = await _service.GetAllAsync();
            var multilingualMainActivities = mainActivities.Select(MapToMultilingualResponse).ToList();
            return Ok(multilingualMainActivities);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] MultilingualMainActivityRequestDto dto)
        {
            // Convert multilingual DTO to regular DTO
            var regularDto = new MainActivityRequestDto
            {
                Name = dto.Name
            };

            var mainActivity = await _service.CreateAsync(regularDto);
            return CreatedAtAction(nameof(Get), new { id = mainActivity.Id }, MapToMultilingualResponse(mainActivity));
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromBody] MultilingualMainActivityRequestDto dto)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Main Activity ID." });

            // Convert multilingual DTO to regular DTO
            var regularDto = new MainActivityRequestDto
            {
                Name = dto.Name
            };

            await _service.UpdateAsync(id, regularDto);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Main Activity ID." });
            
            await _service.DeleteAsync(id);
            return NoContent();
        }

        private MultilingualMainActivityResponseDto MapToMultilingualResponse(MainActivityResponseDto mainActivity)
        {
            return new MultilingualMainActivityResponseDto
            {
                Id = mainActivity.Id,
                Name = mainActivity.Name,
                Title = new MultilingualText { Ta = mainActivity.Name, En = mainActivity.Name, Si = mainActivity.Name },
                Description = new MultilingualText { Ta = mainActivity.Name, En = mainActivity.Name, Si = mainActivity.Name }
            };
        }
    }
}

