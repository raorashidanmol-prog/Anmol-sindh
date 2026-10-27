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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#00e599]/15 border border-[#00e599]/40 text-[#00e599] text-xs font-bold rounded-full shadow-[0_0_12px_rgba(0,229,153,0.2)]">
          <ArrowDownToLine className="w-3.5 h-3.5" />
          <span>{language === 'sd' ? 'مفت تعليمي مواد ڊائون لوڊ' : 'مفت تعلیمی مواد ڈاؤن لوڈ سینٹر'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sindhi">
          {language === 'sd' ? 'ڊائون لوڊ سينٽر (Download Center)' : language === 'ur' ? 'ڈاؤن لوڈ سینٹر' : 'Download Center'}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {language === 'sd'
            ? 'ڪلاس 1 کان 5 تائين نصابي ورڪ شيٽس، ماڊل پيپرز، آڊيو نظمون ۽ تعليمي پي ڊي ايف ڪتاب بنا ڪنهن في جي آسانيءَ سان ڊائون لوڊ ڪريو.'
            : language === 'ur'
            ? 'کلاس 1 تا 5 درسی ورک شیٹس، ماڈل پیپرز، آڈیو نظمیں اور پی ڈی ایف کتب بالکل مفت ڈاؤن لوڈ کریں۔'
            : 'Download printable worksheets, curriculum books, MP3 educational poems, and exam preparation guides.'}
        </p>
      </div>

      {/* Filter and Search Bar - 3D Glassy Box */}
      <div className="glass-3d-box rounded-2xl p-4 sm:p-6 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00e599]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-[#060a12] border border-[#00e599]/30 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00e599]"
            />
          </div>

          {/* Class Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#09121f] rounded-xl border border-[#00e599]/30 shrink-0 overflow-x-auto w-full md:w-auto">
            {['all', '1', '2', '3', '4', '5'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedClass === c
                    ? 'bg-[#00e599] text-slate-950 shadow-[0_0_10px_rgba(0,229,153,0.4)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {c === 'all' ? t('allClasses') : `Class ${c}`}
              </button>
            ))}
          </div>

          {/* Format Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#09121f] rounded-xl border border-[#00e599]/30 shrink-0">
            <button
              onClick={() => setSelectedFormat('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedFormat === 'all' ? 'bg-[#00e599] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setSelectedFormat('pdf')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedFormat === 'pdf' ? 'bg-[#00e599] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              PDF Worksheets
            </button>
            <button
              onClick={() => setSelectedFormat('audio')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedFormat === 'audio' ? 'bg-[#00e599] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              MP3 Audio
            </button>
          </div>

        </div>
      </div>

      {/* Resource Download Cards Grid - 3D Glass Cards */}
      {filtered.length === 0 ? (
        <div className="glass-3d-box text-center py-16 rounded-2xl">
          <BookOpen className="w-12 h-12 text-[#00e599] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-white font-sindhi">
            {t('noResults')}
          </h3>
          <button
            onClick={() => {
              setSelectedClass('all');
              setSelectedFormat('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-[#00e599] text-slate-950 rounded-lg text-xs font-bold cursor-pointer shadow-md"
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
                className="glass-3d-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.thumbnail_url || '/src/assets/images/anmol_sindh_hero_1792756358994.jpg'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Format Indicator Icon */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/85 border border-[#00e599]/30 backdrop-blur-md rounded text-white text-[11px] font-bold flex items-center gap-1.5 uppercase">
                    {item.content_type === 'audio' && <Music className="w-3.5 h-3.5 text-[#00e599]" />}
                    {item.content_type === 'video' && <Video className="w-3.5 h-3.5 text-teal-400" />}
                    {item.content_type === 'pdf' && <FileText className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{item.file_format || item.content_type}</span>
                  </div>

                  {/* Class Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#00e599] text-slate-950 font-black rounded text-[11px] shadow-sm">
                    Class {item.class_level}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <span className="font-bold text-[#00e599]">{item.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.file_size || '3.2 MB'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{item.downloads_count} downloads</span>
                    </div>

                    <h3 className="font-sindhi text-base font-bold text-white group-hover:text-[#00e599] transition-colors line-clamp-2">
                      {getText(item, 'title')}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {getText(item, 'description')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                    {item.content_type === 'audio' && (
                      <button
                        onClick={() => onPlayAudio?.(item)}
                        className="text-xs font-bold text-[#00e599] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Music className="w-3.5 h-3.5" />
                        <span>{t('playNow')}</span>
                      </button>
                    )}
                    {item.content_type === 'video' && (
                      <button
                        onClick={() => onWatchVideo(item)}
                        className="text-xs font-bold text-[#00e599] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{t('watchNow')}</span>
                      </button>
                    )}
                    {item.content_type === 'pdf' && (
                      <button
                        onClick={() => onOpenPdf && onOpenPdf(item)}
                        className="text-xs font-bold text-[#00e599] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{language === 'sd' ? 'پڙهو (Read PDF)' : 'پڑھیں (Read)'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDownload(item)}
                      disabled={isDownloading}
                      className="px-4 py-2 bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,153,0.3)] transition-all cursor-pointer"
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
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
