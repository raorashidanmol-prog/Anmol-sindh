import React, { useRef } from 'react';
import { 
  Layers, 
  BookOpen, 
  Gamepad2, 
  Video, 
  Smartphone, 
  Sparkles, 
  Folder, 
  ChevronLeft, 
  ChevronRight, 
  Plus 
} from 'lucide-react';
import { FolderCategory } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface FolderButtonBarProps {
  folders: FolderCategory[];
  activeFolderId: string;
  onSelectFolder: (folderId: string) => void;
  itemCounts: Record<string, number>;
  onOpenAddFolder?: () => void;
}

export const FolderButtonBar: React.FC<FolderButtonBarProps> = ({
  folders,
  activeFolderId,
  onSelectFolder,
  itemCounts,
  onOpenAddFolder,
}) => {
  const { language } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 260;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const getFolderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'BookOpen':
        return BookOpen;
      case 'Gamepad2':
        return Gamepad2;
      case 'Video':
        return Video;
      case 'Smartphone':
        return Smartphone;
      case 'Sparkles':
        return Sparkles;
      case 'Layers':
        return Layers;
      default:
        return Folder;
    }
  };

  return (
    <div className="w-full bg-slate-950/80 border-y border-[#00e599]/20 backdrop-blur-md sticky top-16 z-30 py-2.5 px-2 sm:px-4 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2">
        
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="p-1.5 rounded-lg bg-slate-900/90 text-slate-300 hover:text-[#00e599] hover:bg-slate-800 border border-slate-800 transition-colors shrink-0 shadow-sm"
          title="Scroll Left"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Horizontal Button Track */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {folders.map((folder) => {
            const isActive = activeFolderId === folder.id;
            const Icon = getFolderIcon(folder.icon);
            const count = itemCounts[folder.id] ?? 0;

            const folderName =
              language === 'sd'
                ? folder.name_sd
                : language === 'ur'
                ? folder.name_ur
                : folder.name_en;

            return (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(folder.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 transform shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 via-[#00e599] to-teal-400 text-slate-950 shadow-lg shadow-[#00e599]/30 scale-[1.02]'
                    : 'bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-800/80 hover:border-[#00e599]/40'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-slate-950 stroke-[2.5]' : 'text-[#00e599]'
                  }`}
                />
                <span className="font-sindhi">{folderName}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-black/20 text-black'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Quick Create Folder Button for Admin */}
          {onOpenAddFolder && (
            <button
              onClick={onOpenAddFolder}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 border-dashed transition-colors whitespace-nowrap shrink-0"
              title="Add New Folder"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="font-sindhi">نئون فولڊر +</span>
            </button>
          )}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="p-1.5 rounded-lg bg-slate-900/90 text-slate-300 hover:text-[#00e599] hover:bg-slate-800 border border-slate-800 transition-colors shrink-0 shadow-sm"
          title="Scroll Right"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
