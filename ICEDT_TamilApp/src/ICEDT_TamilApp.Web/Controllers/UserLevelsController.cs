using System.Security.Claims;
using System.Threading.Tasks;
using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ICEDT_TamilApp.Web.Controllers
{
    [ApiController]
    [Route("api/user/levels")] // Base route for this controller
    [Authorize(Roles = "Student")] // Ensures only users with the "Student" role can access these endpoints
    public class UserLevelsController : ControllerBase
    {
        private readonly ILevelService _levelService;

        public UserLevelsController(ILevelService levelService)
        {
            _levelService = levelService;
        }

        /// <summary>
        /// Gets the list of levels that the currently logged-in student has unlocked.
        /// </summary>
        /// <returns>A list of the student's unlocked levels.</returns>
        [HttpGet("my-levels")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyUnlockedLevels()
        {
            // Safely get the user's ID from the JWT token's claims
            var userId = GetCurrentUserId();
            var levels = await _levelService.GetUnlockedLevelsForUserAsync(userId);
            return Ok(levels);
        }

        /// <summary>
        /// Unlocks a new level for the logged-in student by providing the book's barcode.
        /// </summary>
        /// <param name="dto">The request containing the barcode string.</param>
        /// <returns>The details of the newly unlocked level.</returns>
        [HttpPost("unlock")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UnlockLevel([FromBody] BarcodeRequestDto dto)
        {
            var userId = GetCurrentUserId();
            var unlockedLevel = await _levelService.UnlockLevelByBarcodeAsync(userId, dto.Barcode);
            return Ok(unlockedLevel);
        }

        /// <summary>
        /// A private helper method to securely get the user ID from the token claims.
        /// </summary>
        private int GetCurrentUserId()
        {
            var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdValue) || !int.TryParse(userIdValue, out var userId))
            {
                // This should not happen if the [Authorize] attribute is working,
                // but it's a good defensive check.
                throw new UnauthorizedAccessException("User ID not found in token.");
            }
            return userId;
        }
    }
}