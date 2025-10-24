using Amazon.S3;
using Amazon.S3.Model;
using ICEDT_TamilApp.Application.Common;
using ICEDT_TamilApp.Application.Exceptions;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace ICEDT_TamilApp.Application.Services.Implementation
{
    public class S3FileUploader : IFileUploader
    {
        private readonly IAmazonS3 _s3Client;
        private readonly AwsSettings _awsSettings;

        public S3FileUploader(IAmazonS3 s3Client, IOptions<AwsSettings> awsOptions)
        {
            _s3Client = s3Client;
            _awsSettings = awsOptions.Value;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string s3Key)
        {
            if (file == null || file.Length == 0)
                throw new BadRequestException("File is empty or null.");

            try
            {
                var putRequest = new PutObjectRequest
                {
                    BucketName = _awsSettings.MediaBucketName,
                    Key = s3Key,
                    InputStream = file.OpenReadStream(),
                    ContentType = file.ContentType
                };
                await _s3Client.PutObjectAsync(putRequest);

                return $"https://{_awsSettings.MediaBucketName}.s3.{_awsSettings.Region}.amazonaws.com/{s3Key}";
            }
            catch (AmazonS3Exception ex)
            {
                throw new Exception($"Error uploading to S3: {ex.Message}", ex);
            }
        }
    }
}