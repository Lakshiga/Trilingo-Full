using System.Collections.Generic;
using System.Threading.Tasks;
using ICEDT_TamilApp.Application.DTOs;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ICEDT_TamilApp.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MainActivitiesController : ControllerBase
    {
        private readonly IMainActivityService _mainActivityService;

        public MainActivitiesController(IMainActivityService mainActivityService)
        {
            _mainActivityService = mainActivityService;
        }

        /// <summary>
        /// Gets all Main Activity entries.
        /// </summary>
        /// <returns>A list of Main Activities.</returns>
        [HttpGet]
        [Authorize(Roles = "admin,Student")]
        [ProducesResponseType(typeof(List<MainActivityResponseDto>), 200)]
        public async Task<IActionResult> GetAll()
        {
            var mainActivities = await _mainActivityService.GetAllAsync();
            return Ok(mainActivities);
        }

        /// <summary>
        /// Gets a specific Main Activity by its ID.
        /// </summary>
        /// <param name="id">The ID of the Main Activity.</param>
        /// <returns>The requested Main Activity.</returns>
        [HttpGet("{id}")]
        [Authorize(Roles = "admin,Student")]
        [ProducesResponseType(typeof(MainActivityResponseDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(int id)
        {
            var mainActivity = await _mainActivityService.GetByIdAsync(id);
            if (mainActivity == null)
            {
                // The NotFoundException will be caught by your middleware,
                // but it's good practice to handle the null case explicitly in the controller too.
                return NotFound($"Main Activity with ID {id} not found.");
            }
            return Ok(mainActivity);
        }

        /// <summary>
        /// Creates a new Main Activity.
        /// </summary>
        /// <param name="requestDto">The data for the new Main Activity.</param>
        /// <returns>The newly created Main Activity.</returns>
        [HttpPost]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(MainActivityResponseDto), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] MainActivityRequestDto requestDto)
        {
            // ModelState validation is handled automatically by the [ApiController] attribute.
            // If the requestDto is invalid, a 400 Bad Request is returned before this code runs.

            var newMainActivity = await _mainActivityService.CreateAsync(requestDto);

            // Return a 201 Created status code with a Location header pointing to the new resource.
            return CreatedAtAction(
                nameof(GetById),
                new { id = newMainActivity.Id },
                newMainActivity
            );
        }

        /// <summary>
        /// Updates an existing Main Activity.
        /// </summary>
        /// <param name="id">The ID of the Main Activity to update.</param>
        /// <param name="requestDto">The updated data.</param>
        /// <returns>No content if successful.</returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] MainActivityRequestDto requestDto
        )
        {
            await _mainActivityService.UpdateAsync(id, requestDto);
            // The service will throw a NotFoundException if the ID doesn't exist,
            // which your middleware will handle and turn into a 404 response.

            return NoContent(); // Standard HTTP 204 response for a successful update.
        }

        /// <summary>
        /// Deletes a Main Activity.
        /// </summary>
        /// <param name="id">The ID of the Main Activity to delete.</param>
        /// <returns>No content if successful.</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            await _mainActivityService.DeleteAsync(id);
            // The service will throw a NotFoundException if the ID doesn't exist,
            // which your middleware will handle and turn into a 404 response.

            return NoContent(); // Standard HTTP 204 response for a successful delete.
        }
    }
}
