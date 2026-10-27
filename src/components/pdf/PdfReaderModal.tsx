import React, { useState, useEffect } from 'react';
import { EducationalResource } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize, 
  Download, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  Eye, 
  Lock
} from 'lucide-react';

interface PdfReaderModalProps {
  resource: EducationalResource | null;
  onClose: () => void;
  contextTitle?: string;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({
  resource,
  onClose,
  contextTitle,
}) => {
  const { getText, language, t } = useLanguage();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Browser Back Navigation and Android Mobile Back Navigation support
  useEffect(() => {
    if (!resource) return;

    window.history.pushState({ modal: 'pdf_reader', resourceId: resource.id }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [resource, onClose]);

  if (!resource) return null;

  const pdfUrl = resource.media_url || resource.download_url || '/uploads/english_vocab_class2.pdf';

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 180));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 60));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('pdf-reader-frame-container');
    if (el) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      } else {
        el.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      }
    }
  };

  const handleDownload = () => {
    if (!resource.downloadable) return;
    fetch(`/api/content/${resource.id}/download`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        const a = document.createElement('a');
        a.href = data.download_url || pdfUrl;
        a.download = data.filename || `${resource.title_en || 'document'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(() => {});
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Read-Only PDF Viewer"
      className="fixed inset-0 z-50 bg-[#04060a]/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-in fade-in duration-200 select-none"
    >
      {/* Top Header: Clear Back Button, Title, Zoom Controls, and Visible Close */}
      <header className="w-full bg-[#040810]/95 backdrop-blur-md border-b border-[#00e599]/30 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 shrink-0">
        
        {/* Left: Clear Back button */}
        <button
          onClick={onClose}
          className="px-3 sm:px-4 py-2 bg-[#091522] hover:bg-[#00e599] text-[#00e599] hover:text-slate-950 border border-[#00e599]/40 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
          title="Return to Previous Screen"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {language === 'sd' 
              ? `واپس (${contextTitle || 'ڪتاب ۽ ورڪ شيٽس'})` 
              : language === 'ur' 
              ? `واپس (${contextTitle || 'کتب اور ورک شیٹس'})` 
              : `Back to ${contextTitle || 'Books'}`}
          </span>
        </button>

        {/* Center: Title & Read-Only Badge */}
        <div className="min-w-0 text-center flex-1 hidden md:block">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00e599]/15 border border-[#00e599]/30 text-[10px] text-[#00e599] font-bold">
              <Lock className="w-3 h-3" />
              <span>{language === 'sd' ? 'محفوظ پي ڊي ايف (Read-Only)' : 'محفوظ پی ڈی ایف (صرف مطالعہ)'}</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Class {resource.class_level} · {resource.subject}
            </span>
          </div>
          <h2 className="text-white text-sm font-bold font-sindhi truncate mt-0.5">
            {getText(resource, 'title')}
          </h2>
        </div>

        {/* Right: Zoom controls, Fullscreen, and Visible Close Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="p-1.5 sm:p-2 bg-[#091522] hover:bg-[#00e599]/20 text-slate-300 hover:text-[#00e599] border border-slate-700 hover:border-[#00e599]/40 rounded-lg transition-all cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Zoom Percentage */}
          <button
            onClick={handleResetZoom}
            className="px-2 py-1 bg-[#091522] text-[#00e599] border border-[#00e599]/30 rounded-lg text-xs font-mono font-bold hover:bg-[#00e599]/10 cursor-pointer hidden sm:block"
            title="Reset Zoom to 100%"
          >
            {zoomLevel}%
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="p-1.5 sm:p-2 bg-[#091522] hover:bg-[#00e599]/20 text-slate-300 hover:text-[#00e599] border border-slate-700 hover:border-[#00e599]/40 rounded-lg transition-all cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 bg-[#091522] hover:bg-[#00e599]/20 text-slate-300 hover:text-[#00e599] border border-slate-700 hover:border-[#00e599]/40 rounded-lg transition-all cursor-pointer hidden sm:block"
            title="Full Screen View"
          >
            <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Download if allowed */}
          {resource.downloadable && (
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('download')}</span>
            </button>
          )}

          {/* Visible X Close button */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-rose-600/80 border border-slate-700 hover:border-rose-500 rounded-xl transition-all cursor-pointer ml-1"
            title="Close PDF Reader"
            aria-label="Close PDF Reader"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Notice Banner */}
      <div className="w-full bg-[#00e599]/10 border-b border-[#00e599]/20 px-4 py-1.5 text-center text-[11px] sm:text-xs text-[#00e599] flex items-center justify-center gap-2 font-medium">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>
          {language === 'sd'
            ? 'هي پي ڊي ايف درسي دستاويز پڙهڻ لاءِ محفوظ آهي (Read-Only Mode — ڪا به تبديلي يا ايڊٽ روڪيل آهي).'
            : language === 'ur'
            ? 'یہ درسی پی ڈی ایف پڑھنے کیلئے محفوظ ہے (Read-Only Mode — دستاویز میں کوئی ردوبدل نہیں کی جا سکتی)۔'
            : 'This educational document is opened in Read-Only Mode. Editing and modification are strictly restricted.'}
        </span>
      </div>

      {/* Main PDF Reader Viewport */}
      <main 
        id="pdf-reader-frame-container"
        className="flex-1 w-full max-w-6xl mx-auto p-2 sm:p-4 flex flex-col items-center justify-center overflow-auto relative"
      >
        <div 
          className="w-full h-full rounded-2xl overflow-hidden bg-slate-900/90 border border-[#00e599]/30 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(0,229,153,0.12)] flex flex-col relative transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* Read-Only Embedded PDF Frame */}
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            title={resource.title_en || 'Educational PDF Document'}
            className="w-full h-full border-0 bg-slate-950"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />

          {/* Secure watermark shield at corner */}
          <div className="absolute bottom-3 right-3 pointer-events-none px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-[#00e599]/40 text-[10px] text-[#00e599] font-mono flex items-center gap-1.5 shadow-lg">
            <Lock className="w-3 h-3" />
            <span>ANMOL SINDH · READ ONLY</span>
          </div>
        </div>
      </main>

      {/* Footer Info & Back button */}
      <footer className="w-full bg-[#040810]/95 border-t border-[#00e599]/20 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[#00e599] font-bold font-sindhi">{getText(resource, 'title')}</span>
          <span>·</span>
          <span>{resource.duration || 'Curriculum Book'}</span>
          <span>·</span>
          <span>{resource.file_size || 'PDF'}</span>
        </div>

        <button
          onClick={onClose}
          className="text-[#00e599] hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'sd' ? 'واپس وڃو ۽ بند ڪريو' : 'واپس جائیں اور بند کریں'}</span>
        </button>
      </footer>
    </div>
  );
};
