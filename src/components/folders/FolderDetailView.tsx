import React, { useState } from 'react';
import { EducationalResource, AppLink, ClassLevel } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { FOLDERS_CONFIG, getItemsForFolder } from './folderData';
import { FolderAutoScrollGallery } from './FolderAutoScrollGallery';
import { GamesSectionFrame } from '../games/GamesSectionFrame';
import { 
  ArrowLeft, 
  Search, 
  Play, 
  Video, 
  FileText, 
  Download, 
  ExternalLink, 
  Gamepad2, 
  Calculator, 
  FileCheck, 
  BookOpen, 
  Eye, 
  FolderOpen,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface FolderDetailViewProps {
  folderId: string;
  allResources: EducationalResource[];
  allApps: AppLink[];
  onBack: () => void;
  onWatchVideo: (video: EducationalResource) => void;
  onPlayAudio?: (track: EducationalResource, playlist?: EducationalResource[]) => void;
  onOpenPdf?: (pdf: EducationalResource) => void;
  onOpenApp: (appId: string) => void;
}

export const FolderDetailView: React.FC<FolderDetailViewProps> = ({
  folderId,
  allResources,
  allApps,
  onBack,
  onWatchVideo,
  onPlayAudio,
  onOpenPdf,
  onOpenApp,
}) => {
  const { language, getText, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('all');

  const folder = FOLDERS_CONFIG.find((f) => f.id === folderId);
  const items = getItemsForFolder(folderId, allResources, allApps);

  const folderTitle = folder
    ? language === 'sd'
      ? folder.title_sd
      : language === 'ur'
      ? folder.title_ur
      : folder.title_en
    : 'Learning Folder';

  // Apply in-folder search and class filter
  const filteredResources = items.resources.filter((item) => {
    if (selectedClass !== 'all' && item.class_level !== selectedClass && item.class_level !== 'all') {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSD = (item.title_sd || '').toLowerCase().includes(q) || (item.description_sd || '').toLowerCase().includes(q);
      const matchUR = (item.title_ur || '').toLowerCase().includes(q) || (item.description_ur || '').toLowerCase().includes(q);
      const matchEN = (item.title_en || '').toLowerCase().includes(q) || (item.description_en || '').toLowerCase().includes(q);
      const matchSub = (item.subject || '').toLowerCase().includes(q);
      if (!matchSD && !matchUR && !matchEN && !matchSub) return false;
    }
    return true;
  });

  const filteredApps = items.apps.filter((app) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSD = (app.title_sd || '').toLowerCase().includes(q);
      const matchUR = (app.title_ur || '').toLowerCase().includes(q);
      const matchEN = (app.title_en || '').toLowerCase().includes(q);
      if (!matchSD && !matchUR && !matchEN) return false;
    }
    return true;
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

  const handleDirectOpenApp = (app: AppLink) => {
    if (app.url && (app.url.startsWith('http://') || app.url.startsWith('https://'))) {
      window.open(app.url, '_blank');
      return;
    }
    onOpenApp(app.id);
  };

  const totalFilteredCount = filteredResources.length + filteredApps.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumb Navigation & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#00e599]/20">
        
        {/* Breadcrumb: Home → Folders → Current Folder */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <button 
            onClick={onBack}
            className="hover:text-[#00e599] transition-colors cursor-pointer flex items-center gap-1 font-semibold"
          >
            <span>{t('home')}</span>
          </button>
          <span>/</span>
          <button 
            onClick={onBack}
            className="hover:text-[#00e599] transition-colors cursor-pointer font-semibold"
          >
            <span>{language === 'sd' ? 'فولڊر' : 'فولڈرز'}</span>
          </button>
          <span>/</span>
          <span className="text-[#00e599] font-bold truncate max-w-[200px] sm:max-w-md font-sindhi">
            {folderTitle}
          </span>
        </nav>

        {/* Clear Back Button */}
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#091522] hover:bg-[#00e599] text-[#00e599] hover:text-slate-950 border border-[#00e599]/40 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md self-start sm:self-auto hover:shadow-[0_0_15px_rgba(0,229,153,0.35)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'sd' ? 'واپس وڃو (Back to Folders)' : language === 'ur' ? 'واپس جائیں' : 'Back to Folders'}</span>
        </button>
      </div>

      {/* Folder Header Banner */}
      <div className="glass-3d-box rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00b875] to-[#00e599] text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(0,229,153,0.4)] shrink-0 mt-1">
              <FolderOpen className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider text-[#00e599] font-black">
                  Folder Contents
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">
                  {totalFilteredCount} {totalFilteredCount === 1 ? 'Resource' : 'Resources'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-sindhi leading-snug">
                {folderTitle}
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {folder && (language === 'sd' ? folder.description_sd : language === 'ur' ? folder.description_ur : folder.description_en)}
              </p>
            </div>
          </div>
        </div>

        {/* In-Folder Search & Class Filtering Hub */}
        <div className="mt-6 pt-6 border-t border-[#00e599]/15 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00e599]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-[#060a12] border border-[#00e599]/30 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00e599]"
            />
          </div>

          {/* Class Strip */}
          <div className="flex items-center gap-1 p-1 bg-[#09121f] rounded-xl border border-[#00e599]/30 shrink-0 overflow-x-auto w-full sm:w-auto">
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

          {(search || selectedClass !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedClass('all');
              }}
              className="p-2 text-slate-400 hover:text-[#00e599] transition-colors cursor-pointer shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* If this is the Educational Games folder, render the interactive playable Games Frame directly! */}
      {(folderId === 'games_frame' || items.isGamesHub) && (
        <GamesSectionFrame initialGameId="math" onOpenExternalModal={onOpenApp} />
      )}

      {/* Auto-scrolling image gallery for this folder's items */}
      <FolderAutoScrollGallery
        folderTitle={folderTitle}
        resources={filteredResources}
        apps={filteredApps}
        onWatchVideo={onWatchVideo}
        onPlayAudio={onPlayAudio}
        onOpenPdf={onOpenPdf}
        onOpenApp={onOpenApp}
        onDownload={handleDownload}
      />

      {/* ONLY Items Belonging to This Folder are Rendered Below */}
      {totalFilteredCount === 0 ? (
        <div className="glass-3d-box text-center py-16 rounded-3xl space-y-3">
          <FolderOpen className="w-12 h-12 text-[#00e599] mx-auto opacity-60" />
          <h3 className="text-lg font-bold text-white font-sindhi">
            {t('noResults')}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {language === 'sd'
              ? 'هن چونڊيل درجي يا ڳولا سان ڪو مواد موجود ناهي. مهرباني ڪري فلٽر تبديل ڪريو.'
              : 'No items found matching your current filter in this folder.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedClass('all');
            }}
            className="px-4 py-2 bg-[#00e599] text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
          >
            {t('resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* 1. Render Educational Resources */}
          {filteredResources.map((item) => {
            const isAudio = item.content_type === 'audio';
            const isVideo = item.content_type === 'video';
            const isPdf = item.content_type === 'pdf';

            return (
              <div
                key={item.id}
                className="glass-3d-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Media Artwork / Poster */}
                <div 
                  onClick={() => {
                    if (isVideo) onWatchVideo(item);
                    else if (isPdf) {
                      if (onOpenPdf) onOpenPdf(item);
                      else handleDownload(item);
                    }
                  }}
                  className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden cursor-pointer"
                >
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
                    {isVideo && (
                      <div className="w-12 h-12 rounded-full bg-[#00e599] text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,153,0.6)] group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    )}
                    {isPdf && (
                      <div className="w-11 h-11 rounded-full bg-[#00e599] text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,153,0.5)] group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Bottom Duration Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                    {item.duration || item.file_size || 'Resource'}
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                      <span className="font-bold text-[#00e599]">{item.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{item.category.replace('_', ' ')}</span>
                    </div>

                    <h3 
                      onClick={() => {
                        if (isVideo) onWatchVideo(item);
                        else if (isPdf) {
                          if (onOpenPdf) onOpenPdf(item);
                          else handleDownload(item);
                        }
                      }}
                      className="font-sindhi text-base font-bold text-white group-hover:text-[#00e599] transition-colors line-clamp-2 cursor-pointer"
                    >
                      {getText(item, 'title')}
                    </h3>
                    
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {getText(item, 'description')}
                    </p>
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400 flex items-center gap-1 tabular-nums">
                      <Eye className="w-3.5 h-3.5 text-[#00e599]" />
                      <span>{item.views_count}</span>
                    </span>

                    {isVideo && (
                      <button
                        onClick={() => onWatchVideo(item)}
                        className="px-3 py-1.5 bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{t('watchNow')}</span>
                      </button>
                    )}

                    {isPdf && (
                      <button
                        onClick={() => (onOpenPdf ? onOpenPdf(item) : handleDownload(item))}
                        className="px-3 py-1.5 bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{language === 'sd' ? 'پڙهو (Read PDF)' : language === 'ur' ? 'پڑھیں (Read)' : 'Read PDF'}</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

          {/* 2. Render Apps belonging to This Folder */}
          {filteredApps.map((app) => {
            const screenImage = app.first_screen_image || app.thumbnail_url || '/src/assets/images/fun_with_math_1792756361029.jpg';

            return (
              <div
                key={app.id}
                className="glass-3d-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div 
                  onClick={() => handleDirectOpenApp(app)}
                  className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={screenImage}
                    alt={app.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {app.badge && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#00e599] text-slate-950 text-[10px] font-black rounded uppercase">
                      {app.badge}
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                    <div className="w-12 h-12 rounded-full bg-[#00e599] text-slate-950 flex items-center justify-center shadow-lg">
                      <ExternalLink className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-[#00e599] block mb-1">{app.category}</span>
                    <h3 
                      onClick={() => handleDirectOpenApp(app)}
                      className="font-sindhi text-base font-bold text-white group-hover:text-[#00e599] transition-colors cursor-pointer"
                    >
                      {getText(app, 'title')}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {getText(app, 'description')}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleDirectOpenApp(app)}
                      className="w-full py-2 bg-[#091522] hover:bg-[#00e599] text-[#00e599] hover:text-slate-950 border border-[#00e599]/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Open App Direct</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      )}

      {/* Bottom Back Button */}
      <div className="pt-6 border-t border-[#00e599]/20 flex justify-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-[#091522] hover:bg-[#00e599] text-[#00e599] hover:text-slate-950 border border-[#00e599]/40 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.35)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'sd' ? 'سڀني فولڊرن ڏانهن واپس وڃو' : 'تمام فولڈرز کی طرف واپس جائیں'}</span>
        </button>
      </div>

    </div>
  );
};
