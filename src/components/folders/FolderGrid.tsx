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
        return <Music className="w-6 h-6 text-rose-500" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-blue-600" />;
      case 'Film':
        return <Film className="w-6 h-6 text-purple-600" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-emerald-600" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6 text-amber-500" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6 text-pink-500" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-sky-600" />;
      default:
        return <Folder className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <section 
      id="learning-folders"
      aria-label="Educational Folders and Categories"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-blue-600 font-heading font-black block">
              {language === 'sd' ? 'درسي شعبا ۽ ڪيٽيگري فولڊرز' : 'Organized Educational Folders'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
            {language === 'sd' 
              ? 'تعليمي فولڊر ۽ ڪورس ڪيٽيگريز' 
              : language === 'ur' 
              ? 'تعلیمی فولڈرز اور مضامین' 
              : 'Educational Learning Folders'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
            {language === 'sd'
              ? 'هر موضوع جا جدا جدا فولڊر. ڪنهن به فولڊر تي ڪلڪ ڪري ان جون مخصوص نظمون، وڊيوز يا رانديون ڏسو.'
              : 'Organized folders for poems, videos, games, and math. Click any folder to browse its specific contents.'}
          </p>
        </div>

        <div className="text-xs text-blue-700 bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-full flex items-center gap-2 self-start sm:self-auto font-heading font-bold shadow-xs">
          <FolderOpen className="w-4 h-4 text-blue-600" />
          <span>Click to Open Folder</span>
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
              className="card-3d-white p-6 cursor-pointer flex flex-col justify-between group transition-all relative overflow-hidden"
            >
              {/* Decorative Folder Tab at top */}
              <div className="absolute top-0 right-8 w-20 h-2 bg-blue-300 rounded-b-md group-hover:bg-blue-500 transition-colors"></div>

              <div>
                {/* Header: Icon + Badge + Count */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-sky-50 border-2 border-sky-100 flex items-center justify-center shadow-xs group-hover:scale-108 transition-all">
                    {getFolderIcon(folder.icon)}
                  </div>

                  <div className="flex items-center gap-2">
                    {folder.badge && (
                      <span className="text-[10px] uppercase font-heading font-black tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {folder.badge}
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>
                </div>

                {/* Folder Title */}
                <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {language === 'sd' 
                    ? folder.title_sd 
                    : language === 'ur' 
                    ? folder.title_ur 
                    : folder.title_en}
                </h3>

                {/* Folder Description */}
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-medium">
                  {language === 'sd' 
                    ? folder.description_sd 
                    : language === 'ur' 
                    ? folder.description_ur 
                    : folder.description_en}
                </p>
              </div>

              {/* Action Strip: "Open Folder" */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-heading font-bold text-blue-600 group-hover:text-blue-700">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4" />
                  <span>
                    {language === 'sd' ? 'فولڊر کوليو' : language === 'ur' ? 'فولڈر کھولیں' : 'Open Folder'}
                  </span>
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs">
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
