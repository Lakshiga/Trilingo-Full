using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    public class ActivityTypeRequestDto
    {
        [Required(ErrorMessage = "Activity type name is required.")]
        [StringLength(50, ErrorMessage = "Activity type name cannot exceed 50 characters.")]
        public required string ActivityName { get; set; }

        [Required(ErrorMessage = "MainActivityTypeId is required.")]
        public int MainActivityTypeId { get; set; }
    }
}
