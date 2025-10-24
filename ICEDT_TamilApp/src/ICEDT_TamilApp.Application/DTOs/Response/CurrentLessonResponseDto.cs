using ICEDT_TamilApp.Application.DTOs; // Assuming your other DTOs are here

namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class CurrentLessonResponseDto
    {
        public int LessonId { get; set; }
        public string? LessonName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public IEnumerable<ActivityResponseDto> Activities { get; set; } =
            new List<ActivityResponseDto>();
    }
}
