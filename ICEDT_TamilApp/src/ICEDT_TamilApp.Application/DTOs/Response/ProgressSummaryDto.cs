namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class ProgressSummaryDto
    {
        public int UserId { get; set; }
        public string? Username { get; set; } = string.Empty;
        public int CurrentLevelId { get; set; }
        public string CurrentLevelName { get; set; } = string.Empty;
        public int CurrentLessonId { get; set; }
        public string? CurrentLessonName { get; set; } = string.Empty;
        public int TotalLessonsInLevel { get; set; }
        public int CompletedLessonsInLevel { get; set; }
        public int TotalActivitiesInLesson { get; set; }
        public int CompletedActivitiesInLesson { get; set; }
        public double OverallCourseCompletionPercentage { get; set; }
    }
}