using ICEDT_TamilApp.Application.DTOs.Shared;

namespace ICEDT_TamilApp.Application.DTOs.Response
{
    public class MultilingualMainActivityResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public MultilingualText? Title { get; set; }
        public MultilingualText? Description { get; set; }
    }
}

