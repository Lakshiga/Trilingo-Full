namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class LevelWithLessonsResponseDto
    {
        public int LevelId { get; set; }
        public required string LevelName { get; set; }
        public int SequenceOrder { get; set; }
        public required List<LessonResponseDto> Lessons { get; set; }
    }
}
