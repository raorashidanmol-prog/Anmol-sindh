import React from 'react';
import { EducationalResource } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Play, Video, Music, Sparkles, ArrowRight, Eye, Download } from 'lucide-react';

interface FeaturedContentProps {
  resources: EducationalResource[];
  onPlayAudio: (track: EducationalResource, playlist?: EducationalResource[]) => void;
  onWatchVideo: (video: EducationalResource) => void;
  onNavigateTab: (tab: string) => void;
}

export const FeaturedContent: React.FC<FeaturedContentProps> = ({
  resources,
  onPlayAudio,
  onWatchVideo,
  onNavigateTab,
}) => {
  const { getText, language, t } = useLanguage();

  const featured = resources.filter((r) => r.published && r.featured).slice(0, 3);
  const popularPoems = resources.filter((r) => r.published && r.category === 'audio_poems').slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Featured Spotlight */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
              {language === 'sd' ? 'خاص چونڊ' : 'خصوصی انتخاب'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sindhi">
              {language === 'sd' ? 'نمايان تعليمي مواد' : language === 'ur' ? 'نمایاں تعلیمی مواد' : 'Featured Learning Highlights'}
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <img
                  src={item.thumbnail_url || '/src/assets/images/anmol_sindh_hero_1792756358994.jpg'}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded uppercase shadow-xs">
                  Featured
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-semibold rounded">
                  Class {item.class_level}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                    <span>{item.subject}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.duration || item.file_size}</span>
                  </div>

                  <h3 className="font-sindhi text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {getText(item, 'title')}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {getText(item, 'description')}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 tabular-nums flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.views_count} views</span>
                  </span>

                  {item.content_type === 'audio' ? (
                    <button
                      onClick={() => onPlayAudio(item)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('playNow')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onWatchVideo(item)}
                      className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{t('watchNow')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Audio Poems Row */}
      {popularPoems.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-sindhi">
                  {language === 'sd' ? 'مشهور آڊيو نظم ۽ ٻالڪ ترانا' : 'مشہور آڈیو نظمیں اور کلام'}
                </h3>
                <p className="text-xs text-emerald-200">
                  {language === 'sd' ? 'شاهه جو رسالو، اخلاقي نظمون ۽ اسڪول ترانا' : 'بچوں کیلئے خوبصورت اور شیریں آڈیو'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('poems')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors self-start sm:self-auto cursor-pointer"
            >
              All Audio Poems →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularPoems.map((poem) => (
              <div
                key={poem.id}
                onClick={() => onPlayAudio(poem, popularPoems)}
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md cursor-pointer transition-all flex items-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-white/20 relative">
                  <img
                    src={poem.thumbnail_url || '/src/assets/images/rhymes_poems_1792756362325.jpg'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate font-sindhi group-hover:text-amber-300 transition-colors">
                    {getText(poem, 'title')}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 mt-0.5">
                    <span>Class {poem.class_level}</span>
                    <span aria-hidden="true">·</span>
                    <span>{poem.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};
