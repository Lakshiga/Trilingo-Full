using ICEDT_TamilApp.Application.Services.Implementation;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace ICEDT_TamilApp.Application
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Register all your application services here
            services.AddScoped<IActivityService, ActivityService>();
            services.AddScoped<IActivityTypeService, ActivityTypeService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ILessonService, LessonService>();
            services.AddScoped<ILevelService, LevelService>();
            services.AddScoped<IProgressService, ProgressService>();
            services.AddScoped<IMediaService, MediaService>();
            services.AddScoped<IMainActivityService, MainActivityService>();
            services.AddScoped<IUserService, UserService>();

            services.AddScoped<IFileUploader, S3FileUploader>();
            // If you have AutoMapper or MediatR, you would register them here too.

            return services;
        }
    }
}
