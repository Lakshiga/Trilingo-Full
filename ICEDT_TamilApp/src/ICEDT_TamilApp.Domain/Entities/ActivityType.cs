using System.ComponentModel.DataAnnotations;

namespace ICEDT_TamilApp.Domain.Entities
{
    public class ActivityType
    {
        [Key]
        public int ActivityTypeId { get; set; }

        [Required]
        public string? Name { get; set; }

        public ICollection<Activity>? Activities { get; set; }
    }
}
