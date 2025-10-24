using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Application.DTOs.Shared
{
    public class MultilingualText
    {
        [Required(ErrorMessage = "Tamil text is required.")]
        [StringLength(200, ErrorMessage = "Tamil text cannot exceed 200 characters.")]
        public required string Ta { get; set; }

        [Required(ErrorMessage = "English text is required.")]
        [StringLength(200, ErrorMessage = "English text cannot exceed 200 characters.")]
        public required string En { get; set; }

        [Required(ErrorMessage = "Sinhala text is required.")]
        [StringLength(200, ErrorMessage = "Sinhala text cannot exceed 200 characters.")]
        public required string Si { get; set; }
    }
}

