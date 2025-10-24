public class ActivityResponseDto
{
    public int ActivityId { get; set; }
    public int LessonId { get; set; }
    public required string Title { get; set; }
    public int SequenceOrder { get; set; }
    public required string ContentJson { get; set; }

    public int ActivityTypeId { get; set; }
    public string? ActivityTypeName { get; set; }

    public int MainActivityId { get; set; }
    public string? MainActivityName { get; set; }
}
