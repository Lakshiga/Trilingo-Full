namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class MediaUploadResponseDto
    {
        public required string Key { get; set; }
        public required string FileName { get; set; }
        public long Size { get; set; }
        public  string? ContentType { get; set; }
        public required string Url { get; set; }
        public string Message { get; set; } = "File uploaded successfully";
    }
}
