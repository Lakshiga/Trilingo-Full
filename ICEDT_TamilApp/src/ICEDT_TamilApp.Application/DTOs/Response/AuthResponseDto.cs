namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class AuthResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }

        public string? RefreshToken { get; set; }
    }
}
