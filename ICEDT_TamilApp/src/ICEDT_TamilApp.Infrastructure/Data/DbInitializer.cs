using ICEDT_TamilApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace ICEDT_TamilApp.Infrastructure.Data
{
    public static class DbInitializer
    {
        /// <summary>
        /// Initializes the database with essential, non-migration data.
        /// This method is idempotent and safe to run on every application startup.
        /// It's primarily used for creating default users or other dynamic data
        /// that shouldn't be part of a migration's static seed data.
        /// </summary>
        /// <param name="context">The database context.</param>
        public static async Task Initialize(ApplicationDbContext context)
        {
            // The call to context.Database.MigrateAsync() in Program.cs handles all
            // schema creation and the static data seeding (Levels, Lessons, etc.)
            // that is defined in the IEntityTypeConfiguration classes.

            // This initializer's job is now focused on dynamic or environment-specific data.

            await SeedDefaultAdminUser(context);

            // You could add other idempotent seeding logic here in the future if needed.
        }

        /// <summary>
        /// Creates a default administrator user if no users exist in the database.
        /// </summary>
        private static async Task SeedDefaultAdminUser(ApplicationDbContext context)
        {
            // Check if any user already exists. If so, do nothing.
            if (await context.Users.AnyAsync())
            {
                return; 
            }

            // If no users exist, create a default admin user.
            var adminUser = new User
            {
                Username = "admin",
                Email = "admin@tamilapp.com",
                // IMPORTANT: You should store a securely hashed password.
                // Never store plain-text passwords.
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                NativeLanguage = "en",
                TargetLanguage = "ta",
                Role = "Admin",
                CreatedAt = System.DateTime.UtcNow
            };

            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }
    }
}