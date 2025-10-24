using ICEDT_TamilApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ICEDT_TamilApp.Infrastructure.Data.Configurations
{
    public class UserCurrentProgressConfiguration : IEntityTypeConfiguration<UserCurrentProgress>
    {
        public void Configure(EntityTypeBuilder<UserCurrentProgress> builder)
        {
            // *** THIS IS THE FIX ***
            // Explicitly tell EF Core that the UserId property is the Primary Key for this table.
            builder.HasKey(ucp => ucp.UserId);

            // You can also define the one-to-one relationship here, though EF Core
            // is often smart enough to figure it out from the navigation properties.
            // Being explicit is always safer.
            builder
                .HasOne(ucp => ucp.User)
                .WithOne(u => u.UserCurrentProgress)
                .HasForeignKey<UserCurrentProgress>(ucp => ucp.UserId);

            builder
                .HasOne(ucp => ucp.CurrentLesson)
                .WithMany() // A lesson can be the current lesson for many users
                .HasForeignKey(ucp => ucp.CurrentLessonId);
        }
    }
}
