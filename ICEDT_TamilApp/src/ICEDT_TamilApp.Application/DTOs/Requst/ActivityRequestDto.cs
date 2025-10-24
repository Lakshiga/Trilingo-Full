using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    public class ActivityRequestDto
    {
        [Required(ErrorMessage = "Lesson ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Lesson ID must be a positive number.")]
        public int LessonId { get; set; }

        [Required(ErrorMessage = "Activity Type ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Activity Type ID must be a positive number.")]
        public int ActivityTypeId { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        public required string Title { get; set; }

        [Required(ErrorMessage = "Sequence order is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Sequence order must be a positive number.")]
        public int SequenceOrder { get; set; }

        [Required(ErrorMessage = "Content JSON is required.")]
        public required string ContentJson { get; set; }

        [Required(ErrorMessage = "Main Activity ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Main Activity ID must be a positive number.")]
        public int MainActivityId { get; set; }
    }
}
