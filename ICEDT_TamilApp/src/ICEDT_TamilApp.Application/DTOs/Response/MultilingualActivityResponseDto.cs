using ICEDT_TamilApp.Application.DTOs.Shared;

namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class MultilingualActivityResponseDto
    {
        public int ActivityId { get; set; }
        public int LessonId { get; set; }
        public required MultilingualText Title { get; set; }
        public int SequenceOrder { get; set; }
        public required string ContentJson { get; set; }

        public int ActivityTypeId { get; set; }
        public string? ActivityTypeName { get; set; }

        public int MainActivityId { get; set; }
        public string? MainActivityName { get; set; }
    }
}
