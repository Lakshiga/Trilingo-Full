export interface RootStackParamList {
  MainTabs: undefined;
  [key: string]: undefined | object;
}

export interface TabParamList {
  Home: undefined;
  Lessons: undefined;
  Activities: undefined;
  Profile: undefined;
  [key: string]: undefined | object;
}

export type LanguageCode = 'ta' | 'en' | 'si';

export interface User {
  userId: number;
  username: string;
  email: string;
  nativeLanguage?: LanguageCode;
  targetLanguage?: LanguageCode;
}

export interface Level {
  levelId: number;
  title: {
    ta: string;
    en: string;
    si: string;
  };
  description?: {
    ta: string;
    en: string;
    si: string;
  };
  learningStage: 'letters' | 'words' | 'sentences';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserProgress {
  levelId: number;
  isCompleted: boolean;
  progress: number;
  lastAccessed: Date;
}