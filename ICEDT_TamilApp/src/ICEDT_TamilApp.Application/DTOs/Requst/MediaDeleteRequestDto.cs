using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Application.DTOs.Requst
{
    public class MediaDeleteRequestDto
    {
        [Required]
        public required string Key { get; set; }
    }
}
