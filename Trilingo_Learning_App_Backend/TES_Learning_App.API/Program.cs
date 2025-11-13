using Microsoft.EntityFrameworkCore;
using TES_Learning_App.API.Extensions;
using TES_Learning_App.Application_Layer;
using TES_Learning_App.Infrastructure;
using TES_Learning_App.Infrastructure.Data;
using TES_Learning_App.Infrastructure.Data.DbIntializers_Seeds;
using Microsoft.Extensions.FileProviders;
using System.IO;


namespace TES_Learning_App.API

{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddInfrastructureServices(builder.Configuration);

            builder.Services.AddApplicationServices();


            // NEW DATABASE WIRING CODE
            // Support for both local development and AWS deployment
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            
            // Allow overriding connection string via environment variable for AWS deployment
            var envConnectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");
            if (!string.IsNullOrEmpty(envConnectionString))
            {
                connectionString = envConnectionString;
            }
            
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Add services to the container.
            builder.Services.AddControllers();

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddEndpointsApiExplorer();

            // Add CORS services
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            // Add your custom Authentication Extension for JWT
            builder.Services.AddApiAuthentication(builder.Configuration);

            // 2. Build the application.
            var app = builder.Build();

            // --- DATABASE SEEDING ---
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<ApplicationDbContext>();
                    // This gets our DbContext and calls our Initializer method.
                    DbInitializer.Initialize(context);
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding the database.");
                }
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                // Do not force HTTPS in Development. Emulators/physical devices often fail on self-signed certs.
            }
            else
            {
                app.UseHttpsRedirection();
            }

            // Enable CORS
            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();

            // Enable static file serving for profile images
            app.UseStaticFiles();

            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "uploads");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            // Custom static files for uploads
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(uploadsPath),
                RequestPath = "/uploads"
            });

            app.MapControllers();

            app.Run();
        }
    }
}
