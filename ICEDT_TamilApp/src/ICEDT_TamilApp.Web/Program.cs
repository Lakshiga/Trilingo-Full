using Amazon.Runtime;
using Amazon.S3;
using ICEDT_TamilApp.Application;
using ICEDT_TamilApp.Application.Common;
using ICEDT_TamilApp.Infrastructure;
using ICEDT_TamilApp.Infrastructure.Data;
using ICEDT_TamilApp.Web.Middlewares; // Add this using statement!
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

// Give a name to your CORS policy
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// --- ADD THIS CORS CONFIGURATION ---
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: MyAllowSpecificOrigins,
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:3000", // For local React development
                    "http://localhost:4200", // For Angular admin panel
                    "https://d263kqjlbz7z70.cloudfront.net", // For your deployed staging frontend
                    "https://icedt-app--pnc2d7w6mk.expo.app", // Expo app
                    "exp://192.168.1.100:8081", // Expo development
                    "exp://localhost:8081" // Expo local development
                ) // Allowed origins
                .AllowAnyHeader()
                .AllowAnyMethod();
            // In production, you would add your deployed React app's domain here as well.
            // .WithOrigins("http://localhost:3000", "https://your-admin-app.com")
        }
    );
});

// =================================================================
// 1. Configure Services by calling Extension Methods
// =================================================================

// Add services from the Application layer
builder.Services.AddApplicationServices();

// Add services from the Infrastructure layer
builder.Services.AddInfrastructureServices(builder.Configuration);

// Add services to the container.

// This is for API Controllers
builder.Services.AddControllers();

// This is for Razor Pages
builder.Services.AddRazorPages();

// ... DI registration, DbContext, JWT Auth, etc.
// To-do

// *** NEW: Configure the Options Pattern ***
// --- JWT Configuration ---

// Configure strongly-typed settings (Options Pattern)
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));
var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>();
builder.Services.AddSingleton(jwtSettings!); // Use ! to assert it's not null, as it's required for the app to run

if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.Secret))
{
    // Fail fast on startup if the secret is missing.
    throw new InvalidOperationException("FATAL ERROR: JWT Secret is not configured in appsettings.json.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

// *** NEW: Configure AWS Settings and S3 Client for DI ***

// 1. Bind the AwsSettings class using the Options Pattern (this is still a good practice)
builder.Services.Configure<AwsSettings>(builder.Configuration.GetSection(AwsSettings.SectionName));

// 2. Conditionally configure the IAmazonS3 client
if (builder.Environment.IsDevelopment())
{
    // --- DEVELOPMENT LOGIC ---
    // In Development, we read the keys directly from appsettings.json
    // and create the client with explicit credentials.
    var awsSettings = builder.Configuration.GetSection(AwsSettings.SectionName).Get<AwsSettings>();

    if (string.IsNullOrEmpty(awsSettings?.AccessKey) || string.IsNullOrEmpty(awsSettings.SecretKey))
    {
        throw new Exception(
            "AWS AccessKey/SecretKey not configured in appsettings.Development.json"
        );
    }

    var credentials = new BasicAWSCredentials(awsSettings.AccessKey, awsSettings.SecretKey);

    builder.Services.AddSingleton<IAmazonS3>(sp =>
    {
        return new AmazonS3Client(
            credentials,
            Amazon.RegionEndpoint.GetBySystemName(awsSettings.Region)
        );
    });
}
else
{
    // --- PRODUCTION LOGIC (for EC2) ---
    // In Production/Staging, we let the SDK find the credentials automatically from the IAM Role.
    builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
    builder.Services.AddAWSService<IAmazonS3>();
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "ICEDT TamilApp API", 
        Version = "v1" 
    });

    // 1. Define the Bearer token security scheme
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token. Example: \"Bearer {token}\"",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });

    // 2. Add a global security requirement to use the Bearer scheme
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            // This is the Security Scheme object we are referencing
            new OpenApiSecurityScheme
            {
                // *** THIS IS THE FIX ***
                // We create a REFERENCE to the scheme we defined above.
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer" // The ID/Name must match the one in AddSecurityDefinition
                }
            },
            // The list of scopes (if any). For JWT, this is usually an empty list.
            new string[]{}
        }
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Staging"))
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        // This makes the swagger page available at the root URL (e.g., http://your-ip/swagger)
        // instead of the default which might be buried under a subpath.
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ICEDT TamilApp API V1");
        // To make Swagger the default page in these environments, you can do this:
        // options.RoutePrefix = string.Empty;
    });
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// =================================================================
// 3. APPLY MIGRATIONS AND SEED DYNAMIC DATA
// =================================================================
// This block will run automatically on application startup.
// This block of code is now the single source of truth for migrations and seeding.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();

        logger.LogInformation("Applying database migrations on startup...");
        // This line will apply any pending migrations to the database.
        await context.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully.");

        logger.LogInformation("Running data initializer...");
        await DbInitializer.Initialize(context);
        logger.LogInformation("Data initializer completed.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during startup database initialization.");
    }
}
// =================================================================

app.UseWrapResponseMiddleware();

app.UseHttpsRedirection();
app.UseStaticFiles(); // Serves your wwwroot folder (JS, CSS)

app.UseRouting();

// --- ADD THIS CORS MIDDLEWARE ---
// It's important to place UseCors here: after UseRouting but before UseAuthorization.
app.UseCors(MyAllowSpecificOrigins);

// Auth must come after Routing but before Authorization and Endpoints
app.UseAuthentication();
app.UseAuthorization();

// This maps your API controllers (e.g., /api/levels)
app.MapControllers();

// This maps your Razor Pages (e.g., /Admin/Levels)
app.MapRazorPages();

app.Run();
