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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-sky-100">
        
        {/* Breadcrumb: Home → Folders → Current Folder */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-heading">
          <button 
            onClick={onBack}
            className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 font-bold"
          >
            <span>{t('home')}</span>
          </button>
          <span>/</span>
          <button 
            onClick={onBack}
            className="hover:text-blue-600 transition-colors cursor-pointer font-bold"
          >
            <span>{language === 'sd' ? 'فولڊر' : 'Folders'}</span>
          </button>
          <span>/</span>
          <span className="text-blue-600 font-black truncate max-w-[200px] sm:max-w-md">
            {folderTitle}
          </span>
        </nav>

        {/* Clear Back Button */}
        <button
          onClick={onBack}
          className="btn-3d-blue px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-black flex items-center gap-2 transition-all cursor-pointer shadow-md self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span>{language === 'sd' ? 'واپس وڃو (Back to Folders)' : language === 'ur' ? 'واپس جائیں' : 'Back to Folders'}</span>
        </button>
      </div>

      {/* Folder Header Banner */}
      <div className="card-3d-white p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-white via-sky-50/50 to-blue-50/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-sky-500/30 shrink-0 mt-1">
              <FolderOpen className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider text-blue-600 font-heading font-black">
                  Folder Contents
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  {totalFilteredCount} {totalFilteredCount === 1 ? 'Resource' : 'Resources'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-slate-900 leading-snug">
                {folderTitle}
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed font-medium">
                {folder && (language === 'sd' ? folder.description_sd : language === 'ur' ? folder.description_ur : folder.description_en)}
              </p>
            </div>
          </div>
        </div>

        {/* In-Folder Search & Class Filtering Hub */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-white border-2 border-sky-100 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-medium"
            />
          </div>

          {/* Class Strip */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border-2 border-sky-100 shrink-0 overflow-x-auto w-full sm:w-auto shadow-xs">
            {(['all', '1', '2', '3', '4', '5'] as ClassLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedClass(lvl)}
                className={`px-3 py-1.5 text-xs font-heading font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedClass === lvl
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-600'
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
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
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
        <div className="card-3d-white text-center py-16 rounded-3xl space-y-3">
          <FolderOpen className="w-12 h-12 text-blue-400 mx-auto opacity-70" />
          <h3 className="text-lg font-heading font-black text-slate-900">
            {t('noResults')}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
            {language === 'sd'
              ? 'هن چونڊيل درجي يا ڳولا سان ڪو مواد موجود ناهي. مهرباني ڪري فلٽر تبديل ڪريو.'
              : 'No items found matching your current filter in this folder.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedClass('all');
            }}
            className="btn-3d-blue px-5 py-2.5 rounded-full text-xs font-heading font-black cursor-pointer shadow-md"
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
                className="card-3d-white rounded-2xl overflow-hidden flex flex-col justify-between group"
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
                  className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.thumbnail_url || '/src/assets/images/anmol_sindh_hero_1792756358994.jpg'}
                    alt={item.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Class Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full text-blue-700 text-[11px] font-heading font-bold shadow-xs">
                    Class {item.class_level}
                  </div>

                  {/* Language Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-heading font-black rounded-full uppercase shadow-xs">
                    {item.language}
                  </div>

                  {/* Play Action Overlay Button */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                    {isVideo && (
                      <div className="w-12 h-12 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-blue-600 translate-x-0.5" />
                      </div>
                    )}
                    {isPdf && (
                      <div className="w-11 h-11 rounded-full bg-white/95 text-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Bottom Duration Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                    {item.duration || item.file_size || 'Resource'}
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
                      <span className="font-heading font-bold text-blue-600">{item.subject}</span>
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
                      className="font-heading text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {getText(item, 'title')}
                    </h3>
                    
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-medium">
                      {getText(item, 'description')}
                    </p>
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>{item.views_count}</span>
                    </span>

                    {isVideo && (
                      <button
                        onClick={() => onWatchVideo(item)}
                        className="btn-3d-blue px-3 py-1.5 rounded-lg text-xs font-heading font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{t('watchNow')}</span>
                      </button>
                    )}

                    {isPdf && (
                      <button
                        onClick={() => (onOpenPdf ? onOpenPdf(item) : handleDownload(item))}
                        className="btn-3d-yellow px-3 py-1.5 rounded-lg text-xs font-heading font-bold flex items-center gap-1 cursor-pointer"
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
                className="card-3d-white rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div 
                  onClick={() => handleDirectOpenApp(app)}
                  className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={screenImage}
                    alt={app.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {app.badge && (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-rose-500 text-white text-[10px] font-heading font-black rounded-full uppercase shadow-xs">
                      {app.badge}
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg">
                      <ExternalLink className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-heading font-bold text-rose-500 block mb-1">{app.category}</span>
                    <h3 
                      onClick={() => handleDirectOpenApp(app)}
                      className="font-heading text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug"
                    >
                      {getText(app, 'title')}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-medium">
                      {getText(app, 'description')}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleDirectOpenApp(app)}
                      className="btn-3d-green w-full py-2 rounded-xl text-xs font-heading font-black flex items-center justify-center gap-1.5 cursor-pointer"
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
      <div className="pt-6 border-t-2 border-sky-100 flex justify-center">
        <button
          onClick={onBack}
          className="btn-3d-blue px-6 py-3 rounded-full text-sm font-heading font-black flex items-center gap-2 cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span>{language === 'sd' ? 'سڀني فولڊرن ڏانهن واپس وڃو' : 'Back to All Folders'}</span>
        </button>
      </div>

    </div>
  );
};
