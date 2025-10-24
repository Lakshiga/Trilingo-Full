using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TES_Learning_App.Application_Layer.DTOs.MainActivity.Requests;
using TES_Learning_App.Application_Layer.DTOs.MainActivity.Response;
using TES_Learning_App.Application_Layer.Interfaces.IServices;
using TES_Learning_App.Application_Layer.Services;

namespace TES_Learning_App.API.Controllers
{
    [Authorize(Roles = "Admin,Parent")]
    public class MainActivitiesController : BaseApiController
    {
        private readonly IMainActivityService _mainActivityService;

        public MainActivitiesController(IMainActivityService mainActivityService)
        {
            _mainActivityService = mainActivityService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MainActivityDto>>> GetAll()
        {
            return Ok(await _mainActivityService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MainActivityDto>> GetById(int id)
        {
            var mainActivity = await _mainActivityService.GetByIdAsync(id);
            if (mainActivity == null) return NotFound();
            return Ok(mainActivity);
        }

        [HttpPost]
        public async Task<ActionResult<MainActivityDto>> Create(CreateMainActivityDto dto)
        {
            var newMainActivity = await _mainActivityService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newMainActivity.Id }, newMainActivity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateMainActivityDto dto)
        {
            await _mainActivityService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _mainActivityService.DeleteAsync(id);
            return NoContent();
        }
    }
}
