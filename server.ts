import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Support large JSON payloads for media uploads & backups (up to 250MB for video/audio)
app.use(express.json({ limit: '250mb' }));
app.use(express.urlencoded({ extended: true, limit: '250mb' }));

// Dedicated HTTP 206 Partial Content Range streaming handler for video and audio playback
app.get('/uploads/:fileName', (req, res) => {
  const safeName = path.basename(req.params.fileName);
  const filePath = path.join(UPLOADS_DIR, safeName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const ext = path.extname(filePath).toLowerCase();

  const mimeMap: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.3gp': 'video/3gpp',
    '.mkv': 'video/x-matroska',
    '.m4v': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.aac': 'audio/aac',
    '.m4a': 'audio/m4a',
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };

  const contentType = mimeMap[ext] || 'application/octet-stream';
  const range = req.headers.range;

  // Set CORS and Accept-Ranges
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
      return res.end();
    }

    const chunksize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    });
    fileStream.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

// Simple password hashing using crypto.scrypt
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const h = crypto.scryptSync(password, s, 64).toString('hex');
  return { hash: h, salt: s };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const h = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(h, 'hex'), Buffer.from(hash, 'hex'));
}

// In-memory active tokens
const activeSessions = new Map<string, { email: string; expiresAt: number }>();

// Authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
  }
  (req as any).user = session;
  next();
}

// Initial Database Seeding
function getInitialDB() {
  const { hash, salt } = hashPassword('AnmolSindh@2026');

  return {
    admin: {
      id: 'admin_1',
      email: 'raorashid.anmol@gmail.com',
      name: 'Rao Rashid (Website Owner)',
      passwordHash: hash,
      salt: salt,
      recoveryCode: 'ANMOL-9988-SECURE',
      role: 'owner',
      updatedAt: new Date().toISOString(),
    },
    settings: {
      site_name_sd: 'انمول سنڌ',
      site_name_ur: 'انمول سندھ',
      site_name_en: 'ANMOL SINDH',
      tagline_sd: 'سکو، ٻڌو، ڏسو، کيڏو ۽ اڳتي وڌو',
      tagline_ur: 'سیکھیں، سنیں، دیکھیں، کھیلیں اور بڑھیں',
      tagline_en: 'Learn, Listen, Watch, Play & Grow',
      contact_email: 'raorashid.anmol@gmail.com',
      contact_phone: '+92 300 1234567',
      address_sd: 'حيدرآباد، سنڌ، پاڪستان',
      address_ur: 'حیدرآباد، سندھ، پاکستان',
      address_en: 'Hyderabad, Sindh, Pakistan',
      about_sd: 'انمول سنڌ بنيادي تعليم، سنڌي ٻولي، سائنس ۽ رياضي لاءِ پاڪستاني پرائمري اسڪولن جي ٻارن لاءِ هڪ اعليٰ معياري پليٽفارم آهي.',
      about_ur: 'انمول سندھ بنیادی تعلیم، سندھی زبان، سائنس اور ریاضی کیلئے پاکستانی پرائمری سکول کے بچوں کا معیاری پورٹل ہے۔',
      about_en: 'ANMOL SINDH is an educational technology portal designed for primary school students, educators, and parents across Sindh and Pakistan.',
      allow_public_downloads: true,
      fun_with_math_url: 'FUN_WITH_MATH_URL',
      ra_test_maker_url: 'Anmol Ak _TEST_MAKER_URL',
    },
    apps: [
      {
        id: 'app_fun_with_math',
        title_sd: 'فن ود ميٿ (Fun with Math)',
        title_ur: 'فن ود میتھ (Fun with Math)',
        title_en: 'Fun with Math',
        description_sd: 'پرائمري شاگردن لاءِ رياضي جون دلچسپ رانديون، ڳڻپ، جوڙ، ڪٽ ۽ جدول',
        description_ur: 'پرائمری طلباء کیلئے دلچسپ ریاضی کھیل، گنتی، جمع، نفی اور پہاڑے',
        description_en: 'Playful primary mathematics games, abacus, counting, arithmetic puzzles, and multiplication tables.',
        category: 'Mathematics',
        icon: 'Calculator',
        thumbnail_url: '/src/assets/images/fun_with_math_1792756361029.jpg',
        first_screen_image: '/src/assets/images/fun_with_math_1792756361029.jpg',
        url: 'FUN_WITH_MATH_URL',
        is_internal: true,
        embeddable: true,
        is_active: true,
        sort_order: 1,
        badge: 'Popular',
      },
      {
        id: 'app_ra_test_maker',
        title_sd: 'آر اي ٽيسٽ ميڪر (RA Test Maker)',
        title_ur: 'آر اے ٹیسٹ میکر (RA Test Maker)',
        title_en: 'RA Test Maker',
        description_sd: 'استادن ۽ والدين لاءِ پرائمري ڪلاسن جا فوري ٽيسٽ پيپر ۽ سوال ناما تيار ڪرڻ وارو ٽول',
        description_ur: 'اساتذہ اور والدین کیلئے پرائمری کلاسز کے فوری امتحانی پیپرز اور معروضی سوالات بنانے کا ٹول',
        description_en: 'Fast, automated primary exam paper generator, MCQs, and assessment tool for teachers & parents.',
        category: 'Assessment',
        icon: 'FileCheck',
        thumbnail_url: '/src/assets/images/sindhi_learning_1792756360583.jpg',
        first_screen_image: '/src/assets/images/sindhi_learning_1792756360583.jpg',
        url: 'Anmol Ak _TEST_MAKER_URL',
        is_internal: true,
        embeddable: true,
        is_active: true,
        sort_order: 2,
        badge: 'Teacher Tool',
      },
      {
        id: 'app_sindhi_alphabets',
        title_sd: 'سنڌي الف ب سکيا',
        title_ur: 'سندھی حروف تہجی سیکھیں',
        title_en: 'Sindhi Alphabet Interactive Explorer',
        description_sd: 'سنڌي ٻوليءَ جي 52 اکرن جي درست آواز، تصويرن ۽ لکڻ جي مشق واري تفريحي ايپ',
        description_ur: 'سندھی زبان کے تمام 52 حروف کے درست تلفظ اور بصری مشق کی تفریحی ایپ',
        description_en: 'Master all 52 letters of the Sindhi alphabet with audio pronunciation and interactive phonics.',
        category: 'Language',
        icon: 'BookOpen',
        thumbnail_url: '/src/assets/images/sindhi_learning_1792756360583.jpg',
        first_screen_image: '/src/assets/images/sindhi_learning_1792756360583.jpg',
        url: 'internal:sindhi-alphabets',
        is_internal: true,
        embeddable: true,
        is_active: true,
        sort_order: 3,
        badge: 'Core Skill',
      },
      {
        id: 'app_primary_quiz',
        title_sd: 'ذهانت ۽ علمي مقابلو (Primary Quiz)',
        title_ur: 'ذہانت اور کوئز مقابلہ (Primary Quiz)',
        title_en: 'Primary Knowledge & Science Quiz',
        description_sd: 'ڪلاس 1 کان 5 تائين جنرل سائنس ۽ معلومات عامه جا رنگين سوال ۽ انعام',
        description_ur: 'کلاس 1 تا 5 جنرل سائنس اور معلومات عامہ کے رنگین سوالات اور انعامات',
        description_en: 'Engaging primary science, general knowledge, and logic quiz with stars and badges.',
        category: 'Quiz',
        icon: 'Trophy',
        thumbnail_url: '/src/assets/images/anmol_sindh_hero_1792756358994.jpg',
        first_screen_image: '/src/assets/images/anmol_sindh_hero_1792756358994.jpg',
        url: 'internal:primary-quiz',
        is_internal: true,
        embeddable: true,
        is_active: true,
        sort_order: 4,
        badge: 'Interactive',
      },
    ],
    banners: [
      {
        id: 'banner_1',
        title_sd: 'سنڌ جي مستقبل لاءِ اعليٰ تعليمي پورٽل',
        title_ur: 'سندھ کے مستقبل کیلئے اعلیٰ تعلیمی پورٹل',
        title_en: 'Empowering Young Learners Across Sindh',
        subtitle_sd: 'ڪلاس 1 کان 5 تائين سڀ سبق، آڊيو نظمون، ڪهاڻيون ۽ ورڪ شيٽس هاڻي مفت دستياب آهن',
        subtitle_ur: 'کلاس 1 تا 5 تمام اسباق، آڈیو نظمیں، کہانیاں اور ورک شیٹس اب مفت دستیاب ہیں',
        subtitle_en: 'Complete primary curriculum, audio poems, animated tales, and printable worksheets at your fingertips.',
        image_url: '/src/assets/images/anmol_sindh_hero_1792756358994.jpg',
        cta_text_sd: 'مواد لائبريري کوليو',
        cta_text_ur: 'مواد لائبریری دیکھیں',
        cta_text_en: 'Explore Library',
        cta_link: '#library',
        is_active: true,
        sort_order: 1,
      },
    ],
    resources: [
      {
        id: 'res_1',
        title_sd: 'شاهه لطيف جي وائي: سر ڪلياڻ',
        title_ur: 'شاہ لطیف کی وائی: سر کلیان',
        title_en: 'Shah Latif Poetic Rhyme: Sur Kalyan',
        description_sd: 'سنڌ جي عظيم صوفي شاعر حضرت شاهه عبداللطيف ڀٽائي رح جي ٻارن لاءِ سادي ۽ پرسوز وائي',
        description_ur: 'سندھ کے عظیم صوفی شاعر شاہ عبداللطیف بھٹائی کا بچوں کیلئے سبق آموز اور خوبصورت کلام',
        description_en: 'Melodious classical Sindhi poem introducing children to peace, kindness, and poetic rhythm.',
        class_level: '4',
        subject: 'Sindhi',
        language: 'sd',
        category: 'audio_poems',
        content_type: 'audio',
        thumbnail_url: '/src/assets/images/sindhi_learning_1792756360583.jpg',
        media_url: '', // Web Audio synth fallback will play melodic primary tune!
        download_url: '/uploads/sample_poem_sur_kalyan.mp3',
        duration: '03:15',
        file_size: '3.8 MB',
        file_format: 'MP3',
        downloadable: true,
        published: true,
        status: 'published',
        views_count: 1420,
        downloads_count: 485,
        sort_order: 1,
        featured: true,
        created_at: new Date('2026-03-01').toISOString(),
        updated_at: new Date('2026-03-01').toISOString(),
        lyrics_sd: 'او ڌڻي! مٺا ڌڻي! تون ئي سڀ جو سهارو آهين\nمنهنجا مولا، سڀ کي علم جو نور ڏي\nسنڌ کي سدا سائي ۽ آباد رک!',
        lyrics_ur: 'اے مالک! اے خالق! تو ہی سب کا سہارا ہے\nمیرے مولا سب کو علم کی روشنی عطا فرما\nسندھ کو ہمیشہ شاد و آباد رکھ!',
        lyrics_en: 'O Merciful Lord, you are the guide of all creation. Bless every child with the light of knowledge.',
      },
      {
        id: 'res_2',
        title_sd: 'سچائيءَ جو انعام: ٻڪري ۽ چتر لومڙي',
        title_ur: 'سچائی کا انعام: بکری اور چالاک لومڑی',
        title_en: 'The Reward of Honesty: Folk Story',
        description_sd: 'سنڌ جي خوبصورت پسمنظر ۾ سنڌو درياءَ جي ڪناري ٻارن لاءِ اخلاقي ۽ تفريحي اينيميٽڊ ڪهاڻي',
        description_ur: 'دریائے سندھ کے کنارے بچوں کیلئے خوبصورت سبق آموز اینیمیٹڈ لوک کہانی',
        description_en: 'An engaging animated folk story teaching primary kids the lasting value of truthfulness and courage.',
        class_level: '2',
        subject: 'Sindhi',
        language: 'sd',
        category: 'animated_stories',
        content_type: 'video',
        thumbnail_url: '/src/assets/images/animated_stories_1792756361819.jpg',
        media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        download_url: '/uploads/folk_story_animated.mp4',
        duration: '06:40',
        file_size: '18.4 MB',
        file_format: 'MP4',
        downloadable: true,
        published: true,
        status: 'published',
        views_count: 2890,
        downloads_count: 812,
        sort_order: 2,
        featured: true,
        created_at: new Date('2026-03-02').toISOString(),
        updated_at: new Date('2026-03-02').toISOString(),
      },
      {
        id: 'res_3',
        title_sd: 'پرائمري رياضي: ٻه ۽ ٽي رقمي جوڙ ۽ ڪٽ',
        title_ur: 'پرائمری ریاضی: دو اور تین ہندسوں کی جمع اور تفریق',
        title_en: 'Primary Math: 2-Digit & 3-Digit Addition',
        description_sd: 'رنگين تصويرن، گولين ۽ ابنيمڪس (Abacus) سان آسان انداز ۾ رياضي جا بنيادي قاعدا',
        description_ur: 'رنگین اشیاء اور ایباکس کی مدد سے بچوں کیلئے آسان اور دلچسپ انداز میں جمع و تفریق',
        description_en: 'Interactive visual step-by-step math lesson explaining column addition with carryover.',
        class_level: '3',
        subject: 'Mathematics',
        language: 'ur',
        category: 'educational_videos',
        content_type: 'video',
        thumbnail_url: '/src/assets/images/fun_with_math_1792756361029.jpg',
        media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        download_url: '/uploads/math_class3_addition.mp4',
        duration: '08:20',
        file_size: '22.1 MB',
        file_format: 'MP4',
        downloadable: true,
        published: true,
        status: 'published',
        views_count: 3120,
        downloads_count: 940,
        sort_order: 3,
        featured: true,
        created_at: new Date('2026-03-05').toISOString(),
        updated_at: new Date('2026-03-05').toISOString(),
      },
      {
        id: 'res_4',
        title_sd: 'ٻالڪ نغمو: اسڪول هلنداسين، علم پڙهنداسين',
        title_ur: 'بچوں کا ترانہ: سکول جائیں گے، علم پائیں گے',
        title_en: 'School Anthem: Let Us Go to School',
        description_sd: 'پرائمري اسڪول جي شاگردن لاءِ موهيندڙ ۽ جوشيلي آڊيو نظم، سٺي تربيت ۽ وقت جي پابندي',
        description_ur: 'پرائمری سکول کے بچوں کیلئے ایک پرجوش اور دلکش آڈیو نظم، وقت کی پابندی اور شوق علم',
        description_en: 'Cheerful primary school anthem encouraging school attendance, hygiene, and friendship.',
        class_level: '1',
        subject: 'Sindhi',
        language: 'sd',
        category: 'rhymes_nursery',
        content_type: 'audio',
        thumbnail_url: '/src/assets/images/rhymes_poems_1792756362325.jpg',
        media_url: '',
        download_url: '/uploads/school_anthem_primary.mp3',
        duration: '02:50',
        file_size: '3.1 MB',
        file_format: 'MP3',
        downloadable: true,
        published: true,
        status: 'published',
        views_count: 1980,
        downloads_count: 620,
        sort_order: 4,
        featured: true,
        created_at: new Date('2026-03-07').toISOString(),
        updated_at: new Date('2026-03-07').toISOString(),
        lyrics_sd: 'صبح ٿيو، چمڪيو سج پيارو\nکڻي بستو، نڪتو سڀ شاگرد پيارو\nپڙهنداسين، لکنداسين، اڳتي وڌنداسين\nسنڌ جو نالو روشن ڪنداسين!',
        lyrics_ur: 'صبح ہوئی، چمکا سورج پیارا\nلے کر بستہ، نکلا ہر طالب علم ہمارا\nپڑھیں گے، لکھیں گے، آگے بڑھیں گے\nسندھ کا نام روشن کریں گے!',
        lyrics_en: 'The morning sun shines bright! With books in hand, we step forward to build our bright future.',
      },
      {
        id: 'res_5',
        title_sd: 'انگريزي وڪيبلري: روزمره جا لفظ ۽ صحيح تلفظ',
        title_ur: 'انگریزی وکیبلری: روزمرہ کے الفاظ اور درست تلفظ',
        title_en: 'Daily English Vocabulary & Phonics (Class 1-3)',
        description_sd: 'ڪٽنب، جانورن، ميون ۽ اسڪول جي شين جا انگريزي نالا ۽ صوتي اصول (Phonics)',
        description_ur: 'گھر، جانوروں، پھلوں اور سکول کی اشیاء کے انگریزی نام اور فونیٹکس تلفظ',
        description_en: 'Illustrated foundational vocabulary, sight words, and phonics for primary learners.',
        class_level: '2',
        subject: 'English',
        language: 'en',
        category: 'english_vocabulary',
        content_type: 'pdf',
        thumbnail_url: '/src/assets/images/anmol_sindh_hero_1792756358994.jpg',
        media_url: '/uploads/english_vocab_class2.pdf',
        download_url: '/uploads/english_vocab_class2.pdf',
        duration: '16 Pages',
        file_size: '2.4 MB',
        file_format: 'PDF',
        downloadable: true,
        published: true,
        status: 'published',
        views_count: 2240,
        downloads_count: 750,
        sort_order: 5,
        featured: false,
        created_at: new Date('2026-03-09').toISOString(),
        updated_at: new Date('2026-03-09').toISOString(),
      },
      {
        id: 'res_6',
        title_sd: 'سنڌي ڪتاب ڪلاس 5: سبق ـ موهن جو دڙو جي تاريخ',
        title_ur: 'سندھی کتاب کلاس 5: سبق ـ موہن جو دڑو کی تاریخ',
        title_en: 'Sindhi Class 5: History of Mohenjo-Daro',
        description_sd: 'سنڌ جي قديم تهذيب ۽ موهن جو دڙو جي اهميت بابت جامع درسي سبق ۽ مشقي سوال',
        description_ur: 'سندھ کی قدیم تہذیب اور موہن جو دڑو کی تاریخ پر مشتمل معلوماتی سبق اور مشقی سوالات',
        description_en: 'Comprehensive lesson and chapter guide on the ancient Indus Valley civilization and archaeology.',
        class_level: '5',
        subject: 'Sindhi',
        language: 'sd',
        category: 'lessons_explanations',
        content_type: 'pdf',
        thumbnail_url: '/src/assets/images/sindhi_learning_1792756360583.jpg',
        media_url: '/uploads/sindhi_class5_mohenjodaro.pdf',
        download_url: '/uploads/sindhi_class5_mohenjodaro.pdf',
        duration: '12 Pages',
        file_size: '4.2 MB',
        file_format: 'PDF',
        downloadable: true,
        published: true,
        status: 'published',
        views_count: 1850,
        downloads_count: 630,
        sort_order: 6,
        featured: false,
        created_at: new Date('2026-03-11').toISOString(),
        updated_at: new Date('2026-03-11').toISOString(),
      },
      {
        id: 'res_7',
        title_sd: 'سائنس ورڪ شيٽ ڪلاس 4: ٻوٽن جا حصا ۽ عمل تنفس',
        title_ur: 'سائنس ورک شیٹ کلاس 4: پودوں کے حصے اور تنفس کا عمل',
        title_en: 'General Science Worksheet: Plant Parts & Photosynthesis',
        description_sd: 'پرنٽ لاءِ تيار رنگين ورڪ شيٽ، خالي جايون ڀريو، جوڙا ملايو ۽ ليبل لڳايو',
        description_ur: 'پرنٹ کیلئے تیار رنگین ورک شیٹ، خالی جگہیں پُر کریں، جوڑے ملائیں اور نام لکھیں',
        description_en: 'Printable activity worksheet with labeling diagrams, fill in the blanks, and observational questions.',
        class_level: '4',
        subject: 'General Science',
        language: 'sd',
        category: 'worksheets_pdf',
        content_type: 'pdf',
        thumbnail_url: '/src/assets/images/anmol_sindh_hero_1792756358994.jpg',
        media_url: '/uploads/science_worksheet_plants_class4.pdf',
        download_url: '/uploads/science_worksheet_plants_class4.pdf',
        duration: '4 Pages',
        file_size: '1.5 MB',
        file_format: 'PDF',
        downloadable: true,
        published: true,
        status: 'published',
        views_count: 3410,
        downloads_count: 1350,
        sort_order: 7,
        featured: true,
        created_at: new Date('2026-03-12').toISOString(),
        updated_at: new Date('2026-03-12').toISOString(),
      },
      {
        id: 'res_8',
        title_sd: 'اردو قواعد و انشاء: اسم، فعل ۽ حرف جي سڃاڻپ (ڪلاس 3)',
        title_ur: 'اردو قواعد و انشاء: اسم، فعل اور حرف کی پہچان (کلاس 3)',
        title_en: 'Urdu Grammar: Noun, Verb & Preposition Basics',
        description_sd: 'مثالن ۽ تصويرن سان اردو ٻوليءَ جي بنيادي گرامر جا اصول ۽ سوال',
        description_ur: 'تصویروں اور روزمرہ مثالوں کے ساتھ اردو گرامر کے بنیادی اجزائے کلام کی مشق',
        description_en: 'Interactive Urdu grammar tutorial explaining basic parts of speech with illustrated sentences.',
        class_level: '3',
        subject: 'Urdu',
        language: 'ur',
        category: 'urdu_learning',
        content_type: 'pdf',
        thumbnail_url: '/src/assets/images/animated_stories_1792756361819.jpg',
        media_url: '/uploads/urdu_grammar_class3.pdf',
        download_url: '/uploads/urdu_grammar_class3.pdf',
        duration: '8 Pages',
        file_size: '2.8 MB',
        file_format: 'PDF',
        downloadable: true,
        published: true,
        status: 'published',
        views_count: 1670,
        downloads_count: 520,
        sort_order: 8,
        featured: false,
        created_at: new Date('2026-03-14').toISOString(),
        updated_at: new Date('2026-03-14').toISOString(),
      },
      {
        id: 'res_9',
        title_sd: 'آڊيو نظم: اسان جا پيارا جانور ۽ پکي',
        title_ur: 'آڈیو نظم: ہمارے پیارے جانور اور پرندے',
        title_en: 'Audio Nursery Song: Animals & Birds',
        description_sd: 'ڪلاس 1 ۽ 2 لاءِ چوپاين ۽ پکين جا مٺا آواز ۽ خوبصورت نظمي ترانو',
        description_ur: 'کلاس 1 اور 2 کیلئے جانوروں اور پرندوں کی پیاری آوازوں والی معلوماتی نظم',
        description_en: 'Lively animal sounds and rhyme song teaching primary kids about domestic and wild animals.',
        class_level: '1',
        subject: 'General Science',
        language: 'sd',
        category: 'audio_poems',
        content_type: 'audio',
        thumbnail_url: '/src/assets/images/rhymes_poems_1792756362325.jpg',
        media_url: '',
        download_url: '/uploads/animals_rhyme_sd.mp3',
        duration: '02:30',
        file_size: '2.9 MB',
        file_format: 'MP3',
        downloadable: true,
        published: true,
        status: 'published',
        views_count: 2120,
        downloads_count: 710,
        sort_order: 9,
        featured: false,
        created_at: new Date('2026-03-16').toISOString(),
        updated_at: new Date('2026-03-16').toISOString(),
      },
      {
        id: 'res_10',
        title_sd: 'آنلائن ٽيسٽ: پاڪستان اسٽڊيز ۽ سوشل اسٽڊيز (ڪلاس 5)',
        title_ur: 'آن لائن ٹیسٹ: پاکستان اسٹڈیز اور سوشل اسٹڈیز (کلاس 5)',
        title_en: 'Class 5 Social Studies Model Test Paper',
        description_sd: 'سالياني امتحانن لاءِ 50 نمبرن جو مڪمل نموني پيپر ۽ جوابي ڪنجي',
        description_ur: 'سالانہ امتحانات کیلئے 50 نمبروں کا مکمل ماڈل پیپر اور جوابی کلید',
        description_en: 'Class 5 comprehensive evaluation test paper covering geography, culture, and civics.',
        class_level: '5',
        subject: 'Social Studies',
        language: 'sd',
        category: 'tests_quizzes',
        content_type: 'pdf',
        thumbnail_url: '/src/assets/images/sindhi_learning_1792756360583.jpg',
        media_url: '/uploads/social_studies_model_test_class5.pdf',
        download_url: '/uploads/social_studies_model_test_class5.pdf',
        duration: '6 Pages',
        file_size: '1.9 MB',
        file_format: 'PDF',
        downloadable: true,
        published: true,
        status: 'published',
        views_count: 2780,
        downloads_count: 1120,
        sort_order: 10,
        featured: true,
        created_at: new Date('2026-03-18').toISOString(),
        updated_at: new Date('2026-03-18').toISOString(),
      },
    ],
    auditLogs: [
      {
        id: 'log_init',
        timestamp: new Date().toISOString(),
        action: 'SYSTEM_INITIALIZATION',
        resource_type: 'System',
        details: 'Anmol Sindh educational database initialized with Class 1-5 curriculum resources.',
        user_email: 'raorashid.anmol@gmail.com',
      },
    ],
  };
}

// Load DB
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, restoring from initial:', err);
    const initial = getInitialDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

// Save DB atomically
function saveDB(data: any) {
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Helper to add audit log
function addAuditLog(action: string, resource_type: string, details: string, email: string, resource_id?: string) {
  const db = loadDB();
  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    action,
    resource_type,
    resource_id,
    details,
    user_email: email,
  };
  db.auditLogs = [log, ...(db.auditLogs || [])].slice(0, 100); // keep last 100
  saveDB(db);
}

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'ANMOL SINDH API', time: new Date().toISOString() });
});

// Site Settings
app.get('/api/settings', (req, res) => {
  const db = loadDB();
  res.json(db.settings || {});
});

// App Links
app.get('/api/apps', (req, res) => {
  const db = loadDB();
  const activeApps = (db.apps || [])
    .filter((a: any) => a.is_active)
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
  res.json(activeApps);
});

// Banners
app.get('/api/banners', (req, res) => {
  const db = loadDB();
  const activeBanners = (db.banners || [])
    .filter((b: any) => b.is_active)
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
  res.json(activeBanners);
});

// Content Resources Search & Filter
app.get('/api/content', (req, res) => {
  const db = loadDB();
  let list = db.resources || [];

  // Filter published only for public, unless admin query
  const isAdmin = req.query.admin === 'true';
  if (!isAdmin) {
    list = list.filter((r: any) => r.published);
  }

  // Filter: Class
  const classFilter = req.query.class as string;
  if (classFilter && classFilter !== 'all') {
    list = list.filter((r: any) => r.class_level === classFilter || r.class_level === 'all');
  }

  // Filter: Language
  const langFilter = req.query.language as string;
  if (langFilter && langFilter !== 'all') {
    list = list.filter((r: any) => r.language === langFilter || r.language === 'multilingual');
  }

  // Filter: Category
  const catFilter = req.query.category as string;
  if (catFilter && catFilter !== 'all') {
    list = list.filter((r: any) => r.category === catFilter);
  }

  // Filter: Subject
  const subjectFilter = req.query.subject as string;
  if (subjectFilter && subjectFilter !== 'all') {
    list = list.filter((r: any) => r.subject === subjectFilter);
  }

  // Filter: Content Type
  const typeFilter = req.query.content_type as string;
  if (typeFilter && typeFilter !== 'all') {
    list = list.filter((r: any) => r.content_type === typeFilter);
  }

  // Filter: Downloadable
  const downloadableFilter = req.query.downloadable as string;
  if (downloadableFilter === 'true') {
    list = list.filter((r: any) => r.downloadable);
  }

  // Multi-lingual Search query
  const query = (req.query.search as string || '').trim().toLowerCase();
  if (query) {
    list = list.filter((r: any) => {
      const matchSD = (r.title_sd || '').toLowerCase().includes(query) || (r.description_sd || '').toLowerCase().includes(query);
      const matchUR = (r.title_ur || '').toLowerCase().includes(query) || (r.description_ur || '').toLowerCase().includes(query);
      const matchEN = (r.title_en || '').toLowerCase().includes(query) || (r.description_en || '').toLowerCase().includes(query);
      const matchSubject = (r.subject || '').toLowerCase().includes(query);
      return matchSD || matchUR || matchEN || matchSubject;
    });
  }

  // Sorting
  const sort = req.query.sort as string;
  if (sort === 'popular') {
    list.sort((a: any, b: any) => (b.views_count || 0) - (a.views_count || 0));
  } else if (sort === 'downloads') {
    list.sort((a: any, b: any) => (b.downloads_count || 0) - (a.downloads_count || 0));
  } else if (sort === 'title') {
    list.sort((a: any, b: any) => (a.title_en || a.title_sd || '').localeCompare(b.title_en || b.title_sd || ''));
  } else {
    // Default latest
    list.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  res.json({
    total: list.length,
    resources: list,
  });
});

// Single Resource Detail
app.get('/api/content/:id', (req, res) => {
  const db = loadDB();
  const item = (db.resources || []).find((r: any) => r.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  res.json(item);
});

// Increment View Count
app.post('/api/content/:id/view', (req, res) => {
  const db = loadDB();
  const index = (db.resources || []).findIndex((r: any) => r.id === req.params.id);
  if (index >= 0) {
    db.resources[index].views_count = (db.resources[index].views_count || 0) + 1;
    saveDB(db);
    return res.json({ success: true, views_count: db.resources[index].views_count });
  }
  res.status(404).json({ error: 'Resource not found' });
});

// Track & Trigger Download
app.post('/api/content/:id/download', (req, res) => {
  const db = loadDB();
  const index = (db.resources || []).findIndex((r: any) => r.id === req.params.id);
  if (index >= 0) {
    const item = db.resources[index];
    if (!item.downloadable) {
      return res.status(403).json({ error: 'Downloads are restricted for this educational resource.' });
    }
    item.downloads_count = (item.downloads_count || 0) + 1;
    saveDB(db);

    return res.json({
      success: true,
      downloads_count: item.downloads_count,
      download_url: item.download_url || item.media_url,
      filename: `${item.title_en || item.title_sd || 'anmol_sindh_resource'}.${(item.file_format || 'pdf').toLowerCase()}`,
    });
  }
  res.status(404).json({ error: 'Resource not found' });
});

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

// Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = loadDB();
  const admin = db.admin;

  if (email.trim().toLowerCase() !== admin.email.toLowerCase()) {
    return res.status(401).json({ error: 'Invalid administrator credentials' });
  }

  const isValid = verifyPassword(password, admin.passwordHash, admin.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid administrator password' });
  }

  // Issue session token valid for 24 hours
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  activeSessions.set(token, { email: admin.email, expiresAt });

  addAuditLog('ADMIN_LOGIN', 'Auth', `Owner logged in from session token`, admin.email);

  res.json({
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
});

// Check Session
app.get('/api/admin/me', requireAdmin, (req, res) => {
  const db = loadDB();
  const admin = db.admin;
  res.json({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });
});

// Logout
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// Change Password
app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const db = loadDB();
  const isValid = verifyPassword(currentPassword, db.admin.passwordHash, db.admin.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Current password does not match.' });
  }

  const { hash, salt } = hashPassword(newPassword);
  db.admin.passwordHash = hash;
  db.admin.salt = salt;
  db.admin.updatedAt = new Date().toISOString();
  saveDB(db);

  addAuditLog('PASSWORD_CHANGED', 'Auth', 'Administrator updated their master password', db.admin.email);

  res.json({ success: true, message: 'Password successfully updated' });
});

// Password Recovery with recovery code
app.post('/api/admin/recover-password', (req, res) => {
  const { recoveryCode, newPassword } = req.body;
  const db = loadDB();
  if (!recoveryCode || recoveryCode.trim() !== db.admin.recoveryCode) {
    return res.status(400).json({ error: 'Invalid recovery code provided.' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const { hash, salt } = hashPassword(newPassword);
  db.admin.passwordHash = hash;
  db.admin.salt = salt;
  db.admin.updatedAt = new Date().toISOString();
  saveDB(db);

  addAuditLog('PASSWORD_RECOVERED', 'Auth', 'Password was reset using the master recovery code', db.admin.email);

  res.json({ success: true, message: 'Password has been reset successfully. You can now login.' });
});

// ==========================================
// ADMIN CONTENT CRUD
// ==========================================

// Create Content
app.post('/api/admin/content', requireAdmin, (req, res) => {
  const db = loadDB();
  const user = (req as any).user;
  const body = req.body;

  const id = `res_${Date.now()}`;
  const newResource = {
    id,
    title_sd: body.title_sd || '',
    title_ur: body.title_ur || '',
    title_en: body.title_en || '',
    description_sd: body.description_sd || '',
    description_ur: body.description_ur || '',
    description_en: body.description_en || '',
    class_level: body.class_level || '1',
    subject: body.subject || 'Sindhi',
    language: body.language || 'sd',
    category: body.category || 'lessons_explanations',
    content_type: body.content_type || 'audio',
    thumbnail_url: body.thumbnail_url || '/src/assets/images/anmol_sindh_hero_1792756358994.jpg',
    media_url: body.media_url || '',
    download_url: body.download_url || body.media_url || '',
    duration: body.duration || '03:00',
    file_size: body.file_size || '3.5 MB',
    file_format: body.file_format || 'MP3',
    downloadable: Boolean(body.downloadable),
    published: body.published !== undefined ? Boolean(body.published) : true,
    status: body.status || 'published',
    views_count: 0,
    downloads_count: 0,
    sort_order: Number(body.sort_order) || (db.resources.length + 1),
    featured: Boolean(body.featured),
    lyrics_sd: body.lyrics_sd || '',
    lyrics_ur: body.lyrics_ur || '',
    lyrics_en: body.lyrics_en || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.resources.unshift(newResource);
  saveDB(db);

  addAuditLog('CREATE_RESOURCE', 'Resource', `Created resource: ${newResource.title_en || newResource.title_sd}`, user.email, id);

  res.status(201).json(newResource);
});

// Update Content
app.put('/api/admin/content/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const user = (req as any).user;
  const index = (db.resources || []).findIndex((r: any) => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const existing = db.resources[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    updated_at: new Date().toISOString(),
  };

  db.resources[index] = updated;
  saveDB(db);

  addAuditLog('UPDATE_RESOURCE', 'Resource', `Updated resource: ${updated.title_en || updated.title_sd}`, user.email, updated.id);

  res.json(updated);
});

// Delete Content
app.delete('/api/admin/content/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const user = (req as any).user;
  const index = (db.resources || []).findIndex((r: any) => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const deleted = db.resources.splice(index, 1)[0];
  saveDB(db);

  addAuditLog('DELETE_RESOURCE', 'Resource', `Deleted resource: ${deleted.title_en || deleted.title_sd}`, user.email, deleted.id);

  res.json({ success: true, message: 'Resource deleted' });
});

// ==========================================
// ADMIN APP LINKS CRUD
// ==========================================

app.post('/api/admin/apps', requireAdmin, (req, res) => {
  const db = loadDB();
  const user = (req as any).user;
  const id = `app_${Date.now()}`;
  const newApp = {
    id,
    ...req.body,
    sort_order: Number(req.body.sort_order) || ((db.apps || []).length + 1),
    is_active: req.body.is_active !== undefined ? Boolean(req.body.is_active) : true,
  };
  db.apps = [...(db.apps || []), newApp];
  saveDB(db);
  addAuditLog('CREATE_APP_LINK', 'App', `Created app link: ${newApp.title_en || newApp.title_sd}`, user.email, id);
  res.status(201).json(newApp);
});

app.put('/api/admin/apps/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const user = (req as any).user;
  const index = (db.apps || []).findIndex((a: any) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'App not found' });

  db.apps[index] = { ...db.apps[index], ...req.body, id: db.apps[index].id };
  saveDB(db);
  addAuditLog('UPDATE_APP_LINK', 'App', `Updated app: ${db.apps[index].title_en || db.apps[index].title_sd}`, user.email, db.apps[index].id);
  res.json(db.apps[index]);
});

app.delete('/api/admin/apps/:id', requireAdmin, (req, res) => {
  const db = loadDB();
  const user = (req as any).user;
  const index = (db.apps || []).findIndex((a: any) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'App not found' });

  const deleted = db.apps.splice(index, 1)[0];
  saveDB(db);
  addAuditLog('DELETE_APP_LINK', 'App', `Deleted app: ${deleted.title_en || deleted.title_sd}`, user.email, deleted.id);
  res.json({ success: true });
});

// ==========================================
// ADMIN SETTINGS, BANNERS, STATS & BACKUP
// ==========================================

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const db = loadDB();
  const user = (req as any).user;
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  addAuditLog('UPDATE_SETTINGS', 'Settings', 'Updated global site settings and app placeholders', user.email);
  res.json(db.settings);
});

app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const db = loadDB();
  const resources = db.resources || [];

  const totalViews = resources.reduce((acc: number, r: any) => acc + (r.views_count || 0), 0);
  const totalDownloads = resources.reduce((acc: number, r: any) => acc + (r.downloads_count || 0), 0);

  const byType: { [key: string]: number } = {};
  const byClass: { [key: string]: number } = {};
  const byLanguage: { [key: string]: number } = {};

  resources.forEach((r: any) => {
    byType[r.content_type] = (byType[r.content_type] || 0) + 1;
    byClass[r.class_level] = (byClass[r.class_level] || 0) + 1;
    byLanguage[r.language] = (byLanguage[r.language] || 0) + 1;
  });

  // Calculate uploads folder size
  let storageBytes = 0;
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    files.forEach((file) => {
      const stats = fs.statSync(path.join(UPLOADS_DIR, file));
      storageBytes += stats.size;
    });
  } catch {}

  res.json({
    totalResources: resources.length,
    publishedCount: resources.filter((r: any) => r.published).length,
    totalViews,
    totalDownloads,
    byType,
    byClass,
    byLanguage,
    storageMB: (storageBytes / (1024 * 1024)).toFixed(2),
    activeAppsCount: (db.apps || []).filter((a: any) => a.is_active).length,
  });
});

app.get('/api/admin/audit-logs', requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.auditLogs || []);
});

// Database Export
app.get('/api/admin/export', requireAdmin, (req, res) => {
  const db = loadDB();
  const exportData = {
    ...db,
    exported_at: new Date().toISOString(),
    system: 'ANMOL SINDH Educational Database Backup',
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=anmol_sindh_backup_${Date.now()}.json`);
  res.send(JSON.stringify(exportData, null, 2));
});

// Database Restore
app.post('/api/admin/import', requireAdmin, (req, res) => {
  const user = (req as any).user;
  const backupData = req.body;
  if (!backupData || !backupData.resources || !Array.isArray(backupData.resources)) {
    return res.status(400).json({ error: 'Invalid backup file schema' });
  }

  const current = loadDB();
  // Preserve current admin credentials unless explicitly included
  const restored = {
    ...backupData,
    admin: current.admin,
  };
  saveDB(restored);

  addAuditLog('RESTORE_DATABASE', 'Database', `Database restored from backup containing ${backupData.resources.length} resources`, user.email);

  res.json({ success: true, message: `Database restored with ${backupData.resources.length} resources` });
});

// Direct Binary Stream File Upload (Fastest, zero-memory bloat, handles large video files)
app.post('/api/upload-binary', requireAdmin, (req, res) => {
  const originalName = (req.query.fileName as string) || (req.headers['x-file-name'] as string) || 'upload.mp4';
  const cleanExt = path.extname(originalName).toLowerCase() || '.mp4';
  const safeName = `${Date.now()}_${crypto.randomBytes(6).toString('hex')}${cleanExt}`;
  const filePath = path.join(UPLOADS_DIR, safeName);

  const writeStream = fs.createWriteStream(filePath);
  let totalBytes = 0;

  req.on('data', (chunk) => {
    totalBytes += chunk.length;
    // 200MB limit
    if (totalBytes > 200 * 1024 * 1024) {
      writeStream.destroy();
      try { fs.unlinkSync(filePath); } catch {}
      return res.status(400).json({ error: 'File size exceeds maximum 200MB limit.' });
    }
  });

  req.pipe(writeStream);

  writeStream.on('finish', () => {
    const publicUrl = `/uploads/${safeName}`;
    res.json({
      success: true,
      url: publicUrl,
      fileName: safeName,
      size: `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`,
    });
  });

  writeStream.on('error', (err) => {
    console.error('Binary upload stream error:', err);
    res.status(500).json({ error: 'Failed to write binary upload to server.' });
  });
});

// JSON Base64 File Upload (Supports up to 200MB with lenient media formats)
app.post('/api/upload', requireAdmin, (req, res) => {
  const { fileName, fileData, mimeType } = req.body;
  if (!fileName || !fileData) {
    return res.status(400).json({ error: 'File name and file content are required' });
  }

  try {
    const cleanExt = path.extname(fileName).toLowerCase() || '.mp4';
    const safeName = `${Date.now()}_${crypto.randomBytes(6).toString('hex')}${cleanExt}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    // Strip base64 data header if present
    const base64Data = fileData.replace(/^data:([A-Za-z-+\/0-9]+);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Max 200MB file limit
    if (buffer.length > 200 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds maximum 200MB limit.' });
    }

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({
      success: true,
      url: publicUrl,
      fileName: safeName,
      size: `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
    });
  } catch (err: any) {
    console.error('Upload write failed:', err);
    res.status(500).json({ error: 'Failed to write upload to server disk.' });
  }
});

// ==========================================
// VITE DEV SERVER OR STATIC PRODUCTION BUILD
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware in dev
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ANMOL SINDH educational platform running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
