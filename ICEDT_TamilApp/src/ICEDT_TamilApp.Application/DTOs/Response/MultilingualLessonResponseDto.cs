using ICEDT_TamilApp.Application.DTOs.Shared;

namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class MultilingualLessonResponseDto
    {
        public int LessonId { get; set; }
        public int LevelId { get; set; }
        public required MultilingualText LessonName { get; set; }
        public MultilingualText? Description { get; set; }
        public int SequenceOrder { get; set; }
        public required string Slug { get; set; }
        public string? ImageUrl { get; set; }
        public MultilingualLevelResponseDto? Level { get; set; }
    }
}

