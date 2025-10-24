namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class ActivityCompletionResponseDto
    {
        public bool IsLessonCompleted { get; set; }
        public bool IsCourseCompleted { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
