using ICEDT_TamilApp.Domain.Interfaces;
using ICEDT_TamilApp.Infrastructure.Data;
using ICEDT_TamilApp.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ICEDT_TamilApp.Infrastructure
{
    public static class InfrastructureServiceExtensions
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            // Configure the DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(configuration.GetConnectionString("DefaultConnection"))
            ); // Or UseSqlServer, etc.

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Register all your repositories here
            services.AddScoped<IActivityRepository, ActivityRepository>();
            services.AddScoped<IActivityTypeRepository, ActivityTypeRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<ILessonRepository, LessonRepository>();
            services.AddScoped<ILevelRepository, LevelRepository>();
            services.AddScoped<IMainActivityRepository, MainActivityRepository>();
            services.AddScoped<IProgressRepository, ProgressRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            return services;
        }
    }
}
