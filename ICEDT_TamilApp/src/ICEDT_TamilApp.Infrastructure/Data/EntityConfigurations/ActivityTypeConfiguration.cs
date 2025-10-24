using ICEDT_TamilApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ICEDT_TamilApp.Infrastructure.Data.EntityConfigurations
{
    public class ActivityTypeConfiguration : IEntityTypeConfiguration<ActivityType>
    {
        public void Configure(EntityTypeBuilder<ActivityType> builder)
        {
            builder.HasKey(t => t.ActivityTypeId);
            builder.Property(t => t.Name).IsRequired().HasMaxLength(50);

            builder
                .HasMany(t => t.Activities)
                .WithOne(a => a.ActivityType)
                .HasForeignKey(a => a.ActivityTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasData(
                    new ActivityType { ActivityTypeId = 1, Name = "FlashCards" },
                    new ActivityType { ActivityTypeId = 2, Name = "VocabularySpotlight" },
                    new ActivityType { ActivityTypeId = 3, Name = "MediaSpotLight" },
                    new ActivityType { ActivityTypeId = 4, Name = "Equations" }
            );
        }
    }
}
