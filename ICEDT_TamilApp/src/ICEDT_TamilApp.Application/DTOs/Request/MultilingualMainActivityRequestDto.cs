using System.ComponentModel.DataAnnotations;
using ICEDT_TamilApp.Application.DTOs.Shared;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    public class MultilingualMainActivityRequestDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;

        public MultilingualText? Title { get; set; }

        public MultilingualText? Description { get; set; }
    }
}

