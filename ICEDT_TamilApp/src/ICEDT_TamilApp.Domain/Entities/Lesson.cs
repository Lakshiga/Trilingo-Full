using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ICEDT_TamilApp.Domain.Entities
{
    public class Lesson
    {
        [Key]
        public int LessonId { get; set; }

        [Required]
        public string? LessonName { get; set; } // JSON string for multilingual support: {"ta": "தமிழ்", "en": "Tamil", "si": "දමිළ"}

        [Required]
        [StringLength(50)]
        public required string Slug { get; set; }

        [Required]
        public string? Description { get; set; } // JSON string for multilingual support: {"ta": "தமிழ்", "en": "Tamil", "si": "දමිළ"}

        [Required]
        public int SequenceOrder { get; set; }

        public string? LessonImageUrl { get; set; }

        [Required]
        public int LevelId { get; set; }

        [ForeignKey("LevelId")]
        public virtual Level? Level { get; set; }

        public virtual ICollection<Activity>? Activities { get; set; }

        public virtual ICollection<UserCurrentProgress>? UserCurrentProgress { get; set; }
    }
}
