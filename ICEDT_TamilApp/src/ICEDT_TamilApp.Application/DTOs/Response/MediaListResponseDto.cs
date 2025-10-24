namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class MediaListResponseDto
    {
        public required List<string> Files { get; set; }
        public int Count { get; set; }
        public required string Folder { get; set; }
    }
}
