import { Level, UserProgress } from '../types/navigation';

export class ActivityService {
  static async getLevels(): Promise<Level[]> {
    // Simulate API call
    return [
      {
        levelId: 1,
        title: { ta: 'அகரம் கற்றல்', en: 'Learning Letter A', si: 'අ අකුර ඉගෙනීම' },
        description: { ta: 'தமிழ் அகரம் கற்றல்', en: 'Learn Tamil letter A', si: 'දමිළ අ අකුර ඉගෙනීම' },
        learningStage: 'letters',
        difficulty: 'beginner'
      },
      {
        levelId: 2,
        title: { ta: 'ஆகரம் கற்றல்', en: 'Learning Letter AA', si: 'ආ අකුර ඉගෙනීම' },
        description: { ta: 'தமிழ் ஆகரம் கற்றல்', en: 'Learn Tamil letter AA', si: 'දමිළ ආ අකුර ඉගෙනීම' },
        learningStage: 'letters',
        difficulty: 'beginner'
      },
      {
        levelId: 3,
        title: { ta: 'இகரம் கற்றல்', en: 'Learning Letter I', si: 'ඉ අකුර ඉගෙනීම' },
        description: { ta: 'தமிழ் இகரம் கற்றல்', en: 'Learn Tamil letter I', si: 'දමිළ ඉ අකුර ඉගෙනීම' },
        learningStage: 'letters',
        difficulty: 'beginner'
      }
    ];
  }

  static async getUserProgress(userId: number): Promise<UserProgress[]> {
    // Simulate API call
    return [
      {
        levelId: 1,
        isCompleted: true,
        progress: 100,
        lastAccessed: new Date()
      },
      {
        levelId: 2,
        isCompleted: false,
        progress: 60,
        lastAccessed: new Date()
      },
      {
        levelId: 3,
        isCompleted: false,
        progress: 30,
        lastAccessed: new Date()
      }
    ];
  }
}