namespace ICEDT_TamilApp.Application.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task<UserDto> GetUserByIdAsync(int id);

        Task<UserDto> CreateUserAsync(CreateUserRequestDto dto);
        Task<UserDto> UpdateUserAsync(int id, UpdateUserRequestDto dto);
        Task DeleteUserAsync(int id);
    }
}
