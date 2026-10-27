import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Mail, MapPin, Shield, GraduationCap } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateTab: (tab: string) => void;
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateTab, logoUrl }) => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#030508] text-slate-300 pt-14 pb-10 border-t border-[#00e599]/20 relative overflow-hidden">
      {/* Radiant Pierrot Green Divider */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00e599] to-transparent shadow-[0_0_15px_rgba(0,229,153,0.5)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Website Logo" 
                  className="w-10 h-10 rounded-xl object-contain bg-slate-900 border border-[#00e599]/40 shadow-[0_0_18px_rgba(0,229,153,0.35)] p-0.5"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00b875] to-[#00e599] flex items-center justify-center text-slate-950 font-black font-sindhi text-lg shadow-[0_0_18px_rgba(0,229,153,0.35)]">
                  سنڌ
                </div>
              )}
              <div>
                <h3 className="font-sindhi text-xl font-bold text-white">انمول سنڌ</h3>
                <p className="text-xs text-[#00e599] font-bold tracking-wider">ANMOL SINDH PORTAL</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'sd' 
                ? 'سنڌ جي پرائمري اسڪولن جي شاگردن (ڪلاس 1 کان 5)، استادن ۽ والدين لاءِ اعليٰ معيار جو تعليمي پورٽل. نظمون، سبق، ڪهاڻيون ۽ ورڪ شيٽس.' 
                : language === 'ur'
                ? 'سندھ کے پرائمری سکول کے طلباء (کلاس 1 تا 5)، اساتذہ اور والدین کیلئے اعلیٰ معیار کا تعلیمی پورٹل۔ نظمیں، کہانیاں اور کتب۔'
                : 'Modern, child-friendly educational portal designed for Pakistani primary school students (Classes 1–5), teachers, and parents.'}
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-2 pt-2">
              <GraduationCap className="w-4 h-4 text-[#00e599] shrink-0" />
              <span>Aligned with Sindh Primary Curriculum</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              {language === 'sd' ? 'تعليمي وسيلا' : language === 'ur' ? 'تعلیمی وسائل' : 'Learning Resources'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigateTab('library')} className="hover:text-[#00e599] transition-colors text-left cursor-pointer">
                  {t('library')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('poems')} className="hover:text-[#00e599] transition-colors text-left cursor-pointer">
                  {t('poems')} (Audio Box)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('stories')} className="hover:text-[#00e599] transition-colors text-left cursor-pointer">
                  {t('stories')} (Animated Stories Box)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('apps')} className="hover:text-[#00e599] transition-colors text-left cursor-pointer">
                  {t('gamesApps')} (Apps & Games Box)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('downloads')} className="hover:text-[#00e599] transition-colors text-left cursor-pointer">
                  {t('downloads')} (PDF Worksheets & Books)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Classes & Languages */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              {language === 'sd' ? 'پرائمري ڪلاسون' : language === 'ur' ? 'پرائمری کلاسز' : 'Primary Classes'}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-[#09121f] text-[#00e599] rounded border border-[#00e599]/30">Class 1 · پهريون</span>
              <span className="px-2.5 py-1 bg-[#09121f] text-[#00e599] rounded border border-[#00e599]/30">Class 2 · ٻيو</span>
              <span className="px-2.5 py-1 bg-[#09121f] text-[#00e599] rounded border border-[#00e599]/30">Class 3 · ٽيون</span>
              <span className="px-2.5 py-1 bg-[#09121f] text-[#00e599] rounded border border-[#00e599]/30">Class 4 · چوٿون</span>
              <span className="px-2.5 py-1 bg-[#09121f] text-[#00e599] rounded border border-[#00e599]/30">Class 5 · پنجون</span>
            </div>
            <div className="pt-3">
              <p className="text-xs text-slate-400 leading-normal">
                {language === 'sd'
                  ? 'سنڌي، اردو ۽ انگريزي ٻولين ۾ تصويرن ۽ آڊيو سان ليس مڪمل نصاب.'
                  : language === 'ur'
                  ? 'سندھی، اردو اور انگریزی زبانوں میں تصاویر اور آڈیو پر مبنی نصاب۔'
                  : 'Multilingual support in Sindhi (سنڌي), Urdu (اردو), and English.'}
              </p>
            </div>
          </div>

          {/* Column 4: Contact & Owner Portal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t('contactUs')}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00e599] shrink-0" />
                <span className="truncate">raorashid.anmol@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00e599] shrink-0" />
                <span>Hyderabad, Sindh, Pakistan</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#09121f] hover:bg-[#00e599] text-[#00e599] hover:text-slate-950 rounded-xl border border-[#00e599]/40 transition-all cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.3)]"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t('admin')} (Owner Only)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>{t('copyrightText')}</span>
            <span aria-hidden="true">·</span>
            <span>All rights reserved</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-[#00e599] cursor-pointer transition-colors">{t('privacyPolicy')}</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-[#00e599] cursor-pointer transition-colors">{t('termsOfUse')}</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-[#00e599] cursor-pointer transition-colors">{t('aboutUs')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
