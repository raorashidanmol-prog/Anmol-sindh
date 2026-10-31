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
    <div className="w-full bg-white/95 border-y-2 border-sky-100 backdrop-blur-md sticky top-18 z-30 py-2.5 px-2 sm:px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2">
        
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:text-blue-700 hover:bg-sky-100 border border-sky-200 transition-colors shrink-0 shadow-xs cursor-pointer"
          title="Scroll Left"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Scrollable Horizontal Button Track */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {folders.map((folder) => {
            const isActive = activeFolderId === folder.id;
            const Icon = getFolderIcon(folder.icon);
            const count = itemCounts[folder.id] ?? 0;

            const folderName = folder.name_en || folder.name_sd;

            return (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(folder.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-bold whitespace-nowrap transition-all duration-200 transform shrink-0 cursor-pointer ${
                  isActive
                    ? 'btn-3d-blue scale-[1.02]'
                    : 'bg-white hover:bg-sky-50/70 text-slate-700 hover:text-blue-700 border-2 border-sky-100 border-b-4 hover:border-b-sky-300 shadow-xs'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-blue-500'
                  }`}
                />
                <span>{folderName}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-sky-100 text-sky-800'
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-heading font-bold text-blue-600 hover:text-blue-800 bg-sky-50 hover:bg-sky-100 border-2 border-dashed border-sky-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Add New Folder in Admin Panel"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ New Folder</span>
            </button>
          )}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:text-blue-700 hover:bg-sky-100 border border-sky-200 transition-colors shrink-0 shadow-xs cursor-pointer"
          title="Scroll Right"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
