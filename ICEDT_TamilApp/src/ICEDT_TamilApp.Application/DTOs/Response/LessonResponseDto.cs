namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class LessonResponseDto
    {
        public int LessonId { get; set; }
        public int LevelId { get; set; }
        public string? LessonName { get; set; }
        public string? Description { get; set; }
        public int SequenceOrder { get; set; }

        public string? Slug { get; set; }
        public string? LessonImageUrl { get; set; }
    }
}
