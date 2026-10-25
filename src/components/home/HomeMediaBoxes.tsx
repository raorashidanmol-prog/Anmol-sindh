import React from 'react';
import { EducationalResource } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Music, 
  Video, 
  Film, 
  Play, 
  ArrowRight, 
  Eye
} from 'lucide-react';

interface HomeMediaBoxesProps {
  resources: EducationalResource[];
  onPlayAudio: (track: EducationalResource, playlist?: EducationalResource[]) => void;
  onWatchVideo: (video: EducationalResource) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeMediaBoxes: React.FC<HomeMediaBoxesProps> = ({
  resources,
  onPlayAudio,
  onWatchVideo,
  onNavigateTab,
}) => {
  const { getText, language, t } = useLanguage();

  // Filter resources for each dedicated box
  const audioPoems = resources.filter(
    (r) => r.published && (r.category === 'audio_poems' || r.category === 'rhymes_nursery' || r.content_type === 'audio')
  );

  const educationalVideos = resources.filter(
    (r) => r.published && (r.category === 'educational_videos' || (r.content_type === 'video' && r.category !== 'animated_stories'))
  );

  const animatedStories = resources.filter(
    (r) => r.published && r.category === 'animated_stories'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      
      {/* ============================================================ */}
      {/* 1. AUDIO POEMS BOX (آڊيو نظم باڪس) - 3D Glassy Shade */}
      {/* ============================================================ */}
      <section className="glass-3d-box p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        {/* Pierrot green ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00b875] to-[#00e599] text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(0,229,153,0.35)]">
              <Music className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#00e599] font-black">
                  Audio Box
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">Listen & Learn</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sindhi text-white">
                {language === 'sd' ? 'آڊيو نظم ۽ ٻالڪ ترانا (Audio Poems)' : language === 'ur' ? 'آڈیو نظمیں اور ترانے' : 'Audio Poems & Nursery Rhymes'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('poems')}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-[#09121f] hover:bg-[#00e599] text-slate-200 hover:text-slate-950 border border-[#00e599]/40 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.3)]"
          >
            <span>{language === 'sd' ? 'سڀ نظمون ٻڌو' : 'تمام نظمیں دیکھیں'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Audio Track Cards Grid - 3D Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {audioPoems.slice(0, 4).map((poem) => (
            <div
              key={poem.id}
              onClick={() => onPlayAudio(poem, audioPoems)}
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
                </div>

                <h3 className="font-sindhi font-bold text-sm text-white group-hover:text-[#00e599] transition-colors line-clamp-2">
                  {getText(poem, 'title')}
                </h3>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-[#00e599]/15 mt-3">
                <span className="text-[#00e599] font-medium">{poem.subject}</span>
                <span className="font-mono text-slate-300">{poem.duration || '03:15'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. EDUCATIONAL VIDEOS BOX (تعليمي وڊيوز باڪس) - 3D Glassy Shade */}
      {/* ============================================================ */}
      <section className="glass-3d-box p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        {/* Pierrot green ambient glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00e599]/8 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-[#00e599] text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(0,229,153,0.35)]">
              <Video className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#00e599] font-black">
                  Video Box
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">Watch & Understand</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sindhi text-white">
                {language === 'sd' ? 'تعليمي وڊيوز ۽ وضاحتون (Educational Videos)' : language === 'ur' ? 'تعلیمی ویڈیوز اور اسباق' : 'Educational Videos & Lessons'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-[#09121f] hover:bg-[#00e599] text-slate-200 hover:text-slate-950 border border-[#00e599]/40 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.3)]"
          >
            <span>{language === 'sd' ? 'سڀ وڊيوز ڏسو' : 'تمام ویڈیوز دیکھیں'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video Cards Grid - 3D Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {educationalVideos.slice(0, 3).map((video) => (
            <div
              key={video.id}
              onClick={() => onWatchVideo(video)}
              className="glass-3d-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src={video.thumbnail_url || '/src/assets/images/anmol_sindh_hero_1792756358994.jpg'}
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
                    Class {video.class_level}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 text-slate-200 text-[10px] font-mono">
                    {video.duration || '08:20'}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-xs text-[#00e599] font-bold">
                    {video.subject}
                  </div>
                  <h3 className="font-sindhi font-bold text-base text-white group-hover:text-[#00e599] transition-colors line-clamp-2">
                    {getText(video, 'title')}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {getText(video, 'description')}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#00e599]" />
                  <span>{video.views_count} views</span>
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
      {/* 3. ANIMATED STORIES BOX (اينيميٽڊ ڪهاڻيون باڪس) - 3D Glassy Shade */}
      {/* ============================================================ */}
      <section className="glass-3d-box p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        {/* Pierrot green ambient glow */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-[#00e599] text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(0,229,153,0.35)]">
              <Film className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#00e599] font-black">
                  Animated Box
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">Culture & Wisdom</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sindhi text-white">
                {language === 'sd' ? 'اينيميٽڊ ڪهاڻيون (Animated Stories Box)' : language === 'ur' ? 'اینیمیٹڈ کہانیاں اور لوک قصے' : 'Animated Stories & Folk Tales'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('stories')}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-[#09121f] hover:bg-[#00e599] text-slate-200 hover:text-slate-950 border border-[#00e599]/40 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.3)]"
          >
            <span>{language === 'sd' ? 'سڀ ڪهاڻيون ڏسو' : 'تمام کہانیاں دیکھیں'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stories Cards Grid - 3D Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {animatedStories.slice(0, 3).map((story) => (
            <div
              key={story.id}
              onClick={() => onWatchVideo(story)}
              className="glass-3d-card p-4 rounded-2xl cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 mb-3 border border-[#00e599]/20">
                  <img
                    src={story.thumbnail_url || '/src/assets/images/animated_stories_1792756361819.jpg'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#00e599] text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,153,0.6)] group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 border border-[#00e599]/30 text-[#00e599] text-[10px] font-bold">
                    Class {story.class_level}
                  </div>
                </div>

                <h3 className="font-sindhi font-bold text-base text-white group-hover:text-[#00e599] transition-colors line-clamp-2">
                  {getText(story, 'title')}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {getText(story, 'description')}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-[#00e599]/15 mt-3">
                <span className="text-[#00e599] font-medium">{story.file_format || 'MP4 Animated'}</span>
                <span className="font-mono text-slate-300">{story.duration || '06:40'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
