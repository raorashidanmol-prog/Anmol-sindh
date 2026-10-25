import React from 'react';
import { AppLink } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Gamepad2, 
  ExternalLink, 
  Calculator, 
  FileCheck, 
  BookOpen, 
  Trophy,
  Play,
  Smartphone
} from 'lucide-react';

interface AppsSectionProps {
  apps: AppLink[];
  onOpenApp: (appId: string) => void;
}

export const AppsSection: React.FC<AppsSectionProps> = ({ apps, onOpenApp }) => {
  const { getText, language } = useLanguage();

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-[#00e599]" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-[#00e599]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#00e599]" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-[#00e599]" />;
    }
  };

  const handleDirectOpen = (app: AppLink) => {
    // If URL is an active external http/https link, open directly
    if (app.url && (app.url.startsWith('http://') || app.url.startsWith('https://'))) {
      window.open(app.url, '_blank');
      return;
    }

    // If it's the configured Fun with Math placeholder, launch interactive or alert
    if (app.url === 'FUN_WITH_MATH_URL' || app.id === 'app_fun_with_math') {
      onOpenApp('app_fun_with_math');
      return;
    }

    // If it's the configured RA Test Maker placeholder, launch interactive or alert
    if (app.url === 'Anmol Ak _TEST_MAKER_URL' || app.id === 'app_ra_test_maker') {
      onOpenApp('app_ra_test_maker');
      return;
    }

    // If it's internal interactive app
    if (app.is_internal || app.url.startsWith('internal:')) {
      onOpenApp(app.id);
      return;
    }

    // Fallback notice
    alert(`App link is configured as: ${app.url}. The website owner can configure live URLs in Admin Dashboard.`);
  };

  return (
    <section id="apps" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#00e599] font-black block mb-1">
            {language === 'sd' ? 'تعليمي رانديون ۽ ايپليڪيشنز' : 'تعلیمی کھیل اور ایپس'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sindhi">
            {language === 'sd' ? 'رانديون ۽ تعليمي ايپس (Apps & Games)' : language === 'ur' ? 'کھیل اور تعلیمی ایپس' : 'Games & Learning Apps'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {language === 'sd'
              ? 'هر ايپ جو الڳ 3D شيڊ باڪس ۽ پهرين اسڪرين تصوير. سڌو لنڪ کولڻ لاءِ تصوير تي ڪلڪ ڪريو.'
              : 'Separate 3D glassy box for each app with first screen image. Press on image to open link direct.'}
          </p>
        </div>

        <div className="text-xs text-[#00e599] bg-[#00e599]/15 border border-[#00e599]/40 px-3.5 py-1.5 rounded-full flex items-center gap-2 self-start sm:self-auto font-bold shadow-[0_0_12px_rgba(0,229,153,0.2)]">
          <Smartphone className="w-3.5 h-3.5 text-[#00e599]" />
          <span>Press Image to Open Link Direct</span>
        </div>
      </div>

      {/* Grid of Separate 3D Glassy App Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {apps.map((app) => {
          const screenImage = app.first_screen_image || app.thumbnail_url || '/src/assets/images/fun_with_math_1792756361029.jpg';

          return (
            <div
              key={app.id}
              className="glass-3d-card rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* ============================================================ */}
                {/* APP FIRST SCREEN IMAGE - PRESS ON IMAGE TO OPEN LINK DIRECT */}
                {/* ============================================================ */}
                <div 
                  onClick={() => handleDirectOpen(app)}
                  className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden cursor-pointer group/screen"
                  title="Press on image to open link direct"
                >
                  <img
                    src={screenImage}
                    alt={app.title_en}
                    className="w-full h-full object-cover group-hover/screen:scale-106 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-black/30 to-transparent opacity-85 group-hover/screen:opacity-95 transition-opacity"></div>

                  {/* Top Badge: Category */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#04060a]/90 border border-[#00e599]/30 backdrop-blur-md rounded-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                    {getAppIcon(app.icon)}
                    <span className="text-slate-200">{app.category}</span>
                  </div>

                  {/* Top Badge: Status / Popular */}
                  {app.badge && (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-[#00e599] text-slate-950 text-[10px] font-black rounded-md shadow-[0_0_10px_rgba(0,229,153,0.4)] uppercase">
                      {app.badge}
                    </div>
                  )}

                  {/* Direct Link Hover Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center opacity-0 group-hover/screen:opacity-100 transition-opacity bg-black/60 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-[#00e599] text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,153,0.6)] transform group-hover/screen:scale-110 transition-transform">
                      <ExternalLink className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className="text-slate-950 text-xs font-black mt-2 bg-[#00e599] px-3.5 py-1 rounded-full shadow-lg">
                      Open Direct Link
                    </span>
                  </div>

                  {/* Bottom indicator inside screen */}
                  <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[11px] text-[#00e599] pointer-events-none">
                    <span className="truncate max-w-[70%] font-mono text-[10px] text-slate-300">
                      {app.url}
                    </span>
                    <span className="text-[10px] bg-[#00e599]/20 border border-[#00e599]/40 backdrop-blur-xs px-2 py-0.5 rounded text-[#00e599] font-bold">
                      Press Image
                    </span>
                  </div>
                </div>

                {/* App Content Info */}
                <div className="p-4 space-y-2">
                  <h3 
                    onClick={() => handleDirectOpen(app)}
                    className="font-sindhi text-lg font-bold text-white group-hover:text-[#00e599] transition-colors cursor-pointer line-clamp-1"
                  >
                    {getText(app, 'title')}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {getText(app, 'description')}
                  </p>
                </div>
              </div>

              {/* Direct Open Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => handleDirectOpen(app)}
                  className="w-full py-2.5 px-3 bg-[#0a121f] hover:bg-[#00e599] text-slate-200 hover:text-slate-950 border border-[#00e599]/30 hover:border-[#00e599] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer hover:shadow-[0_0_15px_rgba(0,229,153,0.35)]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'sd' ? 'سڌو لنڪ کوليو (Open Direct)' : language === 'ur' ? 'براہ راست لنک کھولیں' : 'Open Link Direct'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#00e599] group-hover:text-slate-950" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
