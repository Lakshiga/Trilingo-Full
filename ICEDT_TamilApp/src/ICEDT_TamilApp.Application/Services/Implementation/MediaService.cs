using Amazon.S3;
using Amazon.S3.Model;
using ICEDT_TamilApp.Application.Common;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.Exceptions;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ICEDT_TamilApp.Application.Services.Implementation
{
    public class MediaService : IMediaService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly AwsSettings _awsSettings;

        public MediaService(IAmazonS3 s3Client, IOptions<AwsSettings> awsOptions)
        {
            _s3Client = s3Client;
            _awsSettings = awsOptions.Value;
        }

        public async Task<MediaUploadResponseDto> UploadSingleFileAsync(IFormFile file, int levelId, int lessonId, string mediaType)
        {
            if (file == null || file.Length == 0)
                throw new BadRequestException("File is empty or null.");

            // Construct the hierarchical S3 key
            var key = GenerateS3Key(levelId, lessonId, mediaType, file.FileName);

            // Use a shared private method to perform the actual upload
            var url = await UploadToS3Async(file, key);

            return new MediaUploadResponseDto
            {
                Url = url,
                Key = key,
                FileName = file.FileName
            };
        }

        public async Task<List<MediaUploadResponseDto>> UploadMultipleFilesAsync(List<IFormFile> files, int levelId, int lessonId, string mediaType)
        {
            if (files == null || !files.Any())
                throw new BadRequestException("No files provided for upload.");

            var uploadTasks = files.Select(async file =>
            {
                var key = GenerateS3Key(levelId, lessonId, mediaType, file.FileName);
                var url = await UploadToS3Async(file, key);
                return new MediaUploadResponseDto
                {
                    Url = url,
                    Key = key,
                    FileName = file.FileName
                };
            });

            var results = await Task.WhenAll(uploadTasks);
            return results.ToList();
        }

        // --- Private Helper Methods ---

        private string GenerateS3Key(int levelId, int lessonId, string mediaType, string fileName)
        {
            // Sanitize mediaType to prevent path traversal issues (e.g., "images", "audio")
            var sanitizedMediaType = mediaType.ToLowerInvariant();
            if (sanitizedMediaType != "images" && sanitizedMediaType != "audio" && sanitizedMediaType != "videos")
            {
                throw new BadRequestException("Invalid media type. Must be 'images', 'audio', or 'videos'.");
            }

            // Generate a unique file name to avoid overwrites
            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(fileName)}";

            return $"levels/{levelId}/lessons/{lessonId}/{sanitizedMediaType}/{uniqueFileName}";
        }

        private async Task<string> UploadToS3Async(IFormFile file, string key)
        {
            try
            {
                var putRequest = new PutObjectRequest
                {
                    BucketName = _awsSettings.MediaBucketName,
                    Key = key,
                    InputStream = file.OpenReadStream(),
                    ContentType = file.ContentType
                };

                await _s3Client.PutObjectAsync(putRequest);

                return $"https://{_awsSettings.MediaBucketName}.s3.{_awsSettings.Region}.amazonaws.com/{key}";
            }
            catch (AmazonS3Exception ex)
            {
                // In a real app, log this exception
                throw new Exception($"Error uploading file '{file.FileName}' to S3: {ex.Message}", ex);
            }
        }

        // ... (existing constructor and upload methods)

        public async Task<List<MediaFileDto>> ListFilesAsync(int levelId, int lessonId, string mediaType)
        {
            // Define the folder prefix to search for in S3
            var prefix = $"levels/{levelId}/lessons/{lessonId}/{mediaType.ToLowerInvariant()}/";

            try
            {
                var request = new ListObjectsV2Request
                {
                    BucketName = _awsSettings.MediaBucketName,
                    Prefix = prefix
                };

                var response = await _s3Client.ListObjectsV2Async(request);

                // Map the S3 objects to our DTO
                var mediaFiles = response.S3Objects.Select(s3Obj => new MediaFileDto
                {
                    Key = s3Obj.Key,
                    Url = $"https://{_awsSettings.MediaBucketName}.s3.{_awsSettings.Region}.amazonaws.com/{s3Obj.Key}",
                    // Extract the original file name, removing the GUID prefix
                    FileName = Path.GetFileName(s3Obj.Key).Substring(37), // 36 chars for GUID + 1 for '_'
                    Size = s3Obj.Size,
                     LastModified = s3Obj.LastModified?.ToUniversalTime() ?? DateTime.MinValue,
                }).ToList();

                return mediaFiles;
            }
            catch (AmazonS3Exception ex)
            {
                // Log the exception
                throw new Exception($"Error listing files from S3: {ex.Message}", ex);
            }
        }

    }
}