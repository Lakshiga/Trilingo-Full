using System.Reflection;
using ICEDT_TamilApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ICEDT_TamilApp.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Level> Levels { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityType> ActivityTypes { get; set; }
        public DbSet<MainActivity> MainActivities { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<UserCurrentProgress> UserCurrentProgress { get; set; }
        public DbSet<UserProgress> UserProgresses { get; set; }

        public DbSet<UserLevelAccess> UserLevelAccesses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // This one line automatically finds all your IEntityTypeConfiguration classes
            // from the same assembly (Infrastructure project) and applies them.
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // That's it! This method is now clean and will never need to be changed
            // when you add a new entity. You just add a new configuration file.
        }
    }
}
