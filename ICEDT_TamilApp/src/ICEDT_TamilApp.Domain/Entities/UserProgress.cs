using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ICEDT_TamilApp.Domain.Entities
{
    public class UserProgress
    {
        [Key]
        public int UserProgressId { get; set; }
        
        // Alias for UserProgressId to match service expectations
        public int ProgressId => UserProgressId;

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [Required]
        public int ActivityId { get; set; }

        [ForeignKey("ActivityId")]
        public virtual Activity? Activity { get; set; }

        [Required]
        public int LessonId { get; set; }

        [ForeignKey("LessonId")]
        public virtual Lesson? Lesson { get; set; }

        [Required]
        public int LevelId { get; set; }

        [ForeignKey("LevelId")]
        public virtual Level? Level { get; set; }

        [Required]
        public int MainActivityId { get; set; }

        [ForeignKey("MainActivityId")]
        public virtual MainActivity? MainActivity { get; set; }

        public bool IsCompleted { get; set; } = false;

        public int Score { get; set; } = 0;

        public int MaxScore { get; set; } = 0;

        public int Attempts { get; set; } = 0;

        public DateTime? CompletedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Learning stage tracking
        [MaxLength(20)]
        public string? LearningStage { get; set; } // "letters", "words", "sentences"

        // Additional progress data as JSON
        public string? ProgressData { get; set; } // JSON for storing additional progress information
    }
}