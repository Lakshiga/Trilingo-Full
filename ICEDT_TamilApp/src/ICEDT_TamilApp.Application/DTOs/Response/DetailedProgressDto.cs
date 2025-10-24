namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class DetailedProgressDto
    {
        public long ProgressId { get; set; }
        public int ActivityId { get; set; }
        public string? ActivityTitle { get; set; } = string.Empty;
        public int LessonId { get; set; }
        public string? LessonName { get; set; } = string.Empty;
        public int LevelId { get; set; }
        public string? LevelName { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public int? Score { get; set; }
        public DateTime CompletedAt { get; set; }
    }
}