using System.ComponentModel.DataAnnotations;
using ICEDT_TamilApp.Application.DTOs.Shared;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    public class MultilingualLevelRequestDto
    {
        [Required(ErrorMessage = "Level name is required.")]
        public required MultilingualText LevelName { get; set; }

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[a-z0-9]+(?:-[a-z0-9]+)*$", ErrorMessage = "Slug must be lowercase alphanumeric with hyphens.")]
        public required string Slug { get; set; }

        [Required(ErrorMessage = "Sequence order is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Sequence order must be a positive number.")]
        public int SequenceOrder { get; set; }

        public string? CoverImageUrl { get; set; }

        [Required]
        [StringLength(100)]
        public required string Barcode { get; set; }
    }
}
