using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    public class LevelRequestDto
    {
        [Required(ErrorMessage = "Level name is required.")]
        [StringLength(100, ErrorMessage = "Level name cannot exceed 100 characters.")]
        public required string LevelName { get; set; }

        [Required]
        [StringLength(50)]
        // Add validation to ensure it's a valid URL slug format
        [RegularExpression(@"^[a-z0-9]+(?:-[a-z0-9]+)*$", ErrorMessage = "Slug must be lowercase alphanumeric with hyphens.")]
        public required string Slug { get; set; }

        [Required(ErrorMessage = "Sequence order is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Sequence order must be a positive number.")]
        public int SequenceOrder { get; set; }

        public string? CoverImageUrl { get; set; }

        [Required]
        [StringLength(50)]
        public required string Barcode { get; set; }
    }
}
