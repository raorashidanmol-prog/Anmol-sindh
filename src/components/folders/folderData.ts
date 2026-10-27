import { EducationalFolder, EducationalResource, AppLink } from '../../types';

export const FOLDERS_CONFIG: EducationalFolder[] = [
  {
    id: 'stories_videos',
    title_sd: '🎬 اينيميٽڊ ڪهاڻيون ۽ قصا (Stories & Tales)',
    title_ur: 'اینیمیٹڈ کہانیاں اور لوک داستانیں',
    title_en: 'Animated Stories & Folk Tales',
    description_sd: 'سنڌ جي ثقافت، درياءَ جي ڪناري اخلاقي سبق ۽ وندر واريون خوبصورت وڊيو ڪهاڻيون',
    description_ur: 'سندھ کی لوک کہانیاں، درسی اسباق اور بچوں کیلئے دلکش اینیمیٹڈ ویڈیوز',
    description_en: 'Enchanting animated folk tales, moral lessons, and rich curriculum video stories.',
    icon: 'Film',
    badge: 'Video Gallery',
    gradient: 'from-emerald-500 via-[#00e599] to-teal-400',
  },
  {
    id: 'poem_videos',
    title_sd: '🎵 وڊيو نظمون ۽ ترانا (Poem Videos)',
    title_ur: 'ویڈیو نظمیں اور خوبصورت ترانے',
    title_en: 'Video Poems & Rhymes',
    description_sd: 'شاهه لطيف جي وائي، اسڪول ترانا ۽ ٻالڪ نغمن جون اعليٰ معيار واريون وڊيوز',
    description_ur: 'شاہ لطیف کا کلام، اسکول کے ترانے اور بچوں کی خوبصورت ویڈیو نظمیں',
    description_en: 'Traditional Sindhi poetry, school learning anthems, and musical rhyme videos.',
    icon: 'Video',
    badge: 'Video Box',
    gradient: 'from-[#00b875] via-[#00e599] to-teal-400',
  },
  {
    id: 'math_science_videos',
    title_sd: '🧮 رياضي ۽ سائنس وڊيو سبق (Math & Science)',
    title_ur: 'ریاضی اور سائنس ویڈیو اسباق',
    title_en: 'Math & General Science Video Lessons',
    description_sd: 'ڪلاس 1 کان 5 تائين رياضي جا بنيادي قاعدا، ابنيمڪس ۽ سائنس تجربن جون وڊيوز',
    description_ur: 'کلاس 1 تا 5 ریاضی کے بنیادی اصول، ایباکس اور سائنس کے ویڈیو اسباق',
    description_en: 'Visual step-by-step math lessons, counting, arithmetic, and general science videos.',
    icon: 'Play',
    badge: 'Video Lessons',
    gradient: 'from-amber-400 via-[#00e599] to-emerald-500',
  },
  {
    id: 'language_lectures',
    title_sd: '📖 سنڌي ۽ اردو وڊيو ليڪچر (Language Lectures)',
    title_ur: 'سندھی اور اردو ویڈیو لیکچرز',
    title_en: 'Sindhi & Urdu Video Lectures',
    description_sd: 'سنڌي ٻولي، تاريخي ورثو، موهن جو دڙو ۽ اردو گرامر جا جامع وڊيو سبق',
    description_ur: 'سندھی زبان، موہن جو دڑو کی تاریخ اور اردو قواعد کے ویڈیو اسباق',
    description_en: 'Sindhi heritage, Mohenjo-Daro history, and Urdu grammar video explanations.',
    icon: 'BookOpen',
    badge: 'Lectures',
    gradient: 'from-cyan-400 via-[#00e599] to-teal-500',
  },
  {
    id: 'games_frame',
    title_sd: '🎮 تعليمي رانديون ۽ فريم (Interactive Games)',
    title_ur: 'تعلیمی کھیل فریم — وہیں کھیلیں',
    title_en: 'Educational Games Hub (Play in Frame)',
    description_sd: 'فن ود ميٿ، آر اي ٽيسٽ ميڪر ۽ سنڌي الف ب — هتي ئي سڌو سنئون رانديون کيڏو',
    description_ur: 'فن ود میتھ، آر اے ٹیسٹ اور سندھی حروف — فریم میں براہ راست کھیلیں',
    description_en: 'Playful primary mathematics, Sindhi alphabet phonics, and science quizzes inside the frame.',
    icon: 'Gamepad2',
    badge: 'Play Directly',
    gradient: 'from-purple-500 via-[#00e599] to-emerald-400',
  },
  {
    id: 'test_maker',
    title_sd: '📝 آر اي ٽيسٽ ميڪر اوزار (RA Test Maker)',
    title_ur: 'آر اے ٹیسٹ میکر امتحانات',
    title_en: 'RA Test Maker Assessment',
    description_sd: 'استادن ۽ شاگردن لاءِ امتحاني پيپر، سوال ناما ۽ ماڊل پيپر جاچڻ جا اوزار',
    description_ur: 'اساتذہ اور طلباء کیلئے امتحانی پیپرز جنریٹر اور حل شدہ ماڈل پیپرز',
    description_en: 'Instant automated exam paper generator, MCQs, and assessment tests.',
    icon: 'FileCheck',
    badge: 'Teacher Tool',
    gradient: 'from-teal-500 via-[#00e599] to-emerald-400',
  },
  {
    id: 'worksheets_books',
    title_sd: '📚 درسي ڪتاب ۽ پي ڊي ايف (Read-Only PDF Books)',
    title_ur: 'درسی کتب اور ورک شیٹس (محفوظ پی ڈی ایف ریڈر)',
    title_en: 'Curriculum Books & PDF Reader',
    description_sd: 'ڪلاس 1 کان 5 تائين نصابي ڪتاب، رنگين ورڪ شيٽس ۽ محفوظ پڙهڻ وارو پي ڊي ايف ريڊر',
    description_ur: 'کلاس 1 تا 5 درسی کتب، ورک شیٹس اور پڑھنے کیلئے محفوظ پی ڈی ایف ریڈر',
    description_en: 'Curriculum textbooks and printable worksheets with built-in Read-Only PDF Reader.',
    icon: 'Folder',
    badge: 'PDF Reader',
    gradient: 'from-rose-400 via-[#00e599] to-teal-400',
  },
];

export interface FolderFilterResult {
  resources: EducationalResource[];
  apps: AppLink[];
  isGamesHub?: boolean;
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
    case 'stories_videos':
      return {
        resources: publishedRes.filter(
          (r) => r.content_type === 'video' && (r.category === 'animated_stories' || r.category === 'educational_videos')
        ),
        apps: [],
      };

    case 'poem_videos':
      return {
        resources: publishedRes.filter(
          (r) => r.content_type === 'video' && (r.category === 'video_poems' || r.category === 'audio_poems' || r.category === 'rhymes_nursery')
        ),
        apps: [],
      };

    case 'math_science_videos':
      return {
        resources: publishedRes.filter(
          (r) => r.content_type === 'video' && (r.subject === 'Mathematics' || r.subject === 'General Science')
        ),
        apps: [],
      };

    case 'language_lectures':
      return {
        resources: publishedRes.filter(
          (r) => r.content_type === 'video' && (r.subject === 'Sindhi' || r.subject === 'Urdu' || r.subject === 'Social Studies')
        ),
        apps: [],
      };

    case 'games_frame':
      return {
        resources: publishedRes.filter((r) => r.category === 'educational_games'),
        apps: allApps.filter((a) => a.is_active),
        isGamesHub: true,
      };

    case 'test_maker':
      return {
        resources: publishedRes.filter(
          (r) => r.category === 'tests_quizzes'
        ),
        apps: allApps.filter((a) => a.id === 'app_ra_test_maker' || a.category === 'Assessment'),
      };

    case 'worksheets_books':
      return {
        resources: publishedRes.filter(
          (r) => r.content_type === 'pdf' || r.category === 'worksheets_pdf' || r.category === 'lessons_explanations' || r.file_format === 'PDF'
        ),
        apps: [],
      };

    default:
      return { resources: [], apps: [] };
  }
}
