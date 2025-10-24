using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    public class ActivityCompletionRequestDto
    {
        [Required]
        public int ActivityId { get; set; }
        public int? Score { get; set; }
    }
}
