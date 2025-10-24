using System.ComponentModel.DataAnnotations;
using ICEDT_TamilApp.Domain.Entities;

namespace ICEDT_TamilApp.Domain.Entities
{
    public class UserCurrentProgress
    {
        // This forms a one-to-one relationship with the User table
        public DateTime LastActivityAt { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }
        public virtual User? User { get; set; }

        public int CurrentLessonId { get; set; }
        public virtual Lesson? CurrentLesson { get; set; }
    }
}
