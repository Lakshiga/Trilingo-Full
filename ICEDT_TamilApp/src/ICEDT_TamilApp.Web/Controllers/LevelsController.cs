using System.ComponentModel.DataAnnotations;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace ICEDT_TamilApp.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class LevelsController : ControllerBase
    {
        private readonly ILevelService _service;

        public LevelsController(ILevelService service) => _service = service;

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Level ID." });
            var level = await _service.GetLevelAsync(id);
            return Ok(level);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllLevelsAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LevelRequestDto dto)
        {
            var level = await _service.CreateLevelAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = level.LevelId }, level);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] LevelRequestDto dto)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Level ID." });
            await _service.UpdateLevelAsync(id, dto);
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
            // The service method will handle all the logic
            var updatedLevel = await _service.UpdateLevelCoverImageAsync(levelId, file);
            return Ok(updatedLevel);
        }

        // --- NEW PATCH ENDPOINT ---
        /// <summary>
        /// Partially updates a Level.
        /// </summary>
        /// <param name="id">The ID of the level to update.</param>
        /// <param name="patchDoc">A JSON Patch document describing the changes.</param>
        /// <returns>No content if successful.</returns>
        [HttpPatch("{id:int}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PartialUpdate(
            int id,
            [FromBody] JsonPatchDocument<LevelUpdateRequestDto> patchDoc
        )
        {
            if (patchDoc == null)
            {
                return BadRequest("A JSON Patch document is required.");
            }

            // The service will handle the logic of fetching, patching, and saving.
            var updatedLevel = await _service.PartialUpdateLevelAsync(id, patchDoc);

            if (updatedLevel == null)
            {
                return NotFound($"Level with ID {id} not found.");
            }

            return NoContent();
        }
    }
}
