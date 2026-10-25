import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Music, 
  Calculator, 
  FileCheck, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onSelectClass: (lvl: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenApp: (appId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onSelectClass,
  onNavigateTab,
  onOpenApp,
}) => {
  const { t, language } = useLanguage();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      onNavigateTab('library');
    }
  };

  const classes = [
    { id: '1', labelSd: 'ڪلاس 1', labelUr: 'کلاس 1', labelEn: 'Class 1', desc: 'نرسري ۽ بنيادي قاعدو' },
    { id: '2', labelSd: 'ڪلاس 2', labelUr: 'کلاس 2', labelEn: 'Class 2', desc: 'ٻالڪ نظمون ۽ ڳڻپ' },
    { id: '3', labelSd: 'ڪلاس 3', labelUr: 'کلاس 3', labelEn: 'Class 3', desc: 'رياضي ۽ گرامر' },
    { id: '4', labelSd: 'ڪلاس 4', labelUr: 'کلاس 4', labelEn: 'Class 4', desc: 'سائنس ۽ سنڌي ادب' },
    { id: '5', labelSd: 'ڪلاس 5', labelUr: 'کلاس 5', labelEn: 'Class 5', desc: 'ماڊل پيپرز ۽ تاريخ' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#03060b] via-[#060c16] to-[#04060a] text-white pt-8 pb-16 lg:pt-14 lg:pb-22 border-b border-[#00e599]/15">
      {/* Subtle Pierrot Green Ambient Dots */}
      <div className="absolute inset-0 opacity-12 bg-[radial-gradient(#00e599_1.2px,transparent_1.2px)] [background-size:26px_26px] pointer-events-none"></div>
      
      {/* Ambient background glow nebulae */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Split: Content & Hero Artwork */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column (Text & Search) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00e599]/12 border border-[#00e599]/35 text-[#00e599] text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(0,229,153,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#4ffec0] animate-pulse" />
              <span>{t('tagline')}</span>
            </div>

            {/* Main Brand Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sindhi leading-tight">
                انمول سنڌ <span className="text-[#00e599] font-sans text-3xl sm:text-4xl lg:text-5xl font-black drop-shadow-[0_0_20px_rgba(0,229,153,0.35)]">| ANMOL SINDH</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
                {t('subTagline')}
              </p>
            </div>

            {/* Search Bar - 3D Glassy Shade */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0">
              <div className="relative flex items-center bg-[#0d1522]/80 backdrop-blur-xl border border-[#00e599]/30 rounded-2xl p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-[#00e599]/60 hover:shadow-[0_16px_36px_rgba(0,0,0,0.9),0_0_24px_rgba(0,229,153,0.2)] transition-all">
                <Search className="w-5 h-5 text-[#00e599] ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 font-black text-xs rounded-xl shadow-[0_0_15px_rgba(0,229,153,0.4)] transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  {language === 'sd' ? 'ڳوليو' : language === 'ur' ? 'تلاش' : 'Search'}
                </button>
              </div>
            </form>

            {/* Quick App Shortcut Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => onOpenApp('app_fun_with_math')}
                className="px-4 py-2 bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 text-xs font-black rounded-xl flex items-center gap-2 shadow-[0_0_16px_rgba(0,229,153,0.35)] transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-slate-950" />
                <span>Fun with Math</span>
              </button>

              <button
                onClick={() => onOpenApp('app_ra_test_maker')}
                className="px-4 py-2 bg-[#091522] hover:bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/50 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-[#00e599]" />
                <span>RA Test Maker</span>
              </button>

              <button
                onClick={() => onNavigateTab('poems')}
                className="px-4 py-2 bg-[#0e1726]/80 hover:bg-[#00e599]/15 text-slate-200 hover:text-white border border-[#00e599]/25 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Music className="w-4 h-4 text-[#00e599]" />
                <span>{t('poems')}</span>
              </button>

              <button
                onClick={() => onNavigateTab('downloads')}
                className="px-4 py-2 bg-[#0e1726]/80 hover:bg-[#00e599]/15 text-slate-200 hover:text-white border border-[#00e599]/25 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#00e599]" />
                <span>{t('downloads')}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Hero Artwork */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(0,229,153,0.18)] border-2 border-[#00e599]/35 group">
              <img
                src="/src/assets/images/anmol_sindh_hero_1792756358994.jpg"
                alt="Pakistani Primary School Students Learning with Anmol Sindh"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-black/30 to-transparent flex items-end p-6">
                <div>
                  <span className="text-[#00e599] text-xs font-black uppercase tracking-wider block drop-shadow-md">
                    {language === 'sd' ? 'سنڌ ٽيڪسٽ بڪ بورڊ نصاب مطابق' : 'مطابق نصاب سندھ ٹیکسٹ بک بورڈ'}
                  </span>
                  <p className="font-sindhi text-white text-sm font-semibold mt-1">
                    سنڌي، اردو ۽ انگريزي ۾ بنيادي تعليمي ويڊيوز، آڊيو نظمون ۽ ورڪ شيٽس
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Primary Class Quick-Select Strip - 3D Glass Cards */}
        <div className="mt-12 pt-8 border-t border-[#00e599]/15">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-wider text-[#00e599] font-bold flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#00e599]" />
              <span>{language === 'sd' ? 'ڪلاس چونڊيو (Classes 1–5)' : 'کلاس منتخب کریں (Classes 1–5)'}</span>
            </h3>
            <button
              onClick={() => {
                onSelectClass('all');
                onNavigateTab('library');
              }}
              className="text-xs text-[#00e599] hover:text-[#4ffec0] flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>{t('allClasses')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectClass(c.id);
                  onNavigateTab('library');
                }}
                className="glass-3d-card p-3.5 rounded-xl text-left cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white group-hover:text-[#00e599] transition-colors">
                    {language === 'sd' ? c.labelSd : language === 'ur' ? c.labelUr : c.labelEn}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 font-mono font-bold">
                    Grade {c.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1.5 truncate font-sindhi">
                  {c.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
