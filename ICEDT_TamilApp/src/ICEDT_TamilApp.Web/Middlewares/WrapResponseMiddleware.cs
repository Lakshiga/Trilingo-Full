using System;
using System.IO;
using System.Net;
using System.Security.Authentication;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.S3;
using ICEDT_TamilApp.Application.Exceptions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace ICEDT_TamilApp.Web.Middlewares
{
    public class WrapResponseMiddleware
    {
        private readonly RequestDelegate _next;

        public WrapResponseMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // --- FIX 1: Ignore Swagger Requests ---
            // If the request is for Swagger, don't wrap the response.
            // This prevents the middleware from interfering with the Swagger UI.
            if (context.Request.Path.StartsWithSegments("/swagger"))
            {
                await _next(context);
                return;
            }

            var originalBodyStream = context.Response.Body;
            using var newBodyStream = new MemoryStream();
            context.Response.Body = newBodyStream;

            try
            {
                await _next(context);

                // Check for 404 Not Found from the pipeline and convert it to our custom exception
                if (context.Response.StatusCode == 404 && !context.Response.HasStarted)
                {
                    throw new NotFoundException("The requested endpoint was not found.");
                }

                // Restore the original body stream
                context.Response.Body = originalBodyStream;

                // Rewind the memory stream to the beginning to read its content
                newBodyStream.Seek(0, SeekOrigin.Begin);

                // --- FIX 2: Gracefully handle file types and empty successful responses ---
                // If the response is a file or a successful but empty response (like 204 No Content),
                // just copy the (empty) stream back and finish. Don't wrap it.
                if (IsFileType(context.Response.ContentType) || newBodyStream.Length == 0)
                {
                    newBodyStream.Seek(0, SeekOrigin.Begin);
                    await newBodyStream.CopyToAsync(originalBodyStream);
                    return;
                }

                var responseBody = await new StreamReader(newBodyStream).ReadToEndAsync();
                
                // Deserialize and then wrap the result
                var responseResult = JsonSerializer.Deserialize<object>(responseBody);
                var wrappedResponse = new Response(responseResult, false, null);
                var wrappedResponseBody = JsonSerializer.Serialize(wrappedResponse);
                
                // --- FIX 3: Clear the old Content-Length header ---
                // The new wrapped response has a different length than the original.
                // Clearing it allows the server to recalculate it or use chunked encoding.
                context.Response.ContentLength = null;
                context.Response.ContentType = "application/json";

                await context.Response.WriteAsync(wrappedResponseBody);
            }
            catch (Exception ex)
            {
                // If an exception occurs, reset the body and let the handler take over.
                context.Response.Body = originalBodyStream;
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            (string Detail, string Title, int StatusCode) details = exception switch
            {
                BadRequestException ex => (ex.Message, "BadRequest", StatusCodes.Status400BadRequest),
                NotFoundException ex => (ex.Message, "NotFound", StatusCodes.Status404NotFound),
                ValidationException ex => (ex.Message, "ValidationError", StatusCodes.Status400BadRequest),
                ConflictException ex => (ex.Message, "Conflict", StatusCodes.Status409Conflict), // 409 is better for conflicts
                AuthenticationException ex => (ex.Message, "AuthenticationError", StatusCodes.Status401Unauthorized),
                UnauthorizedAccessException ex => (ex.Message, "AuthorizationError", StatusCodes.Status403Forbidden),
                // Add more specific exceptions here...
                _ => (exception.Message, "InternalServerError", StatusCodes.Status500InternalServerError),
            };

            var extensions = new Dictionary<string, object?>
            {
                { "traceId", context.TraceIdentifier },
            };

            if (exception is ValidationException validationException)
            {
                extensions.Add("ValidationErrors", validationException.Errors);
            }

            var error = new Error(details.Title, details.Detail, details.StatusCode)
            {
                Extensions = extensions,
            };
            
            var errorResponse = new Response(null, true, error);
            var wrappedResponseBody = JsonSerializer.Serialize(errorResponse);
            
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = details.StatusCode;
            await context.Response.WriteAsync(wrappedResponseBody);
        }

        private static bool IsFileType(string? contentType)
        {
            if (string.IsNullOrEmpty(contentType))
                return false;

            // Check for common file content types. This list can be expanded.
            var fileTypes = new List<string>
            {
                "application/pdf",
                "image/jpeg",
                "image/png",
                "image/gif",
                "application/octet-stream"
            };

            return fileTypes.Any(t => contentType.StartsWith(t, StringComparison.OrdinalIgnoreCase));
        }
    }

    public static class WrapResponseMiddlewareExtensions
    {
        public static IApplicationBuilder UseWrapResponseMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<WrapResponseMiddleware>();
        }
    }
}