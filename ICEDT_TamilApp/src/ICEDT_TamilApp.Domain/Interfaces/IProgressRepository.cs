using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Entities;

public interface IProgressRepository
{
    Task CreateInitialProgressAsync(int userId, int firstLessonId);
    Task<UserCurrentProgress?> GetCurrentProgressAsync(int userId);
    Task<int> GetTotalActivitiesForLessonAsync(int lessonId);
    Task<int> GetCompletedActivitiesCountAsync(int userId, int lessonId); // Renamed for clarity
    Task MarkActivityAsCompleteAsync(int userId, int activityId, int? score);
    Task UpdateCurrentLessonAsync(int userId, int newLessonId);
    Task<Lesson?> GetNextLessonAsync(int currentLessonId);
    Task<Lesson?> GetFirstLessonAsync();
    Task<Activity?> GetActivityByIdAsync(int activityId);

    Task<List<UserProgress>> GetDetailedProgressForUserAsync(int userId);
    Task<int> GetTotalLessonCountAsync();
    Task<int> GetCompletedLessonCountForUserAsync(int userId);

    Task<int> GetCompletedLessonCountForUserAsync(int userId, int levelId);
}
