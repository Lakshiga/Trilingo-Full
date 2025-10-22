import React, { createContext, useContext, useState } from 'react';

type Language = 'ta' | 'en' | 'si';

interface LanguageText {
  ta: string;
  en: string;
  si: string;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getText: (text: LanguageText) => string;
  getSupportedLanguages: () => Array<{ code: Language; nativeName: string; englishName: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const getText = (text: LanguageText): string => {
    return text[currentLanguage] || text.en || '';
  };

  const getSupportedLanguages = () => [
    { code: 'ta' as Language, nativeName: 'தமிழ்', englishName: 'Tamil' },
    { code: 'en' as Language, nativeName: 'English', englishName: 'English' },
    { code: 'si' as Language, nativeName: 'සිංහල', englishName: 'Sinhala' }
  ];

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    getText,
    getSupportedLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};