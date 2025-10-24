using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    public class BarcodeRequestDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Barcode { get; set; } = string.Empty;
    }
}