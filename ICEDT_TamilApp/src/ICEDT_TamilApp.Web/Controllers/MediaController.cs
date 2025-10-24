using ICEDT_TamilApp.Application.DTOs.Request;
using ICEDT_TamilApp.Application.DTOs.Response;
using ICEDT_TamilApp.Application.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace ICEDT_TamilApp.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly IMediaService _mediaService;

        public MediaController(IMediaService mediaService)
        {
            _mediaService = mediaService;
        }

        /// <summary>
        /// Uploads a single file to a structured path in S3 based on level and lesson.
        /// </summary>
        [HttpPost("upload-single")]
        [ProducesResponseType(typeof(MediaUploadResponseDto), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UploadSingleFile([FromForm] FileUploadRequestDto request)
        {
            // The model binder will automatically populate the 'request' object.
            // The [ApiController] attribute will handle validation.

            var result = await _mediaService.UploadSingleFileAsync(request.File, request.LevelId, request.LessonId, request.MediaType);

            return Ok(result);
        }

        /// <summary>
        /// Uploads multiple files to a structured path in S3 based on level and lesson.
        /// </summary>
        [HttpPost("upload-multiple")]
        [ProducesResponseType(typeof(List<MediaUploadResponseDto>), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UploadMultipleFiles(
            [FromForm, Required] List<IFormFile> files,
            [FromForm, Required] int levelId,
            [FromForm, Required] int lessonId,
            [FromForm, Required] string mediaType)
        {
            var results = await _mediaService.UploadMultipleFilesAsync(files, levelId, lessonId, mediaType);
            return Ok(results);
        }

        // ... (existing constructor and upload endpoints)

        /// <summary>
        /// Lists all files in a specific media folder for a given lesson.
        /// </summary>
        [HttpGet("list")]
        [ProducesResponseType(typeof(List<MediaFileDto>), 200)]
        public async Task<IActionResult> ListFiles(
            [FromQuery, Required] int levelId,
            [FromQuery, Required] int lessonId,
            [FromQuery, Required] string mediaType)
        {
            var files = await _mediaService.ListFilesAsync(levelId, lessonId, mediaType);
            return Ok(files);
        }
    }
}