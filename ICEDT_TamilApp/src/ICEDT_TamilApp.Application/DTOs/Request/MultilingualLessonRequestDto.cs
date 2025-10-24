using System.ComponentModel.DataAnnotations;
using ICEDT_TamilApp.Application.DTOs.Shared;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    public class MultilingualLessonRequestDto
    {
        [Required(ErrorMessage = "Lesson name is required.")]
        public required MultilingualText LessonName { get; set; }

        public MultilingualText? Description { get; set; }

        [Required(ErrorMessage = "Sequence order is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Sequence order must be a positive number.")]
        public int SequenceOrder { get; set; }

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[a-z0-9]+(?:-[a-z0-9]+)*$", ErrorMessage = "Slug must be lowercase alphanumeric with hyphens.")]
        public required string Slug { get; set; }

        public string? LessonImageUrl { get; set; }
    }
}

