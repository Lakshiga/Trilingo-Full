using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TES_Learning_App.Application_Layer    .DTOs.Auth;
using TES_Learning_App.Application_Layer.Interfaces.IServices;
using TES_Learning_App.Application_Layer.DTOs.Auth.Requests;

namespace TES_Learning_App.API.Controllers
{
    public class AuthController : BaseApiController
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService) { _authService = authService; }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (!result.IsSuccess) return Unauthorized(result);
            return Ok(result);
        }

        // Example of a secure endpoint
        [HttpGet("test-auth")]
        [Authorize(Roles = "Parent")] // Only a logged-in user with the "Parent" role can access this
        public IActionResult TestAuth()
        {
            // We can get the logged-in user's info from the token claims
            var username = User.Identity?.Name;
            return Ok($"Hello, {username}! You have successfully accessed a secure endpoint.");
        }

        [HttpGet("check-admin")]
        public async Task<IActionResult> CheckAdmin()
        {
            var adminUser = await _authService.CheckAdminUserAsync();
            return Ok(adminUser);
        }

        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin()
        {
            var result = await _authService.CreateAdminUserAsync();
            return Ok(result);
        }
    }
}