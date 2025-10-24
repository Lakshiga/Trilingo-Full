// In ICEDT_TamilApp.Domain/Entities/Activity.cs
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ICEDT_TamilApp.Domain.Entities
{
    public class Activity
    {
        [Key]
        public int ActivityId { get; set; }

        [Required]
        public required string Title { get; set; } // JSON string for multilingual support: {"ta": "தமிழ்", "en": "Tamil", "si": "දමිළ"}

        [Required]
        public int SequenceOrder { get; set; }

        [Required]
        public required string  ContentJson { get; set; }

        [Required]
        public int LessonId { get; set; }

        [ForeignKey("LessonId")]
        public virtual Lesson? Lesson { get; set; }

        [Required]
        public int ActivityTypeId { get; set; }

        [ForeignKey("ActivityTypeId")]
        public virtual ActivityType? ActivityType { get; set; }

        // MainActivity Relationship
        [Required]
        public int MainActivityId { get; set; }

        [ForeignKey("MainActivityId")]
        public virtual MainActivity? MainActivity { get; set; }
    }
}
