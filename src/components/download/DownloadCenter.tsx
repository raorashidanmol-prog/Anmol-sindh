import React, { useState } from 'react';
import { EducationalResource } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Download, 
  FileText, 
  Music, 
  Video, 
  Search, 
  BookOpen,
  ArrowDownToLine,
  Clock
} from 'lucide-react';

interface DownloadCenterProps {
  resources: EducationalResource[];
  onPlayAudio?: (res: EducationalResource) => void;
  onWatchVideo: (res: EducationalResource) => void;
  onOpenPdf?: (res: EducationalResource) => void;
}

export const DownloadCenter: React.FC<DownloadCenterProps> = ({
  resources,
  onPlayAudio,
  onWatchVideo,
  onOpenPdf,
}) => {
  const { getText, language, t } = useLanguage();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter downloadable items
  const downloadableItems = resources.filter((r) => r.downloadable && r.published);

  const filtered = downloadableItems.filter((item) => {
    // Class filter
    if (selectedClass !== 'all' && item.class_level !== selectedClass && item.class_level !== 'all') {
      return false;
    }
    // Format filter
    if (selectedFormat !== 'all') {
      if (selectedFormat === 'pdf' && item.content_type !== 'pdf') return false;
      if (selectedFormat === 'audio' && item.content_type !== 'audio') return false;
      if (selectedFormat === 'video' && item.content_type !== 'video') return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSD = (item.title_sd || '').toLowerCase().includes(q) || (item.description_sd || '').toLowerCase().includes(q);
      const matchUR = (item.title_ur || '').toLowerCase().includes(q) || (item.description_ur || '').toLowerCase().includes(q);
      const matchEN = (item.title_en || '').toLowerCase().includes(q) || (item.description_en || '').toLowerCase().includes(q);
      const matchSubject = (item.subject || '').toLowerCase().includes(q);
      if (!matchSD && !matchUR && !matchEN && !matchSubject) return false;
    }
    return true;
  });

  const handleDownload = (item: EducationalResource) => {
    setDownloadingId(item.id);
    fetch(`/api/content/${item.id}/download`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setDownloadingId(null);
          const link = document.createElement('a');
          link.href = data.download_url || item.media_url || '#';
          link.download = data.filename || `${item.title_en || 'download'}.${(item.file_format || 'pdf').toLowerCase()}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 600);
      })
      .catch(() => {
        setDownloadingId(null);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border-2 border-blue-200 text-blue-700 text-xs font-heading font-black rounded-full shadow-xs">
          <ArrowDownToLine className="w-4 h-4 text-blue-600" />
          <span>{language === 'sd' ? 'مفت تعليمي مواد ڊائون لوڊ' : 'Free Learning Resources & Downloads'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 leading-snug">
          {language === 'sd' ? 'ڊائون لوڊ سينٽر (Download Center)' : language === 'ur' ? 'ڈاؤن لوڈ سینٹر' : 'Download Center'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
          {language === 'sd'
            ? 'ڪلاس 1 کان 5 تائين نصابي ورڪ شيٽس، ماڊل پيپرز، آڊيو نظمون ۽ تعليمي پي ڊي ايف ڪتاب بنا ڪنهن في جي آسانيءَ سان ڊائون لوڊ ڪريو.'
            : language === 'ur'
            ? 'کلاس 1 تا 5 درسی ورک شیٹس، ماڈل پیپرز، آڈیو نظمیں اور پی ڈی ایف کتب بالکل مفت ڈاؤن لوڈ کریں۔'
            : 'Download printable worksheets, curriculum books, MP3 educational poems, and exam preparation guides.'}
        </p>
      </div>

      {/* Filter and Search Bar - 3D White Box */}
      <div className="card-3d-white p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-sky-100 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
            />
          </div>

          {/* Class Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border-2 border-sky-100 shrink-0 overflow-x-auto w-full md:w-auto shadow-xs">
            {['all', '1', '2', '3', '4', '5'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-3 py-1.5 text-xs font-heading font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedClass === c
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {c === 'all' ? t('allClasses') : `Class ${c}`}
              </button>
            ))}
          </div>

          {/* Format Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border-2 border-sky-100 shrink-0 shadow-xs">
            <button
              onClick={() => setSelectedFormat('all')}
              className={`px-3 py-1.5 text-xs font-heading font-bold rounded-lg transition-all cursor-pointer ${
                selectedFormat === 'all' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setSelectedFormat('pdf')}
              className={`px-3 py-1.5 text-xs font-heading font-bold rounded-lg transition-all cursor-pointer ${
                selectedFormat === 'pdf' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              PDF Worksheets
            </button>
            <button
              onClick={() => setSelectedFormat('audio')}
              className={`px-3 py-1.5 text-xs font-heading font-bold rounded-lg transition-all cursor-pointer ${
                selectedFormat === 'audio' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              MP3 Audio
            </button>
          </div>

        </div>
      </div>

      {/* Resource Download Cards Grid - 3D White Cards */}
      {filtered.length === 0 ? (
        <div className="card-3d-white text-center py-16 rounded-3xl space-y-3">
          <BookOpen className="w-12 h-12 text-blue-400 mx-auto opacity-70" />
          <h3 className="text-base font-heading font-black text-slate-900">
            {t('noResults')}
          </h3>
          <button
            onClick={() => {
              setSelectedClass('all');
              setSelectedFormat('all');
              setSearchQuery('');
            }}
            className="btn-3d-blue px-5 py-2.5 rounded-full text-xs font-heading font-black cursor-pointer shadow-md"
          >
            {t('resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isDownloading = downloadingId === item.id;
            return (
              <div
                key={item.id}
                className="card-3d-white rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.thumbnail_url || '/src/assets/images/anmol_sindh_hero_1792756358994.jpg'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Format Indicator Icon */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full text-slate-800 text-[11px] font-heading font-bold flex items-center gap-1.5 uppercase shadow-xs">
                    {item.content_type === 'audio' && <Music className="w-3.5 h-3.5 text-rose-500" />}
                    {item.content_type === 'video' && <Video className="w-3.5 h-3.5 text-blue-600" />}
                    {item.content_type === 'pdf' && <FileText className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{item.file_format || item.content_type}</span>
                  </div>

                  {/* Class Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-blue-600 text-white font-heading font-black rounded-full text-[11px] shadow-xs">
                    Class {item.class_level}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
                      <span className="font-heading font-bold text-blue-600">{item.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.file_size || '3.2 MB'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{item.downloads_count} downloads</span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {getText(item, 'title')}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-medium">
                      {getText(item, 'description')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    {item.content_type === 'audio' && (
                      <button
                        onClick={() => onPlayAudio?.(item)}
                        className="text-xs font-heading font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Music className="w-3.5 h-3.5" />
                        <span>{t('playNow')}</span>
                      </button>
                    )}
                    {item.content_type === 'video' && (
                      <button
                        onClick={() => onWatchVideo(item)}
                        className="text-xs font-heading font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{t('watchNow')}</span>
                      </button>
                    )}
                    {item.content_type === 'pdf' && (
                      <button
                        onClick={() => onOpenPdf && onOpenPdf(item)}
                        className="text-xs font-heading font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{language === 'sd' ? 'پڙهو (Read PDF)' : 'Read PDF'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDownload(item)}
                      disabled={isDownloading}
                      className="btn-3d-green px-4 py-2 rounded-xl text-xs font-heading font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{t('download')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
