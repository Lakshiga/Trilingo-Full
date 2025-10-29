using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TES_Learning_App.Application_Layer.DTOs.Activity.Requests;
using TES_Learning_App.Application_Layer.DTOs.Activity.Response;
using TES_Learning_App.Application_Layer.Interfaces.IServices;

namespace TES_Learning_App.API.Controllers
{
    [Authorize(Roles = "Admin,Parent")]
    public class ActivitiesController : BaseApiController
    {
        private readonly IActivityService _activityService;

        public ActivitiesController(IActivityService activityService)
        {
            _activityService = activityService;
        }

        // GET: api/activities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityDto>>> GetAll()
        {
            return Ok(await _activityService.GetAllAsync());
        }

        // GET: api/activities/stage/5
        [HttpGet("stage/{stageId}")]
        public async Task<ActionResult<IEnumerable<ActivityDto>>> GetByStageId(int stageId)
        {
            var activities = await _activityService.GetByStageIdAsync(stageId);
            return Ok(activities);
        }

        // GET: api/activities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> GetById(int id)
        {
            var activity = await _activityService.GetByIdAsync(id);
            if (activity == null) return NotFound();
            return Ok(activity);
        }

        // POST: api/activities
        [HttpPost]
        public async Task<ActionResult<ActivityDto>> Create(CreateActivityDto dto)
        {
            var newActivity = await _activityService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newActivity.Id }, newActivity);
        }

        // PUT: api/activities/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateActivityDto dto)
        {
            await _activityService.UpdateAsync(id, dto);
            return NoContent();
        }

        // DELETE: api/activities/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _activityService.DeleteAsync(id);
            return NoContent();
        }
    }
}