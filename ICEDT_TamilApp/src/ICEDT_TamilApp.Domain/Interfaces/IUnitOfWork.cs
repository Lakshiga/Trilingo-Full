using System.Threading.Tasks;

namespace ICEDT_TamilApp.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IMainActivityRepository MainActivities { get; }
        ILevelRepository Levels { get; }
        ILessonRepository Lessons { get; }

        IActivityTypeRepository ActivityTypes { get; }
        IActivityRepository Activities { get; }

        IUserRepository Users { get; }

        IAuthRepository Auth { get; }

        IProgressRepository Progress { get; }

        IUserLevelAccessRepository UserLevelAccesses { get; }

        // Add other repositories here as you create them
        // IActivityTypeRepository ActivityTypes { get; }
        Task<int> CompleteAsync();
    }
}
