using ICEDT_TamilApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ICEDT_TamilApp.Infrastructure.Data.EntityConfigurations
{
    public class UserLevelAccessConfiguration : IEntityTypeConfiguration<UserLevelAccess>
    {
        public void Configure(EntityTypeBuilder<UserLevelAccess> builder)
        {
            // Define the composite primary key (UserId, LevelId)
            builder.HasKey(ula => new { ula.UserId, ula.LevelId });

            // Configure the relationship to User
            builder.HasOne(ula => ula.User)
                   .WithMany(u => u.LevelAccesses)
                   .HasForeignKey(ula => ula.UserId);

            // Configure the relationship to Level
            builder.HasOne(ula => ula.Level)
                   .WithMany(l => l.UserAccesses)
                   .HasForeignKey(ula => ula.LevelId);
        }
    }
}