namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class MediaFileDto
    {
        public string Key { get; set; } = string.Empty; // The full S3 key (path)
        public string Url { get; set; } = string.Empty; // The full public URL
        public string FileName { get; set; } = string.Empty; // The original file name
        public long? Size { get; set; }
        public DateTime? LastModified { get; set; }
    }
}