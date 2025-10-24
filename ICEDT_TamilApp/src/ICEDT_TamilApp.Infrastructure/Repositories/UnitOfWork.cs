using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Interfaces;
using ICEDT_TamilApp.Infrastructure.Data;

namespace ICEDT_TamilApp.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        public IMainActivityRepository MainActivities { get; private set; }
        public ILessonRepository Lessons { get; private set; }

        public ILevelRepository Levels { get; private set; }

        public IActivityTypeRepository ActivityTypes { get; private set; }
        public IActivityRepository Activities { get; private set; }

        public IUserRepository Users { get; private set; }

        public IAuthRepository Auth { get; private set; }

        public IProgressRepository Progress { get; private set; }

        public IUserLevelAccessRepository UserLevelAccesses { get; private set; }
        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            MainActivities = new MainActivityRepository(_context);
            Levels = new LevelRepository(_context);
            Lessons = new LessonRepository(_context);
            ActivityTypes = new ActivityTypeRepository(_context);
            Activities = new ActivityRepository(_context);
            Users = new UserRepository(_context);
            Auth = new AuthRepository(_context);
            Progress = new ProgressRepository(_context);
            UserLevelAccesses = new UserLevelAccessRepository(_context);
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
