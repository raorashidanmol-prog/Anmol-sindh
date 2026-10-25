import { EducationalFolder, EducationalResource, AppLink } from '../../types';

export const FOLDERS_CONFIG: EducationalFolder[] = [
  {
    id: 'sindhi_audio',
    title_sd: 'سنڌي نظمون ۽ راڳ (Sindhi Audio)',
    title_ur: 'سندھی نظمیں اور کلام',
    title_en: 'Sindhi Poems & Audio',
    description_sd: 'سنڌي ٻوليءَ جون خوبصورت آڊيو نظمون، شاهه لطيف جي وائي ۽ ٻالڪ راڳ',
    description_ur: 'سندھی زبان کی خوبصورت آڈیو نظمیں، شاہ لطیف کی وائی اور بچوں کے ترانے',
    description_en: 'Traditional Sindhi audio poems, Sur Kalyan, and musical nursery tracks.',
    icon: 'Music',
    badge: 'Audio Box',
    gradient: 'from-[#00b875] via-[#00e599] to-teal-400',
  },
  {
    id: 'urdu_audio',
    title_sd: 'اردو نظمون ۽ ترانا (Urdu Audio)',
    title_ur: 'اردو نظمیں اور ترانے',
    title_en: 'Urdu Poems & Audio',
    description_sd: 'اردو زبان ۾ تعليمي نظمون، مٺا نغما ۽ اخلاقي ٻالڪ ترانا',
    description_ur: 'اردو زبان میں تعلیمی نظمیں، میٹھے نغمے اور اخلاقی بچوں کے ترانے',
    description_en: 'Inspirational Urdu poems, moral rhymes, and school learning anthems.',
    icon: 'BookOpen',
    badge: 'Audio Box',
    gradient: 'from-teal-500 via-[#00e599] to-emerald-400',
  },
  {
    id: 'english_audio',
    title_sd: 'انگريزي نظمون ۽ آواز (English Audio)',
    title_ur: 'انگریزی نظمیں اور فونیٹکس',
    title_en: 'English Poems & Audio',
    description_sd: 'پرائمري شاگردن لاءِ بنيادي انگريزي رائيمز، صوتيات (Phonics) ۽ لفظ',
    description_ur: 'پرائمری طلباء کیلئے بنیادی انگریزی نظمیں، صوتیات اور تلفظ',
    description_en: 'English nursery rhymes, foundational phonics, and sight-word audio recordings.',
    icon: 'Sparkles',
    badge: 'Language',
    gradient: 'from-blue-500 via-[#00e599] to-cyan-400',
  },
  {
    id: 'videos_stories',
    title_sd: 'اينيميٽڊ ڪهاڻيون ۽ وڊيوز (Videos & Stories)',
    title_ur: 'اینیمیٹڈ کہانیاں اور تعلیمی ویڈیوز',
    title_en: 'Animated Stories & Videos',
    description_sd: 'سنڌي ثقافت، درسي سبق ۽ دلچسپ ڪهاڻين جون رنگين اينيميٽڊ وڊيوز',
    description_ur: 'سندھ کی لوک کہانیاں، درسی اسباق اور خوبصورت اینیمیٹڈ ویڈیوز',
    description_en: 'Animated folk tales, moral lessons, and rich curriculum video explanations.',
    icon: 'Film',
    badge: 'Video Gallery',
    gradient: 'from-emerald-500 via-[#00e599] to-amber-400',
  },
  {
    id: 'math_games',
    title_sd: 'فن ود ميٿ (Fun with Math Games)',
    title_ur: 'فن ود میتھ کھیلیں',
    title_en: 'Fun with Math Games',
    description_sd: 'رياضي جا تفريحي قاعدا، ڳڻپ، ابنيمڪس، جوڙ، ڪٽ ۽ ٽيبل رانديون',
    description_ur: 'ریاضی کے کھیل، گنتی، ایباکس، جمع، تفریق اور پہاڑوں کی تفریح',
    description_en: 'Interactive arithmetic puzzles, multiplication tables, and math mini-games.',
    icon: 'Calculator',
    badge: 'Interactive',
    gradient: 'from-amber-400 via-[#00e599] to-emerald-500',
  },
  {
    id: 'test_maker',
    title_sd: 'آر اي ٽيسٽ ميڪر (RA Test Maker)',
    title_ur: 'آر اے ٹیسٹ میکر امتحانات',
    title_en: 'RA Test Maker Tools',
    description_sd: 'استادن ۽ شاگردن لاءِ امتحاني پيپر ٺاهڻ جا اوزار ۽ حل ٿيل ماڊل پيپرز',
    description_ur: 'اساتذہ اور طلباء کیلئے امتحانی پیپرز جنریٹر اور حل شدہ ماڈل پیپرز',
    description_en: 'Automated test generation tools, assessment quizzes, and solved papers.',
    icon: 'FileCheck',
    badge: 'Teacher Tool',
    gradient: 'from-cyan-400 via-[#00e599] to-teal-500',
  },
  {
    id: 'educational_games',
    title_sd: 'تعليمي رانديون ۽ ذهانت (Educational Games)',
    title_ur: 'تعلیمی کھیل اور ذہانت',
    title_en: 'Educational Games & Quizzes',
    description_sd: 'سنڌي الف ب، پرائمري سائنس کوئز ۽ ذهني آزمائش جون رانديون',
    description_ur: 'سندھی حروف تہجی، پرائمری سائنس کوئز اور ذہنی صلاحیت کے کھیل',
    description_en: 'Sindhi alphabet explorer, primary science quizzes, and memory games.',
    icon: 'Gamepad2',
    badge: 'Play & Learn',
    gradient: 'from-purple-500 via-[#00e599] to-emerald-400',
  },
  {
    id: 'apps_links',
    title_sd: 'تعليمي ايپس ۽ لنڪس (Educational Apps)',
    title_ur: 'تعلیمی ایپس اور روابط',
    title_en: 'Educational Apps & Useful Links',
    description_sd: 'پرائمري تعليم لاءِ مفيد انٽرايڪٽو ويب ايپس ۽ سڌا لنڪس',
    description_ur: 'پرائمری تعلیم کیلئے مفید ویب ایپس اور براہ راست روابط',
    description_en: 'Dedicated educational applications, direct launch apps, and learning resources.',
    icon: 'Smartphone',
    badge: 'Apps Box',
    gradient: 'from-[#00e599] via-teal-400 to-emerald-600',
  },
  {
    id: 'worksheets_books',
    title_sd: 'ورڪ شيٽس ۽ درسي ڪتاب (Worksheets & PDF)',
    title_ur: 'ورک شیٹس اور پی ڈی ایف کتب',
    title_en: 'Worksheets & Learning Resources',
    description_sd: 'پرنٽ لائق ورڪ شيٽس، درسي نوٽس، رنگين نقشا ۽ پي ڊي ايف دستاويز',
    description_ur: 'پرنٹ شدہ درسی ورک شیٹس، نوٹس، اور پی ڈی ایف کتابیں',
    description_en: 'Printable activity worksheets, syllabus notes, and PDF curriculum guides.',
    icon: 'Folder',
    badge: 'Downloads',
    gradient: 'from-rose-400 via-[#00e599] to-teal-400',
  },
];

export interface FolderFilterResult {
  resources: EducationalResource[];
  apps: AppLink[];
}

/**
 * Filters the website items so that when a folder is opened,
 * ONLY items belonging to that specific folder are returned.
 */
export function getItemsForFolder(
  folderId: string,
  allResources: EducationalResource[],
  allApps: AppLink[]
): FolderFilterResult {
  const publishedRes = allResources.filter((r) => r.published);

  switch (folderId) {
    case 'sindhi_audio':
      return {
        resources: publishedRes.filter(
          (r) => r.language === 'sd' && (r.content_type === 'audio' || r.category === 'audio_poems' || r.category === 'rhymes_nursery')
        ),
        apps: [],
      };

    case 'urdu_audio':
      return {
        resources: publishedRes.filter(
          (r) => (r.language === 'ur' || r.language === 'multilingual') && (r.content_type === 'audio' || r.category === 'audio_poems' || r.category === 'rhymes_nursery')
        ),
        apps: [],
      };

    case 'english_audio':
      return {
        resources: publishedRes.filter(
          (r) => (r.language === 'en' || r.language === 'multilingual') && (r.content_type === 'audio' || r.category === 'audio_poems' || r.category === 'english_vocabulary' || r.category === 'rhymes_nursery')
        ),
        apps: [],
      };

    case 'videos_stories':
      return {
        resources: publishedRes.filter(
          (r) => r.content_type === 'video' || r.category === 'animated_stories' || r.category === 'educational_videos'
        ),
        apps: [],
      };

    case 'math_games':
      return {
        resources: publishedRes.filter(
          (r) => r.subject === 'Mathematics'
        ),
        apps: allApps.filter((a) => a.id === 'app_fun_with_math' || a.category === 'Mathematics'),
      };

    case 'test_maker':
      return {
        resources: publishedRes.filter(
          (r) => r.category === 'tests_quizzes'
        ),
        apps: allApps.filter((a) => a.id === 'app_ra_test_maker' || a.category === 'Assessment'),
      };

    case 'educational_games':
      return {
        resources: publishedRes.filter(
          (r) => r.category === 'educational_games'
        ),
        apps: allApps.filter(
          (a) => a.id === 'app_sindhi_alphabets' || a.id === 'app_primary_quiz' || a.category === 'Language' || a.category === 'Quiz'
        ),
      };

    case 'apps_links':
      return {
        resources: [],
        apps: allApps,
      };

    case 'worksheets_books':
      return {
        resources: publishedRes.filter(
          (r) => r.content_type === 'pdf' || r.category === 'worksheets_pdf' || r.category === 'lessons_explanations'
        ),
        apps: [],
      };

    default:
      return { resources: [], apps: [] };
  }
}
