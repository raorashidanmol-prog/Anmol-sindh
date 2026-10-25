export type LanguageCode = 'sd' | 'ur' | 'en';

export type ClassLevel = '1' | '2' | '3' | '4' | '5' | 'all';

export type SubjectType =
  | 'Sindhi'
  | 'Urdu'
  | 'English'
  | 'Mathematics'
  | 'General Science'
  | 'Social Studies'
  | 'Islamiat & Ethics'
  | 'General Knowledge';

export type ContentCategory =
  | 'audio_poems'
  | 'animated_stories'
  | 'educational_videos'
  | 'lessons_explanations'
  | 'rhymes_nursery'
  | 'english_vocabulary'
  | 'sindhi_learning'
  | 'urdu_learning'
  | 'worksheets_pdf'
  | 'educational_games'
  | 'tests_quizzes';

export type MediaFormat = 'audio' | 'video' | 'pdf' | 'interactive' | 'image';

export interface EducationalResource {
  id: string;
  title_sd: string;
  title_ur: string;
  title_en: string;
  description_sd: string;
  description_ur: string;
  description_en: string;
  class_level: '1' | '2' | '3' | '4' | '5' | 'all';
  subject: SubjectType;
  language: 'sd' | 'ur' | 'en' | 'multilingual';
  category: ContentCategory;
  content_type: MediaFormat;
  thumbnail_url: string;
  media_url: string;
  download_url?: string;
  duration?: string; // e.g., "03:45"
  file_size?: string; // e.g., "4.8 MB"
  file_format?: string; // e.g., "MP3", "MP4", "PDF"
  downloadable: boolean;
  published: boolean;
  status: 'published' | 'draft' | 'archived';
  views_count: number;
  downloads_count: number;
  sort_order: number;
  featured?: boolean;
  created_at: string;
  updated_at: string;
  lyrics_sd?: string;
  lyrics_ur?: string;
  lyrics_en?: string;
}

export interface AppLink {
  id: string;
  title_sd: string;
  title_ur: string;
  title_en: string;
  description_sd: string;
  description_ur: string;
  description_en: string;
  category: string;
  icon: string;
  thumbnail_url?: string;
  first_screen_image?: string;
  url: string;
  is_internal: boolean;
  embeddable: boolean;
  is_active: boolean;
  sort_order: number;
  badge?: string;
}

export interface HeroBanner {
  id: string;
  title_sd: string;
  title_ur: string;
  title_en: string;
  subtitle_sd: string;
  subtitle_ur: string;
  subtitle_en: string;
  image_url: string;
  cta_text_sd: string;
  cta_text_ur: string;
  cta_text_en: string;
  cta_link: string;
  is_active: boolean;
  sort_order: number;
}

export interface SiteSettings {
  site_name_sd: string;
  site_name_ur: string;
  site_name_en: string;
  tagline_sd: string;
  tagline_ur: string;
  tagline_en: string;
  contact_email: string;
  contact_phone: string;
  address_sd: string;
  address_ur: string;
  address_en: string;
  about_sd: string;
  about_ur: string;
  about_en: string;
  allow_public_downloads: boolean;
  fun_with_math_url: string;
  ra_test_maker_url: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  resource_id?: string;
  resource_type: string;
  details: string;
  user_email: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'owner' | 'admin';
  name: string;
  created_at: string;
}

export interface EducationalFolder {
  id: string;
  title_sd: string;
  title_ur: string;
  title_en: string;
  description_sd: string;
  description_ur: string;
  description_en: string;
  icon: string;
  badge?: string;
  gradient: string;
}
