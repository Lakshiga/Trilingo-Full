using ICEDT_TamilApp.Application.Exceptions;
using ICEDT_TamilApp.Application.Services.Interfaces;
using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;

namespace ICEDT_TamilApp.Application.Services.Implementation
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _unitOfWork.Users.GetAllAsync();
            return users.Select(MapToUserDto).ToList();
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                throw new NotFoundException($"{nameof(User)}, {id} not found.");
            return MapToUserDto(user);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserRequestDto dto)
        {
            if (await _unitOfWork.Auth.UserExistsAsync(dto.Username, dto.Email))
                throw new ConflictException("Username or Email already exists.");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                NativeLanguage = dto.NativeLanguage ?? "en", // Default to English
                TargetLanguage = dto.TargetLanguage ?? "ta", // Default to Tamil
                Role = dto.Role,
                CreatedAt = DateTime.UtcNow,
            };
            await _unitOfWork.Users.CreateAsync(user);
            await _unitOfWork.CompleteAsync();
            return MapToUserDto(user);
        }

        public async Task<UserDto> UpdateUserAsync(int id, UpdateUserRequestDto dto)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                throw new NotFoundException($"{nameof(User) }, {id} not found.");

            user.Username = dto.Username;
            user.Email = dto.Email;
            user.Role = dto.Role;

            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.CompleteAsync();
            return MapToUserDto(user);
        }

        public async Task DeleteUserAsync(int id)
        {
            await _unitOfWork.Users.DeleteAsync(id);
            await _unitOfWork.CompleteAsync();
        }

        private UserDto MapToUserDto(User user) =>
            new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
            };
    }
}
