using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace ICEDT_TamilApp.Application.Services.Interfaces
{
    public interface IFileUploader
    {
        /// <summary>
        /// Uploads a file to a specified path in S3.
        /// </summary>
        /// <param name="file">The file to upload.</param>
        /// <param name="s3Key">The full path and filename for the object in S3.</param>
        /// <returns>The public URL of the uploaded file.</returns>
        Task<string> UploadFileAsync(IFormFile file, string s3Key);
    }
}