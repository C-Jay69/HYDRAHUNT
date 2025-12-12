
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es';

type Translations = {
  [key: string]: string;
};

const translations: Record<Language, Translations> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.templates': 'Templates',
    'nav.pro': 'Pro',
    'nav.login': 'ACCESS SYSTEM',
    'nav.logout': 'Logout',
    'nav.operator': 'OPERATOR',
    
    'hero.title1': 'JOB HUNTING IS DEAD.',
    'hero.title2': 'WE KILLED IT.',
    'hero.desc': 'Your multi-headed AI hunts jobs, builds your resume, optimizes your profile, and strikes targets while you get on with your life. Just pure, automated career warfare.',
    'hero.cta_main': 'UNLEASH HUNT MODE',
    'hero.cta_sec': 'WATCH HYDRA HUNT',

    'editor.upload': 'UPLOAD RESUME',
    'editor.importing': 'IMPORTING...',
    'editor.career_path': 'CAREER PATH',
    'editor.ai_coach': 'AI COACH',
    'editor.new_resume': 'NEW RESUME',
  },
  es: {
    'nav.dashboard': 'Panel',
    'nav.templates': 'Plantillas',
    'nav.pro': 'Pro',
    'nav.login': 'ACCESO',
    'nav.logout': 'Salir',
    'nav.operator': 'OPERADOR',

    'hero.title1': 'LA BÚSQUEDA DE EMPLEO HA MUERTO.',
    'hero.title2': 'NOSOTROS LA MATAMOS.',
    'hero.desc': 'Tu IA de múltiples cabezas busca trabajos, crea tu currículum, optimiza tu perfil y golpea objetivos mientras tú sigues con tu vida. Pura guerra profesional automatizada.',
    'hero.cta_main': 'ACTIVAR MODO CAZA',
    'hero.cta_sec': 'VER HYDRA HUNT',

    'editor.upload': 'SUBIR CURRÍCULUM',
    'editor.importing': 'IMPORTANDO...',
    'editor.career_path': 'TRAYECTORIA',
    'editor.ai_coach': 'ENTRENADOR IA',
    'editor.new_resume': 'NUEVO CV',
  }
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
