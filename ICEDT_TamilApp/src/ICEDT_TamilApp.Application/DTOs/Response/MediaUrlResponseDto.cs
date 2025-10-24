namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class MediaUrlResponseDto
    {
        public required string Url { get; set; }
        public required string Key { get; set; }
        public int ExpiryMinutes { get; set; }
    }
}
