using System.Threading.Tasks;

namespace ICEDT_TamilApp.Domain.Interfaces
{
    public interface IUserLevelAccessRepository
    {
        /// <summary>
        /// Checks if a user already has access to a specific level.
        /// </summary>
        Task<bool> HasAccessAsync(int userId, int levelId);

        /// <summary>
        /// Creates a new record to grant a user access to a level.
        /// </summary>
        Task GrantAccessAsync(int userId, int levelId);
    }
}