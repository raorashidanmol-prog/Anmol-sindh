import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  Sparkles, 
  Video, 
  Film, 
  BookOpen, 
  RotateCcw, 
  Eye, 
  Clock, 
  Plus, 
  Check, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { EducationalResource, ClassLevel } from '../../types';
import { getYouTubeVideoId } from '../../utils/staticStorage';
import { useLanguage } from '../../context/LanguageContext';

interface InteractiveVideoSectionProps {
  videos: EducationalResource[];
  onWatchVideo: (video: EducationalResource) => void;
  onOpenAdminAdd?: () => void;
  isAdminLoggedIn?: boolean;
}

export const InteractiveVideoSection: React.FC<InteractiveVideoSectionProps> = ({
  videos,
  onWatchVideo,
  onOpenAdminAdd,
  isAdminLoggedIn,
}) => {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('all');

  // Categories requested by the user:
  // - Educational Videos
  // - Kids Learning Videos
  // - Islamic & Moral Stories
  // - Cartoon Videos
  const categories = [
    { id: 'all', label: 'All Videos', sindhi: 'سڀ وڊيوز', color: 'bg-blue-600' },
    { id: 'educational_videos', label: 'Educational Videos', sindhi: 'تعليمي وڊيوز', color: 'bg-emerald-600' },
    { id: 'kids_learning', label: 'Kids Learning Videos', sindhi: 'ٻارن جي سکيا وڊيوز', color: 'bg-amber-500' },
    { id: 'islamic_moral_stories', label: 'Islamic & Moral Stories', sindhi: 'اسلامي ۽ اخلاقي ڪهاڻيون', color: 'bg-purple-600' },
    { id: 'cartoon_videos', label: 'Cartoon Videos', sindhi: 'ڪارٽون وڊيوز', color: 'bg-rose-500' },
  ];

  // Helper to extract or resolve thumbnail
  const getVideoThumbnail = (video: EducationalResource): string => {
    if (video.thumbnail_url && !video.thumbnail_url.includes('placeholder')) {
      return video.thumbnail_url;
    }
    const ytId = getYouTubeVideoId(video.media_url || '');
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    return '/src/assets/images/animated_stories_1792756361819.jpg';
  };

  // Helper to map video category
  const matchesCategory = (video: EducationalResource, catId: string): boolean => {
    if (catId === 'all') return true;
    const cat = (video.category || '').toLowerCase();
    const sub = (video.subject || '').toLowerCase();
    const title = (video.title_en || video.title_sd || '').toLowerCase();

    if (catId === 'educational_videos') {
      return cat.includes('educational') || cat.includes('lesson') || sub.includes('science') || sub.includes('math');
    }
    if (catId === 'kids_learning') {
      return cat.includes('learning') || cat.includes('poem') || cat.includes('rhyme') || title.includes('abc') || title.includes('alphabet');
    }
    if (catId === 'islamic_moral_stories') {
      return cat.includes('story') || cat.includes('moral') || sub.includes('islamiat') || title.includes('latif') || title.includes('سچائي');
    }
    if (catId === 'cartoon_videos') {
      return cat.includes('animated') || cat.includes('cartoon') || title.includes('cartoon') || title.includes('لومڙي');
    }
    return false;
  };

  // Filter video list
  const filteredVideos = videos
    .filter((v) => v.content_type === 'video' || getYouTubeVideoId(v.media_url))
    .filter((v) => {
      // Category filter
      if (!matchesCategory(v, selectedCategory)) return false;
      // Class filter
      if (selectedClass !== 'all' && v.class_level !== selectedClass && v.class_level !== 'all') return false;
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = (v.title_en || '').toLowerCase().includes(q) || (v.title_sd || '').toLowerCase().includes(q);
        const matchDesc = (v.description_en || '').toLowerCase().includes(q) || (v.description_sd || '').toLowerCase().includes(q);
        const matchSub = (v.subject || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchSub) return false;
      }
      return true;
    });

  const getCategoryLabel = (video: EducationalResource) => {
    const cat = (video.category || '').toLowerCase();
    if (cat.includes('animated') || cat.includes('cartoon')) return 'Cartoon Video';
    if (cat.includes('story') || cat.includes('moral')) return 'Moral Story';
    if (cat.includes('poem') || cat.includes('rhyme')) return 'Kids Rhyme';
    return 'Educational Video';
  };

  return (
    <section 
      id="interactive-youtube-videos" 
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300"
    >
      {/* ======================================================== */}
      {/* 1. SECTION HEADER BANNER                                 */}
      {/* ======================================================== */}
      <div className="card-3d-white p-6 sm:p-8 bg-gradient-to-r from-white via-sky-50 to-blue-50 border-4 border-white relative overflow-hidden">
        {/* Background playful blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-heading font-black border border-red-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span>YouTube Video Player • In-App Playback</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight leading-tight">
              Interactive Video Gallery 🎬
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Watch official educational YouTube videos, moral stories, and animated poems directly inside Anmol Sindh without external redirects or ads.
            </p>
          </div>

          {/* Quick Action for Admin */}
          {isAdminLoggedIn && onOpenAdminAdd && (
            <div className="shrink-0">
              <button
                onClick={onOpenAdminAdd}
                className="btn-3d-yellow px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add YouTube Link</span>
              </button>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-6 border-t-2 border-sky-100 flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos by title, topic or subject..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-sky-100 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
            />
          </div>

          {/* Class Level Selector */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border-2 border-sky-100 shrink-0 overflow-x-auto w-full sm:w-auto shadow-xs">
            {(['all', '1', '2', '3', '4', '5'] as ClassLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedClass(lvl)}
                className={`px-3 py-1.5 text-xs font-heading font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedClass === lvl
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {lvl === 'all' ? 'All Classes' : `Class ${lvl}`}
              </button>
            ))}
          </div>

          {(search || selectedClass !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedClass('all');
                setSelectedCategory('all');
              }}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 5 Requested Category Pills */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-heading font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/30 border-2 border-white'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-600'
              }`}
            >
              <span>{cat.label}</span>
              <span className="font-sindhi text-[11px] opacity-80">({cat.sindhi})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VIDEO CARDS GRID                                      */}
      {/* ======================================================== */}
      {filteredVideos.length === 0 ? (
        <div className="card-3d-white p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-red-50 text-red-500 flex items-center justify-center">
            <Video className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-heading font-black text-slate-800">
              No Videos Found in this Category
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try searching with another keyword or reset the category filters. You can also paste your YouTube video link in Admin to add new videos anytime!
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedClass('all');
              }}
              className="btn-3d-blue px-6 py-2.5 rounded-full text-xs cursor-pointer"
            >
              View All Videos
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => {
            const thumbUrl = getVideoThumbnail(video);
            const isYouTube = !!getYouTubeVideoId(video.media_url);
            const categoryTag = getCategoryLabel(video);

            return (
              <div
                key={video.id}
                onClick={() => onWatchVideo(video)}
                className="card-3d-white rounded-3xl overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5 transition-all cursor-pointer"
              >
                {/* Video Poster with YouTube Badge & Duration */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={thumbUrl}
                    alt={video.title_en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/animated_stories_1792756361819.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* YouTube Official Label Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {isYouTube ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black bg-red-600 text-white shadow-md flex items-center gap-1">
                        <span>▶ YouTube</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black bg-blue-600 text-white shadow-md">
                        HD Video
                      </span>
                    )}

                    {video.class_level && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-black bg-amber-400 text-amber-950 shadow-xs">
                        Class {video.class_level}
                      </span>
                    )}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 text-white text-[10px] font-mono font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{video.duration || '03:45'}</span>
                  </div>

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/35">
                    <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-heading font-black uppercase tracking-wider">
                        {categoryTag}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">·</span>
                      <span className="text-[11px] text-blue-600 font-heading font-bold truncate">
                        {video.subject}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {video.title_en}
                    </h3>

                    {video.title_sd && (
                      <p className="font-sindhi text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {video.title_sd}
                      </p>
                    )}

                    {(video.description_en || video.description_sd) && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                        {video.description_en || video.description_sd}
                      </p>
                    )}
                  </div>

                  {/* Play Action Strip */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px] font-mono">
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>{video.views_count || 120}</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onWatchVideo(video);
                      }}
                      className="btn-3d-yellow px-4 py-1.5 rounded-full text-xs font-heading font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Inside Website</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
