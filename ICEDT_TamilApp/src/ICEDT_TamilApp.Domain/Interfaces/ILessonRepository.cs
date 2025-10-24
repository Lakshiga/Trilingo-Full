using System.Collections.Generic;
using System.Threading.Tasks;
using ICEDT_TamilApp.Domain.Entities;

namespace ICEDT_TamilApp.Domain.Interfaces
{
    public interface ILessonRepository
    {
        Task<Lesson?> GetByIdAsync(int lessonId);
        Task<List<Lesson>> GetAllAsync();
        Task<Lesson> CreateAsync(Lesson lesson);
        Task<bool> UpdateAsync(Lesson lesson);
        Task<bool> DeleteAsync(int lessonId);
        Task<List<Lesson>> GetAllLessonsByLevelIdAsync(int levelId);
        Task<bool> ExistsAsync(int lessonId);
        Task<List<MainActivity>> GetMainActivitySummaryAsync(int lessonId);

        Task<int> GetLessonCountByLevelIdAsync(int levelId);

        Task<Lesson?> GetByIdWithActivitiesAsync(int lessonId);
    }
}
