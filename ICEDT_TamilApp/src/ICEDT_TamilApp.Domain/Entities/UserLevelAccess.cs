using System;

namespace ICEDT_TamilApp.Domain.Entities
{
    public class UserLevelAccess
    {
        public int UserId { get; set; }
        public int LevelId { get; set; }
        public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual User User { get; set; }
        public virtual Level Level { get; set; }
    }
}