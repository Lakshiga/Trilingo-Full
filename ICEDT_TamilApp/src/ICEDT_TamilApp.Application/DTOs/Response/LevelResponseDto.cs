namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class LevelResponseDto
    {
        public int LevelId { get; set; }
        public required string LevelName { get; set; }

        public required string Slug { get; set; }
        public int SequenceOrder { get; set; }

        public string? CoverImageUrl { get; set; }
        
        public required string Barcode { get; set; }
    }
}
