using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ICEDT_TamilApp.Domain.Entities
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Username { get; set; }

        [Required]
        [MaxLength(255)]
        public required string Email { get; set; }

        [Required]
        [MaxLength(255)]
        public required string PasswordHash { get; set; }

        [Required]
        [MaxLength(10)]
        public required string NativeLanguage { get; set; } // "ta", "en", "si"

        [Required]
        [MaxLength(10)]
        public required string TargetLanguage { get; set; } // "ta", "en", "si"

        [MaxLength(10)]
        public string? CurrentLearningLanguage { get; set; } // Can be changed in settings

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        public bool IsActive { get; set; } = true;

        // JWT Refresh Token properties
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // User role for authorization
        [MaxLength(20)]
        public string Role { get; set; } = "User"; // Default role

        // Navigation properties
        public virtual ICollection<UserProgress> UserProgresses { get; set; } = new List<UserProgress>();
        public virtual UserCurrentProgress? UserCurrentProgress { get; set; }
        public virtual ICollection<UserLevelAccess> LevelAccesses { get; set; } = new List<UserLevelAccess>();
    }
}