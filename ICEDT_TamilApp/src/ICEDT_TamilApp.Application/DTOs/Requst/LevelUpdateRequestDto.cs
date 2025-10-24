using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    // This DTO represents the fields that ARE ALLOWED to be updated via PATCH.
    public class LevelUpdateRequestDto
    {
        [Required]
        [StringLength(100)]
        public required string LevelName { get; set; }

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[a-z0-9]+(?:-[a-z0-9]+)*$")]
        public required string Slug { get; set; }

        [Required]
        public int SequenceOrder { get; set; }
        
        public string? CoverImageUrl { get; set; }
    }
}