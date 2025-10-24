using ICEDT_TamilApp.Application.DTOs.Response;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICEDT_TamilApp.Application.Services.Interfaces
{
    public interface IMediaService
    {
        Task<MediaUploadResponseDto> UploadSingleFileAsync(IFormFile file, int levelId, int lessonId, string mediaType);
        Task<List<MediaUploadResponseDto>> UploadMultipleFilesAsync(List<IFormFile> files, int levelId, int lessonId, string mediaType);

        Task<List<MediaFileDto>> ListFilesAsync(int levelId, int lessonId, string mediaType);
    }
}