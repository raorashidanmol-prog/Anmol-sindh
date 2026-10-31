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
  const { getText } = useLanguage();

  // 1. Video Poems & Rhymes
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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 space-y-10">
      
      {/* ============================================================ */}
      {/* 1. VIDEO POEMS BOX */}
      {/* ============================================================ */}
      <section className="card-3d-white p-5 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/25">
              <Video className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-rose-500 font-heading font-black">
                  Video Poems Box
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">100% Video Format</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
                Video Poems & Rhymes (نظمون ۽ ترانا)
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs font-heading font-bold px-4 py-2 rounded-full bg-sky-50 hover:bg-sky-100 text-blue-700 border-2 border-sky-200 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>View All Poems</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {videoPoems.slice(0, 4).map((poem) => (
            <div
              key={poem.id}
              onClick={() => onWatchVideo(poem)}
              className="bg-white border-2 border-sky-100 hover:border-rose-400 border-b-4 hover:border-b-rose-500 rounded-2xl p-3.5 cursor-pointer flex flex-col justify-between group transition-all hover:-translate-y-1 shadow-xs"
            >
              <div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900 mb-3 border border-sky-100">
                  <img
                    src={poem.thumbnail_url || '/src/assets/images/rhymes_poems_1792756362325.jpg'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-white">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 text-white text-[10px] font-heading font-bold">
                    Class {poem.class_level}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/80 text-white text-[10px] font-mono">
                    {poem.duration || 'Video'}
                  </div>
                </div>

                <h3 className="font-heading font-bold text-sm text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">
                  {poem.title_en}
                </h3>
                {poem.title_sd && (
                  <p className="font-sindhi text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {poem.title_sd}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-sky-100 mt-2.5">
                <span className="text-rose-500 font-heading font-bold">{poem.subject}</span>
                <span className="text-xs text-blue-600 font-heading font-black flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Watch Now</span>
                  <Play className="w-3 h-3 fill-current" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. ANIMATED STORIES BOX */}
      {/* ============================================================ */}
      <section className="card-3d-white p-5 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25">
              <Film className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-blue-600 font-heading font-black">
                  Stories Box
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">Moral & Folk Stories</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
                Animated Stories & Folk Tales (ڪهاڻيون ۽ قصا)
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('stories')}
            className="text-xs font-heading font-bold px-4 py-2 rounded-full bg-sky-50 hover:bg-sky-100 text-blue-700 border-2 border-sky-200 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {animatedStories.slice(0, 3).map((story) => (
            <div
              key={story.id}
              onClick={() => onWatchVideo(story)}
              className="bg-white border-2 border-sky-100 hover:border-blue-400 border-b-4 hover:border-b-blue-500 rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xs"
            >
              <div>
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={story.thumbnail_url || '/src/assets/images/animated_stories_1792756361819.jpg'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-white">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/80 text-white text-[11px] font-heading font-bold">
                    Class {story.class_level}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/80 text-white text-[10px] font-mono">
                    {story.duration || '06:40'}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="text-xs text-blue-600 font-heading font-bold">
                    {story.subject}
                  </div>
                  <h3 className="font-heading font-black text-base text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {story.title_en}
                  </h3>
                  {story.title_sd && (
                    <p className="font-sindhi text-xs text-slate-500 line-clamp-1">
                      {story.title_sd}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {getText(story, 'description')}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>{story.views_count} views</span>
                </span>
                <span className="text-blue-600 font-heading font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Watch Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CURRICULUM BOOKS & READ-ONLY PDF READER BOX */}
      {/* ============================================================ */}
      <section className="card-3d-white p-5 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/25">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-amber-600 font-heading font-black">
                  PDF Books & Worksheets
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Read-Only In-App</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
                Curriculum Books & PDF Reader (درسي ڪتاب)
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('downloads')}
            className="text-xs font-heading font-bold px-4 py-2 rounded-full bg-sky-50 hover:bg-sky-100 text-blue-700 border-2 border-sky-200 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>View All Books</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* PDF Worksheets & Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {pdfBooks.slice(0, 3).map((pdf) => (
            <div
              key={pdf.id}
              onClick={() => onOpenPdf && onOpenPdf(pdf)}
              className="bg-white border-2 border-sky-100 hover:border-amber-400 border-b-4 hover:border-b-amber-500 rounded-2xl p-4.5 cursor-pointer group flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-heading font-bold text-amber-800">
                    Class {pdf.class_level} · {pdf.subject}
                  </span>
                  <span className="text-slate-400 text-xs font-mono font-bold">
                    {pdf.duration || 'PDF'}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-sm text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">
                      {pdf.title_en}
                    </h3>
                    {pdf.title_sd && (
                      <p className="font-sindhi text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {pdf.title_sd}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {getText(pdf, 'description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-sky-100 flex items-center justify-between mt-3">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Read In-App</span>
                </span>
                <span className="text-xs font-heading font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Read Book</span>
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
