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
  const { getText } = useLanguage();

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-blue-600" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-purple-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-rose-500" />;
    }
  };

  const handleDirectOpen = (app: AppLink) => {
    onOpenApp(app.id);
  };

  return (
    <section id="apps" className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-rose-500 font-heading font-black block mb-1">
            Fun Learning & Interactive Practice
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
            Educational Games & Interactive Apps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-medium">
            3D interactive cards with first-screen preview. Tap the image to launch the app inside the viewer!
          </p>
        </div>

        <div className="text-xs text-blue-700 bg-sky-100/90 border-2 border-sky-300 px-4 py-1.5 rounded-full flex items-center gap-2 self-start sm:self-auto font-heading font-bold shadow-xs">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span>Tap Image to Play In-App</span>
        </div>
      </div>

      {/* Grid of 3D Cartoon App Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {apps.map((app) => {
          const screenImage = app.first_screen_image || app.thumbnail_url || '/src/assets/images/fun_with_math_1792756361029.jpg';

          return (
            <div
              key={app.id}
              className="card-3d-white overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* App First Screen Image */}
                <div 
                  onClick={() => handleDirectOpen(app)}
                  className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden cursor-pointer group/screen"
                  title="Click to launch app in viewer"
                >
                  <img
                    src={screenImage}
                    alt={app.title_en}
                    className="w-full h-full object-cover group-hover/screen:scale-106 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Top Badge: Category */}
                  <div className="absolute top-2.5 left-2.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-slate-800 text-[11px] font-heading font-bold flex items-center gap-1.5 shadow-sm border border-sky-100">
                    {getAppIcon(app.icon)}
                    <span>{app.category}</span>
                  </div>

                  {/* Top Badge: Status / Popular */}
                  {app.badge && (
                    <div className="absolute top-2.5 right-2.5 px-3 py-1 bg-amber-400 text-amber-950 text-[10px] font-heading font-black rounded-full shadow-sm uppercase">
                      {app.badge}
                    </div>
                  )}

                  {/* Direct Link Hover Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center opacity-0 group-hover/screen:opacity-100 transition-opacity bg-blue-900/60 backdrop-blur-[2px]">
                    <div className="w-13 h-13 rounded-full bg-yellow-400 text-amber-950 flex items-center justify-center shadow-lg transform group-hover/screen:scale-110 transition-transform border-2 border-white">
                      <Gamepad2 className="w-6 h-6" />
                    </div>
                    <span className="text-white text-xs font-heading font-black mt-2 bg-blue-600 px-4 py-1 rounded-full shadow-md">
                      Play Now
                    </span>
                  </div>

                  {/* Bottom indicator inside screen */}
                  <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] text-white">
                    <span className="truncate max-w-[70%] font-mono text-[10px] text-sky-200">
                      {app.url}
                    </span>
                    <span className="text-[10px] bg-sky-500/80 backdrop-blur-xs px-2 py-0.5 rounded-full font-heading font-bold">
                      Tap Image
                    </span>
                  </div>
                </div>

                {/* App Content Info */}
                <div className="p-4 space-y-1.5">
                  <h3 
                    onClick={() => handleDirectOpen(app)}
                    className="font-heading font-black text-base text-slate-800 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {app.title_en}
                  </h3>

                  {app.title_sd && (
                    <p className="font-sindhi text-xs text-slate-500 line-clamp-1">
                      {app.title_sd}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {getText(app, 'description')}
                  </p>
                </div>
              </div>

              {/* Direct Open Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => handleDirectOpen(app)}
                  className="btn-3d-blue w-full py-2.5 px-3 rounded-full text-xs font-heading font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play In-App</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-200" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
