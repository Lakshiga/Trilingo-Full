using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Application.DTOs.Request
{
    public class FileUploadRequestDto
    {
        [Required]
        public required IFormFile File { get; set; }

        [Required]
        public int LevelId { get; set; }

        [Required]
        public int LessonId { get; set; }

        [Required]
        public string MediaType { get; set; } = string.Empty;
    }
}