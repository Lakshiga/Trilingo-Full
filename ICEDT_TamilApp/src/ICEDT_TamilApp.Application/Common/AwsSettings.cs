namespace ICEDT_TamilApp.Application.Common
{
    public class AwsSettings
    {
        public const string SectionName = "AWS";
        
        // This is needed for constructing the public URL
        public string Region { get; set; } = string.Empty;

        // This is the bucket where media files will be stored
        public string MediaBucketName { get; set; } = string.Empty;

        // --- For Local Development ONLY ---
        // In production, these should be null/empty, and the IAM Role will be used.
        public string? AccessKey { get; set; }
        public string? SecretKey { get; set; }
    }
}