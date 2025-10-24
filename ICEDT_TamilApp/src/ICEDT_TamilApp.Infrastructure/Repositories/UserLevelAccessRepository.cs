using ICEDT_TamilApp.Domain.Entities;
using ICEDT_TamilApp.Domain.Interfaces;
using ICEDT_TamilApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace ICEDT_TamilApp.Infrastructure.Repositories
{
    public class UserLevelAccessRepository : IUserLevelAccessRepository
    {
        private readonly ApplicationDbContext _context;

        public UserLevelAccessRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasAccessAsync(int userId, int levelId)
        {
            // AnyAsync is a very efficient way to check for the existence of a record.
            return await _context.UserLevelAccesses
                .AnyAsync(ula => ula.UserId == userId && ula.LevelId == levelId);
        }

        public async Task GrantAccessAsync(int userId, int levelId)
        {
            var newAccess = new UserLevelAccess
            {
                UserId = userId,
                LevelId = levelId
                // UnlockedAt is set by default in the entity
            };

            await _context.UserLevelAccesses.AddAsync(newAccess);
            // The UnitOfWork's CompleteAsync() will handle saving this change.
        }
    }
}