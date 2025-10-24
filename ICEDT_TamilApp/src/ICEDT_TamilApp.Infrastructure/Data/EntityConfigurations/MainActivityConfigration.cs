using ICEDT_TamilApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ICEDT_TamilApp.Infrastructure.Data.EntityConfigurations
{
    public class MainActivityConfiguration : IEntityTypeConfiguration<MainActivity>
    {
        public void Configure(EntityTypeBuilder<MainActivity> builder)
        {
            builder.HasKey(m => m.Id);
            builder.Property(m => m.Name).IsRequired().HasMaxLength(50);

            builder
                .HasMany(m => m.Activities)
                .WithOne(a => a.MainActivity)
                .HasForeignKey(a => a.MainActivityId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasData(
                 new MainActivity {Id=1, Name = "Video" },
                    new MainActivity {Id=2, Name = "Sounds" },
                    new MainActivity {Id=3, Name = "Learning" },
                    new MainActivity {Id=4, Name = "Exercises" }
            );
        }
    }
}
