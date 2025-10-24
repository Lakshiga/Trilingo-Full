using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    public class LessonRequestDto
    {
        [Required(ErrorMessage = "Lesson name is required.")]
        [StringLength(100, ErrorMessage = "Lesson name cannot exceed 100 characters.")]
        public required string LessonName { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Sequence order is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Sequence order must be a positive number.")]

        public int SequenceOrder { get; set; }

        [Required]
        [StringLength(50)]
        // Add validation to ensure it's a valid URL slug format
        [RegularExpression(@"^[a-z0-9]+(?:-[a-z0-9]+)*$", ErrorMessage = "Slug must be lowercase alphanumeric with hyphens.")]
        public required string Slug { get; set; }

        public string? LessonImageUrl { get; set; }
    }
}
