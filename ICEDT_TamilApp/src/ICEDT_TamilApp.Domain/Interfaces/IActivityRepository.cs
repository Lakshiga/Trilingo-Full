using ICEDT_TamilApp.Domain.Entities;

namespace ICEDT_TamilApp.Domain.Interfaces
{
    public interface IActivityRepository
    {
        Task<Activity?> GetByIdAsync(int activityId);
        Task<List<Activity>> GetAllAsync();
        Task<List<Activity>> GetByLessonIdAsync(int lessonId);
        Task CreateAsync(Activity activity);
        Task UpdateAsync(Activity activity);
        Task DeleteAsync(int id);
        Task<bool> SequenceOrderExistsAsync(int sequenceOrder);
        Task<bool> LessonExistsAsync(int lessonId);

        Task<bool> HasActivitiesOfTypeAsync(int activityTypeId);
        Task<bool> SequenceOrderExistsAsync(int lessonId, int sequenceOrder);
    }
}
