using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Domain.Entities
{
    public class Level
    {
        [Key]
        public int LevelId { get; set; }

        [Required]
        public required string LevelName { get; set; } // JSON string for multilingual support: {"ta": "தமிழ்", "en": "Tamil", "si": "දමිළ"}

        [Required]
        [StringLength(50)]
        public required string Slug { get; set; }

        [Required]
        public int SequenceOrder { get; set; }

        public string? CoverImageUrl { get; set; }

        [Required]
        [StringLength(100)]
        public required string Barcode { get; set; } // The unique barcode for this book/level

        public ICollection<Lesson>? Lessons { get; set; }

        public ICollection<UserLevelAccess> UserAccesses { get; set; } = new List<UserLevelAccess>();
    }
}
