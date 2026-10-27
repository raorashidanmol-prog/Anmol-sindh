import React, { useState } from 'react';
import { EducationalResource, ContentCategory, ClassLevel } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  Music, 
  Video, 
  FileText, 
  Download, 
  Search, 
  RotateCcw, 
  Eye, 
  BookOpen 
} from 'lucide-react';

interface ContentLibraryProps {
  resources: EducationalResource[];
  onPlayAudio?: (track: EducationalResource, playlist?: EducationalResource[]) => void;
  onWatchVideo: (video: EducationalResource) => void;
  onOpenPdf?: (pdf: EducationalResource) => void;
  onOpenGame: (appId: string) => void;
  initialCategory?: string;
}

export const ContentLibrary: React.FC<ContentLibraryProps> = ({
  resources,
  onPlayAudio,
  onWatchVideo,
  onOpenPdf,
  onOpenGame,
  initialCategory = 'all',
}) => {
  const { getText, language, t } = useLanguage();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [downloadableOnly, setDownloadableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'downloads'>('latest');

  const categories: { id: string; labelKey: string }[] = [
    { id: 'all', labelKey: 'allCategories' },
    { id: 'audio_poems', labelKey: 'cat_audio_poems' },
    { id: 'animated_stories', labelKey: 'cat_animated_stories' },
    { id: 'educational_videos', labelKey: 'cat_educational_videos' },
    { id: 'lessons_explanations', labelKey: 'cat_lessons_explanations' },
    { id: 'rhymes_nursery', labelKey: 'cat_rhymes_nursery' },
    { id: 'english_vocabulary', labelKey: 'cat_english_vocabulary' },
    { id: 'sindhi_learning', labelKey: 'cat_sindhi_learning' },
    { id: 'urdu_learning', labelKey: 'cat_urdu_learning' },
    { id: 'worksheets_pdf', labelKey: 'cat_worksheets_pdf' },
    { id: 'educational_games', labelKey: 'cat_educational_games' },
    { id: 'tests_quizzes', labelKey: 'cat_tests_quizzes' },
  ];

  const subjects = [
    'All Subjects',
    'Sindhi (سنڌي)',
    'Mathematics (رياضي)',
    'General Science (سائنس)',
    'Social Studies (سماجي اڀياس)',
    'English Language',
    'Urdu (اردو)',
    'Islamiat (اسلاميات)',
    'Drawing & Arts',
  ];

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedClass('all');
    setSelectedLanguage('all');
    setSelectedSubject('all');
    setSelectedType('all');
    setDownloadableOnly(false);
    setSortBy('latest');
  };

  // Filter items
  const filtered = resources
    .filter((r) => r.published)
    .filter((r) => {
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (selectedClass !== 'all' && r.class_level !== selectedClass && r.class_level !== 'all') return false;
      if (selectedLanguage !== 'all' && r.language !== selectedLanguage && r.language !== 'multilingual') return false;
      if (selectedSubject !== 'All Subjects' && selectedSubject !== 'all' && r.subject !== selectedSubject) return false;
      if (selectedType !== 'all' && r.content_type !== selectedType) return false;
      if (downloadableOnly && !r.downloadable) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchSD = (r.title_sd || '').toLowerCase().includes(q) || (r.description_sd || '').toLowerCase().includes(q);
        const matchUR = (r.title_ur || '').toLowerCase().includes(q) || (r.description_ur || '').toLowerCase().includes(q);
        const matchEN = (r.title_en || '').toLowerCase().includes(q) || (r.description_en || '').toLowerCase().includes(q);
        const matchSub = (r.subject || '').toLowerCase().includes(q);
        if (!matchSD && !matchUR && !matchEN && !matchSub) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.views_count || 0) - (a.views_count || 0);
      if (sortBy === 'downloads') return (b.downloads_count || 0) - (a.downloads_count || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleDownload = (item: EducationalResource) => {
    fetch(`/api/content/${item.id}/download`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        const a = document.createElement('a');
        a.href = data.download_url || item.media_url || '#';
        a.download = data.filename || `${item.title_en || 'download'}.${(item.file_format || 'pdf').toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(() => {});
  };

  return (
    <section id="library" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#00e599] font-black block mb-1">
            {language === 'sd' ? 'مڪمل درسي خزانو' : 'مکمل تعلیمی ذخیرہ'}
          </span>
          <h2 className="text-3xl font-extrabold text-white font-sindhi">
            {language === 'sd' ? 'تعليمي مواد لائبريري (Content Library)' : language === 'ur' ? 'تعلیمی مواد لائبریری' : 'Educational Content Library'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'sd' 
              ? 'ڪلاس 1 کان 5 تائين سنڌي، اردو ۽ انگريزي ۾ سبق، آڊيو نظمون ۽ وڊيوز.'
              : 'Lessons, poems, stories, and worksheets across Classes 1–5.'}
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-xs self-start md:self-end">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <div className="flex items-center p-0.5 bg-[#09121f] rounded-lg border border-[#00e599]/30">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                sortBy === 'latest' ? 'bg-[#00e599] text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                sortBy === 'popular' ? 'bg-[#00e599] text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Most Viewed
            </button>
            <button
              onClick={() => setSortBy('downloads')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                sortBy === 'downloads' ? 'bg-[#00e599] text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Downloads
            </button>
          </div>
        </div>
      </div>

      {/* Main Filter Hub - 3D Glassy Shade */}
      <div className="glass-3d-box rounded-2xl p-5 mb-8 space-y-4">
        
        {/* Row 1: Search + Class Selection */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00e599]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-[#060a12] border border-[#00e599]/30 rounded-xl text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00e599] focus:outline-none"
            />
          </div>

          {/* Class Strip */}
          <div className="flex items-center gap-1 p-1 bg-[#09121f] rounded-xl border border-[#00e599]/30 w-full lg:w-auto overflow-x-auto shrink-0">
            {(['all', '1', '2', '3', '4', '5'] as ClassLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedClass(lvl)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedClass === lvl
                    ? 'bg-[#00e599] text-slate-950 shadow-[0_0_10px_rgba(0,229,153,0.4)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {lvl === 'all' ? t('allClasses') : `Class ${lvl}`}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800 text-xs">
          
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1.5 bg-[#060a12] border border-[#00e599]/30 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00e599]"
          >
            <option value="all">{t('allLanguages')}</option>
            <option value="sd">{t('sindhi')} (سنڌي)</option>
            <option value="ur">{t('urdu')} (اردو)</option>
            <option value="en">{t('english')} (English)</option>
          </select>

          {/* Subject Selector */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 bg-[#060a12] border border-[#00e599]/30 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00e599]"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          {/* Content Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-[#060a12] border border-[#00e599]/30 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00e599]"
          >
            <option value="all">All Media Types</option>
            <option value="audio">Audio (نظم و آواز)</option>
            <option value="video">Video (وڊيو)</option>
            <option value="pdf">Worksheet / PDF (پي ڊي ايف)</option>
          </select>

          {/* Downloadable Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-medium px-2 py-1 hover:bg-[#00e599]/10 rounded">
            <input
              type="checkbox"
              checked={downloadableOnly}
              onChange={(e) => setDownloadableOnly(e.target.checked)}
              className="rounded text-[#00e599] focus:ring-[#00e599] accent-[#00e599]"
            />
            <span>Downloadable Only</span>
          </label>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="ml-auto flex items-center gap-1 text-slate-400 hover:text-[#00e599] cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetFilters')}</span>
          </button>
        </div>

        {/* Row 3: Category Pills */}
        <div className="flex items-center gap-1.5 pt-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[#00e599] text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,153,0.35)]'
                  : 'bg-[#09121f] text-slate-400 hover:text-white hover:bg-[#00e599]/10'
              }`}
            >
              {t(c.labelKey as any)}
            </button>
          ))}
        </div>

      </div>

      {/* Content Cards Grid - 3D Glass Cards */}
      {filtered.length === 0 ? (
        <div className="glass-3d-box text-center py-16 rounded-2xl">
          <BookOpen className="w-12 h-12 text-[#00e599] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-white font-sindhi">
            {t('noResults')}
          </h3>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-[#00e599] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md"
          >
            {t('resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => {
            const isAudio = item.content_type === 'audio';
            const isVideo = item.content_type === 'video';
            const isPdf = item.content_type === 'pdf';

            return (
              <div
                key={item.id}
                className="glass-3d-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Media Artwork / Poster */}
                <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.thumbnail_url || '/src/assets/images/anmol_sindh_hero_1792756358994.jpg'}
                    alt={item.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Class Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/85 border border-[#00e599]/30 backdrop-blur-md rounded text-[#00e599] text-[11px] font-bold">
                    Class {item.class_level}
                  </div>

                  {/* Language Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#00e599] text-slate-950 text-[10px] font-black rounded uppercase shadow-sm">
                    {item.language}
                  </div>

                  {/* Play Action Overlay Button */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    {isAudio && (
                      <button
                        onClick={() => onPlayAudio?.(item, filtered.filter((r) => r.content_type === 'audio'))}
                        className="w-11 h-11 rounded-full bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,153,0.5)] transition-transform active:scale-95 cursor-pointer"
                        title="Listen Audio"
                      >
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </button>
                    )}
                    {isVideo && (
                      <button
                        onClick={() => onWatchVideo(item)}
                        className="w-11 h-11 rounded-full bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,153,0.5)] transition-transform active:scale-95 cursor-pointer"
                        title="Watch Video"
                      >
                        <Video className="w-5 h-5" />
                      </button>
                    )}
                    {isPdf && (
                      <button
                        onClick={() => handleDownload(item)}
                        className="w-11 h-11 rounded-full bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,153,0.5)] transition-transform active:scale-95 cursor-pointer"
                        title="Download Document"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Text & Clean Metadata */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                      <span className="font-bold text-[#00e599]">{item.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.duration || item.file_size || 'Resource'}</span>
                    </div>

                    <h3 className="font-sindhi text-base font-bold text-white group-hover:text-[#00e599] transition-colors line-clamp-2">
                      {getText(item, 'title')}
                    </h3>
                    
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {getText(item, 'description')}
                    </p>
                  </div>

                  {/* Card Action Strip */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400 flex items-center gap-1 tabular-nums">
                      <Eye className="w-3.5 h-3.5 text-[#00e599]" />
                      <span>{item.views_count}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {isAudio && (
                        <button
                          onClick={() => onPlayAudio?.(item, filtered.filter((r) => r.content_type === 'audio'))}
                          className="px-2.5 py-1 bg-[#00e599]/20 hover:bg-[#00e599] text-[#00e599] hover:text-slate-950 font-bold rounded-lg transition-all cursor-pointer"
                        >
                          {t('playNow')}
                        </button>
                      )}
                      {isVideo && (
                        <button
                          onClick={() => onWatchVideo(item)}
                          className="px-2.5 py-1 bg-[#00e599]/20 hover:bg-[#00e599] text-[#00e599] hover:text-slate-950 font-bold rounded-lg transition-all cursor-pointer"
                        >
                          {t('watchNow')}
                        </button>
                      )}
                      {isPdf && (
                        <button
                          onClick={() => (onOpenPdf ? onOpenPdf(item) : handleDownload(item))}
                          className="px-2.5 py-1 bg-[#00e599]/20 hover:bg-[#00e599] text-[#00e599] hover:text-slate-950 font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{language === 'sd' ? 'پڙهو (Read PDF)' : 'پڑھیں (Read)'}</span>
                        </button>
                      )}
                      {item.downloadable && (
                        <button
                          onClick={() => handleDownload(item)}
                          className="p-1.5 text-slate-400 hover:text-[#00e599] transition-colors cursor-pointer"
                          title="Download File"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
