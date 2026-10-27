import React from 'react';
import { EducationalResource } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Video, 
  Film, 
  Play, 
  ArrowRight, 
  Eye, 
  BookOpen, 
  FileText, 
  Sparkles, 
  Lock
} from 'lucide-react';

interface HomeMediaBoxesProps {
  resources: EducationalResource[];
  onWatchVideo: (video: EducationalResource) => void;
  onOpenPdf?: (pdf: EducationalResource) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeMediaBoxes: React.FC<HomeMediaBoxesProps> = ({
  resources,
  onWatchVideo,
  onOpenPdf,
  onNavigateTab,
}) => {
  const { getText, language, t } = useLanguage();

  // 1. Video Poems & Rhymes (100% Video format)
  const videoPoems = resources.filter(
    (r) => r.published && r.content_type === 'video' && (r.category === 'video_poems' || r.category === 'rhymes_nursery' || r.category === 'audio_poems')
  );

  // 2. Animated Stories & Tales
  const animatedStories = resources.filter(
    (r) => r.published && r.content_type === 'video' && (r.category === 'animated_stories' || r.category === 'educational_videos')
  );

  // 3. Curriculum Books & PDF Worksheets
  const pdfBooks = resources.filter(
    (r) => r.published && (r.content_type === 'pdf' || r.category === 'worksheets_pdf' || r.category === 'lessons_explanations')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      
      {/* ============================================================ */}
      {/* 1. VIDEO POEMS BOX (وڊيو نظم باڪس) - 3D Glassy Shade */}
      {/* ============================================================ */}
      <section className="glass-3d-box p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00b875] to-[#00e599] text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(0,229,153,0.35)]">
              <Video className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#00e599] font-black">
                  Video Poems Box
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">100% Video Format</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sindhi text-white">
                {language === 'sd' ? 'وڊيو نظمون ۽ ترانا (Video Poems)' : language === 'ur' ? 'ویڈیو نظمیں اور خوبصورت ترانے' : 'Video Poems & Rhymes'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-[#09121f] hover:bg-[#00e599] text-slate-200 hover:text-slate-950 border border-[#00e599]/40 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.3)]"
          >
            <span>{language === 'sd' ? 'سڀ وڊيو نظمون ڏسو' : 'تمام ویڈیو نظمیں دیکھیں'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {videoPoems.slice(0, 4).map((poem) => (
            <div
              key={poem.id}
              onClick={() => onWatchVideo(poem)}
              className="glass-3d-card p-3.5 rounded-2xl cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 mb-3 border border-[#00e599]/20">
                  <img
                    src={poem.thumbnail_url || '/src/assets/images/rhymes_poems_1792756362325.jpg'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-11 h-11 rounded-full bg-[#00e599] text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,153,0.5)] transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-[#00e599]/30 text-[#00e599] text-[10px] font-bold">
                    Class {poem.class_level}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                    {poem.duration || 'Video'}
                  </div>
                </div>

                <h3 className="font-sindhi font-bold text-sm text-white group-hover:text-[#00e599] transition-colors line-clamp-2">
                  {getText(poem, 'title')}
                </h3>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-[#00e599]/15 mt-3">
                <span className="text-[#00e599] font-medium">{poem.subject}</span>
                <span className="text-xs text-[#00e599] font-bold group-hover:underline flex items-center gap-1">
                  <span>{t('watchNow')}</span>
                  <Play className="w-3 h-3 fill-current" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. ANIMATED STORIES BOX (اينيميٽڊ ڪهاڻيون باڪس) - 3D Glassy Shade */}
      {/* ============================================================ */}
      <section className="glass-3d-box p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-[#00e599] text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(0,229,153,0.35)]">
              <Film className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#00e599] font-black">
                  Stories Box
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">Moral & Folk Stories</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sindhi text-white">
                {language === 'sd' ? 'اينيميٽڊ ڪهاڻيون ۽ قصا (Animated Stories)' : language === 'ur' ? 'اینیمیٹڈ لوک کہانیاں اور اسباق' : 'Animated Stories & Folk Tales'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-[#09121f] hover:bg-[#00e599] text-slate-200 hover:text-slate-950 border border-[#00e599]/40 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.3)]"
          >
            <span>{language === 'sd' ? 'سڀ ڪهاڻيون ڏسو' : 'تمام کہانیاں دیکھیں'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {animatedStories.slice(0, 3).map((story) => (
            <div
              key={story.id}
              onClick={() => onWatchVideo(story)}
              className="glass-3d-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src={story.thumbnail_url || '/src/assets/images/animated_stories_1792756361819.jpg'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#00e599] text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,153,0.6)] transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-black/85 border border-[#00e599]/30 text-[#00e599] text-[11px] font-bold">
                    Class {story.class_level}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 text-slate-200 text-[10px] font-mono">
                    {story.duration || '06:40'}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-xs text-[#00e599] font-bold">
                    {story.subject}
                  </div>
                  <h3 className="font-sindhi font-bold text-base text-white group-hover:text-[#00e599] transition-colors line-clamp-2">
                    {getText(story, 'title')}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {getText(story, 'description')}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#00e599]" />
                  <span>{story.views_count} views</span>
                </span>
                <span className="text-[#00e599] font-bold group-hover:underline">
                  {t('watchNow')} →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CURRICULUM BOOKS & READ-ONLY PDF READER BOX - 3D Glassy Shade */}
      {/* ============================================================ */}
      <section className="glass-3d-box p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00e599]/8 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-[#00e599] text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(0,229,153,0.35)]">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#00e599] font-black">
                  PDF Books & Worksheets
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Read-Only Protected</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sindhi text-white">
                {language === 'sd' ? 'درسي ڪتاب ۽ محفوظ پي ڊي ايف ريڊر (PDF Reader)' : language === 'ur' ? 'درسی کتب اور محفوظ پی ڈی ایف ریڈر' : 'Curriculum Books & Read-Only PDF Reader'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('downloads')}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-[#09121f] hover:bg-[#00e599] text-slate-200 hover:text-slate-950 border border-[#00e599]/40 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.3)]"
          >
            <span>{language === 'sd' ? 'سڀ ڪتاب ڏسو' : 'تمام کتب دیکھیں'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PDF Worksheets & Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {pdfBooks.slice(0, 3).map((pdf) => (
            <div
              key={pdf.id}
              onClick={() => onOpenPdf && onOpenPdf(pdf)}
              className="glass-3d-card rounded-2xl p-5 cursor-pointer group flex flex-col justify-between border border-[#00e599]/25 hover:border-[#00e599]/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#00e599]/15 border border-[#00e599]/30 text-xs font-bold text-[#00e599]">
                    Class {pdf.class_level} · {pdf.subject}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    {pdf.duration || 'PDF'}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00e599]/20 border border-[#00e599]/40 text-[#00e599] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sindhi font-bold text-base text-white group-hover:text-[#00e599] transition-colors line-clamp-2">
                      {getText(pdf, 'title')}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {getText(pdf, 'description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-4">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Read-Only Viewer</span>
                </span>
                <span className="text-xs font-bold text-[#00e599] group-hover:underline flex items-center gap-1">
                  <span>{language === 'sd' ? 'پڙهو' : 'پڑھیں'}</span>
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
