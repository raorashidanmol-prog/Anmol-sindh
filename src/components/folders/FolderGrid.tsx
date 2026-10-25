import React from 'react';
import { EducationalResource, AppLink } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { FOLDERS_CONFIG, getItemsForFolder } from './folderData';
import { 
  Folder, 
  Music, 
  BookOpen, 
  Film, 
  Calculator, 
  FileCheck, 
  Gamepad2, 
  Smartphone, 
  Sparkles,
  ArrowRight,
  FolderOpen
} from 'lucide-react';

interface FolderGridProps {
  resources: EducationalResource[];
  apps: AppLink[];
  onOpenFolder: (folderId: string) => void;
}

export const FolderGrid: React.FC<FolderGridProps> = ({
  resources,
  apps,
  onOpenFolder,
}) => {
  const { language } = useLanguage();

  const getFolderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Music':
        return <Music className="w-6 h-6 text-[#00e599]" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-[#00e599]" />;
      case 'Film':
        return <Film className="w-6 h-6 text-[#00e599]" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-[#00e599]" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6 text-[#00e599]" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6 text-[#00e599]" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-[#00e599]" />;
      default:
        return <Folder className="w-6 h-6 text-[#00e599]" />;
    }
  };

  return (
    <section 
      id="learning-folders"
      aria-label="Educational Folders and Categories"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-[#00e599] font-black block">
              {language === 'sd' ? 'درسي شعبا ۽ ڪيٽيگري فولڊرز' : 'تعلیمی شعبہ جات اور فولڈرز'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sindhi">
            {language === 'sd' 
              ? 'تعليمي فولڊر ۽ ڪورس ڪيٽيگريز (Educational Folders)' 
              : language === 'ur' 
              ? 'تعلیمی فولڈرز اور مضامین' 
              : 'Educational Learning Folders'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {language === 'sd'
              ? 'هر موضوع جا جدا جدا فولڊر. ڪنهن به فولڊر تي ڪلڪ ڪري ان جون مخصوص نظمون، وڊيوز يا رانديون ڏسو.'
              : 'Organized folders for poems, videos, games, and math. Click any folder to browse its specific contents.'}
          </p>
        </div>

        <div className="text-xs text-[#00e599] bg-[#00e599]/15 border border-[#00e599]/40 px-3.5 py-1.5 rounded-full flex items-center gap-2 self-start sm:self-auto font-bold shadow-[0_0_12px_rgba(0,229,153,0.2)]">
          <FolderOpen className="w-3.5 h-3.5 text-[#00e599]" />
          <span>Click to Open Dedicated Folder</span>
        </div>
      </div>

      {/* 3D Glassy Folder Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FOLDERS_CONFIG.map((folder) => {
          const items = getItemsForFolder(folder.id, resources, apps);
          const itemCount = items.resources.length + items.apps.length;

          return (
            <div
              key={folder.id}
              onClick={() => onOpenFolder(folder.id)}
              className="glass-3d-card rounded-2xl p-6 cursor-pointer flex flex-col justify-between group transition-all relative overflow-hidden"
            >
              {/* Decorative Folder Tab at top */}
              <div className="absolute top-0 right-8 w-24 h-2 bg-[#00e599]/30 rounded-b-md group-hover:bg-[#00e599] transition-colors"></div>

              <div>
                {/* Header: Icon + Badge + Count */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#091522] border border-[#00e599]/35 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,153,0.2)] group-hover:scale-108 group-hover:border-[#00e599] transition-all">
                    {getFolderIcon(folder.icon)}
                  </div>

                  <div className="flex items-center gap-2">
                    {folder.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
                        {folder.badge}
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
                      {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>
                </div>

                {/* Folder Title */}
                <h3 className="text-lg sm:text-xl font-bold font-sindhi text-white group-hover:text-[#00e599] transition-colors leading-snug">
                  {language === 'sd' 
                    ? folder.title_sd 
                    : language === 'ur' 
                    ? folder.title_ur 
                    : folder.title_en}
                </h3>

                {/* Folder Description */}
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {language === 'sd' 
                    ? folder.description_sd 
                    : language === 'ur' 
                    ? folder.description_ur 
                    : folder.description_en}
                </p>
              </div>

              {/* Action Strip: "Open Folder" */}
              <div className="mt-5 pt-4 border-t border-[#00e599]/15 flex items-center justify-between text-xs font-bold text-[#00e599] group-hover:text-[#4ffec0]">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4" />
                  <span>
                    {language === 'sd' ? 'فولڊر کوليو' : language === 'ur' ? 'فولڈر کھولیں' : 'Open Folder'}
                  </span>
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#00e599]/15 group-hover:bg-[#00e599] group-hover:text-slate-950 flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
