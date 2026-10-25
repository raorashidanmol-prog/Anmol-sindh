import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';

interface Translations {
  [key: string]: {
    sd: string;
    ur: string;
    en: string;
  };
}

export const UI_STRINGS: Translations = {
  // Brand
  siteName: {
    sd: 'انمول سنڌ',
    ur: 'انمول سندھ',
    en: 'ANMOL SINDH',
  },
  tagline: {
    sd: 'سکو، ٻڌو، ڏسو، کيڏو ۽ اڳتي وڌو',
    ur: 'سیکھیں، سنیں، دیکھیں، کھیلیں اور بڑھیں',
    en: 'Learn, Listen, Watch, Play & Grow',
  },
  subTagline: {
    sd: 'پاڪستاني پرائمري اسڪول جي شاگردن (ڪلاس 1 کان 5)، استادن ۽ والدين لاءِ سنڌ جو بهترين تعليمي پورٽل',
    ur: 'پاکستانی پرائمری سکول کے طلباء (کلاس 1 تا 5)، اساتذہ اور والدین کیلئے بہترین تعلیمی پورٹل',
    en: 'Premier educational portal for Pakistani primary students (Classes 1–5), teachers, and parents',
  },
  // Navigation
  home: {
    sd: 'مک صفحو',
    ur: 'مرکزی صفحہ',
    en: 'Home',
  },
  library: {
    sd: 'مواد لائبريري',
    ur: 'مواد لائبریری',
    en: 'Library',
  },
  poems: {
    sd: 'آڊيو نظم',
    ur: 'آڈیو نظمیں',
    en: 'Audio Poems',
  },
  stories: {
    sd: 'ڪهاڻيون',
    ur: 'کہانیاں',
    en: 'Stories',
  },
  gamesApps: {
    sd: 'رانديون ۽ ايپس',
    ur: 'کھیل اور ایپس',
    en: 'Games & Apps',
  },
  downloads: {
    sd: 'ڊائون لوڊ سينٽر',
    ur: 'ڈاؤن لوڈ سینٹر',
    en: 'Downloads',
  },
  admin: {
    sd: 'ايڊمن پينل',
    ur: 'ایڈمن پینل',
    en: 'Admin Panel',
  },
  // Search & Filter
  searchPlaceholder: {
    sd: 'سبق، نظم، ڪهاڻيون، ورڪ شيٽس ۽ ٽيسٽ ڳوليو...',
    ur: 'سبق، نظمیں، کہانیاں، ورک شیٹس اور ٹیسٹ تلاش کریں...',
    en: 'Search lessons, poems, stories, worksheets & tests...',
  },
  allClasses: {
    sd: 'سڀ ڪلاس',
    ur: 'تمام کلاسز',
    en: 'All Classes',
  },
  class1: {
    sd: 'ڪلاس 1',
    ur: 'کلاس 1',
    en: 'Class 1',
  },
  class2: {
    sd: 'ڪلاس 2',
    ur: 'کلاس 2',
    en: 'Class 2',
  },
  class3: {
    sd: 'ڪلاس 3',
    ur: 'کلاس 3',
    en: 'Class 3',
  },
  class4: {
    sd: 'ڪلاس 4',
    ur: 'کلاس 4',
    en: 'Class 4',
  },
  class5: {
    sd: 'ڪلاس 5',
    ur: 'کلاس 5',
    en: 'Class 5',
  },
  allLanguages: {
    sd: 'سڀ ٻوليون',
    ur: 'تمام زبانیں',
    en: 'All Languages',
  },
  sindhi: {
    sd: 'سنڌي',
    ur: 'سندھی',
    en: 'Sindhi',
  },
  urdu: {
    sd: 'اردو',
    ur: 'اردو',
    en: 'Urdu',
  },
  english: {
    sd: 'انگريزي',
    ur: 'انگریزی',
    en: 'English',
  },
  allCategories: {
    sd: 'سڀ ڪيٽيگريز',
    ur: 'تمام زمرہ جات',
    en: 'All Categories',
  },
  resetFilters: {
    sd: 'فلٽر ختم ڪريو',
    ur: 'فلٹر صاف کریں',
    en: 'Reset Filters',
  },
  noResults: {
    sd: 'ڪو به مواد نه مليو. مهرباني ڪري ٻيو لفظ ڳوليو يا فلٽر تبديل ڪريو.',
    ur: 'کوئی مواد نہیں ملا۔ براہ کرم مختلف الفاظ تلاش کریں یا فلٹرز تبدیل کریں۔',
    en: 'No resources found. Try modifying your search or clearing active filters.',
  },
  // Categories
  cat_audio_poems: {
    sd: 'آڊيو نظم',
    ur: 'آڈیو نظمیں',
    en: 'Audio Poems',
  },
  cat_animated_stories: {
    sd: 'اينيميٽڊ ڪهاڻيون',
    ur: 'اینیمیٹڈ کہانیاں',
    en: 'Animated Stories',
  },
  cat_educational_videos: {
    sd: 'تعليمي وڊيوز',
    ur: 'تعلیمی ویڈیوز',
    en: 'Educational Videos',
  },
  cat_lessons_explanations: {
    sd: 'سبق ۽ وضاحتون',
    ur: 'سبق اور وضاحتیں',
    en: 'Lessons & Explanations',
  },
  cat_rhymes_nursery: {
    sd: 'نرسري نغما ۽ ترانا',
    ur: 'نرسری نظمیں اور ترانے',
    en: 'Rhymes & Nursery Learning',
  },
  cat_english_vocabulary: {
    sd: 'انگريزي لغت ۽ تلفظ',
    ur: 'انگریزی الفاظ اور تلفظ',
    en: 'English Vocab & Pronunciation',
  },
  cat_sindhi_learning: {
    sd: 'سنڌي ٻولي سکيا',
    ur: 'سندھی زبان کی تعلیم',
    en: 'Sindhi Language Learning',
  },
  cat_urdu_learning: {
    sd: 'اردو ٻولي سکيا',
    ur: 'اردو زبان کی تعلیم',
    en: 'Urdu Language Learning',
  },
  cat_worksheets_pdf: {
    sd: 'ورڪ شيٽس ۽ پي ڊي ايف ڪتاب',
    ur: 'ورک شیٹس اور پی ڈی ایف کتب',
    en: 'Worksheets & PDF Books',
  },
  cat_educational_games: {
    sd: 'تعليمي رانديون',
    ur: 'تعلیمی کھیل',
    en: 'Educational Games',
  },
  cat_tests_quizzes: {
    sd: 'ٽيسٽ ۽ سوال ناما',
    ur: 'ٹیسٹ اور کوئز',
    en: 'Tests & Quizzes',
  },
  // Actions
  playNow: {
    sd: 'هاڻي ٻڌو',
    ur: 'ابھی سنیں',
    en: 'Listen Now',
  },
  watchNow: {
    sd: 'وڊيو ڏسو',
    ur: 'ویڈیو دیکھیں',
    en: 'Watch Now',
  },
  download: {
    sd: 'ڊائون لوڊ ڪريو',
    ur: 'ڈاؤن لوڈ کریں',
    en: 'Download',
  },
  viewDetails: {
    sd: 'تفصيل ڏسو',
    ur: 'تفصیل دیکھیں',
    en: 'View Details',
  },
  openApp: {
    sd: 'ايپ کوليو',
    ur: 'ایپ کھولیں',
    en: 'Open App',
  },
  playGame: {
    sd: 'راند کيڏو',
    ur: 'کھیل کھیلیں',
    en: 'Play Game',
  },
  featuredBadge: {
    sd: 'نمايان مواد',
    ur: 'نمایاں مواد',
    en: 'Featured',
  },
  views: {
    sd: 'ڏٺو ويو',
    ur: 'دیکھا گیا',
    en: 'views',
  },
  downloadsCount: {
    sd: 'ڊائون لوڊز',
    ur: 'ڈاؤن لوڈز',
    en: 'downloads',
  },
  // Footer
  aboutUs: {
    sd: 'اسان بابت',
    ur: 'ہمارے متعلق',
    en: 'About Us',
  },
  privacyPolicy: {
    sd: 'رازداري پاليسي',
    ur: 'پرائیویسی پالیسی',
    en: 'Privacy Policy',
  },
  termsOfUse: {
    sd: 'استعمال جا شرط',
    ur: 'استعمال کی شرائط',
    en: 'Terms of Use',
  },
  contactUs: {
    sd: 'رابطو ڪريو',
    ur: 'رابطہ کریں',
    en: 'Contact Us',
  },
  copyrightText: {
    sd: 'سڀ حق ۽ واسطا محفوظ آهن © انمول سنڌ پورٽل',
    ur: 'جملہ حقوق محفوظ ہیں © انمول سندھ پورٹل',
    en: 'All rights reserved © ANMOL SINDH Portal',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  dir: 'rtl' | 'ltr';
  t: (key: keyof typeof UI_STRINGS) => string;
  getText: (item: { [key: string]: any }, prefix: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('anmol_lang');
    return (saved as LanguageCode) || 'sd';
  });

  const dir = language === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    localStorage.setItem('anmol_lang', language);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const t = (key: keyof typeof UI_STRINGS): string => {
    if (!UI_STRINGS[key]) return String(key);
    return UI_STRINGS[key][language] || UI_STRINGS[key].en || '';
  };

  const getText = (item: { [key: string]: any }, prefix: string): string => {
    if (!item) return '';
    const localized = item[`${prefix}_${language}`];
    if (localized) return localized;
    return item[`${prefix}_sd`] || item[`${prefix}_ur`] || item[`${prefix}_en`] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t, getText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
