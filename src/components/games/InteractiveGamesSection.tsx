import React, { useState } from 'react';
import { 
  Gamepad2, 
  Play, 
  Search, 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Maximize2, 
  ExternalLink,
  Zap,
  CheckCircle2,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { AppLink } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface InteractiveGamesSectionProps {
  games: AppLink[];
  onPlayGame: (gameId: string) => void;
  onOpenAdminAdd?: () => void;
  isAdminLoggedIn?: boolean;
}

export const InteractiveGamesSection: React.FC<InteractiveGamesSectionProps> = ({
  games,
  onPlayGame,
  onOpenAdminAdd,
  isAdminLoggedIn,
}) => {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Specific Game Categories requested:
  // - Educational Games
  // - Maths Games
  // - English Learning Games
  // - Urdu & Sindhi Learning Games
  // - Fun & Puzzle Games
  const categories = [
    { id: 'all', label: 'All Games', sindhi: 'سڀ رانديون', color: 'bg-purple-600' },
    { id: 'educational_games', label: 'Educational Games', sindhi: 'تعليمي رانديون', color: 'bg-blue-600' },
    { id: 'maths_games', label: 'Maths Games', sindhi: 'رياضي جون رانديون', color: 'bg-emerald-600' },
    { id: 'english_games', label: 'English Learning Games', sindhi: 'انگريزي سکيا رانديون', color: 'bg-amber-500' },
    { id: 'urdu_sindhi_games', label: 'Urdu & Sindhi Games', sindhi: 'سنڌي ۽ اردو رانديون', color: 'bg-cyan-600' },
    { id: 'fun_puzzle_games', label: 'Fun & Puzzle Games', sindhi: 'پزل ۽ ذهني رانديون', color: 'bg-rose-500' },
  ];

  // Helper to map game category
  const matchesCategory = (game: AppLink, catId: string): boolean => {
    if (catId === 'all') return true;
    const cat = (game.category || '').toLowerCase();
    const title = (game.title_en || game.title_sd || '').toLowerCase();
    const id = (game.id || '').toLowerCase();

    if (catId === 'educational_games') {
      return cat.includes('educational') || cat.includes('assessment') || id.includes('quiz') || title.includes('knowledge') || title.includes('science');
    }
    if (catId === 'maths_games') {
      return cat.includes('math') || id.includes('math') || title.includes('math') || title.includes('arithmetic') || title.includes('table');
    }
    if (catId === 'english_games') {
      return cat.includes('english') || id.includes('english') || title.includes('english') || title.includes('vocabulary') || title.includes('phonics');
    }
    if (catId === 'urdu_sindhi_games') {
      return cat.includes('language') || cat.includes('sindhi') || cat.includes('urdu') || id.includes('sindhi') || title.includes('سنڌي') || title.includes('اردو');
    }
    if (catId === 'fun_puzzle_games') {
      return cat.includes('puzzle') || cat.includes('fun') || cat.includes('game') || title.includes('puzzle') || title.includes('test');
    }
    return false;
  };

  const filteredGames = games.filter((game) => {
    // Category filter
    if (!matchesCategory(game, selectedCategory)) return false;
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = (game.title_en || '').toLowerCase().includes(q) || (game.title_sd || '').toLowerCase().includes(q);
      const matchDesc = (game.description_en || '').toLowerCase().includes(q) || (game.description_sd || '').toLowerCase().includes(q);
      const matchCat = (game.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  return (
    <section 
      id="interactive-online-games"
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300"
    >
      {/* ======================================================== */}
      {/* 1. SECTION HEADER BANNER                                 */}
      {/* ======================================================== */}
      <div className="card-3d-white p-6 sm:p-8 bg-gradient-to-r from-white via-purple-50 to-pink-50 border-4 border-white relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-heading font-black border border-purple-200 shadow-xs">
              <Gamepad2 className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>Interactive In-App Games • Animated Loading Screen</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight leading-tight">
              Primary Online Games Arena 🎮
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Every game opens inside the website with our signature ANMOL SINDH animated loading screen, Fullscreen mode, and safe child-friendly controls.
            </p>
          </div>

          {/* Quick Action for Admin */}
          {isAdminLoggedIn && onOpenAdminAdd && (
            <div className="shrink-0">
              <button
                onClick={onOpenAdminAdd}
                className="btn-3d-green px-5 py-3 rounded-full text-xs sm:text-sm font-heading font-black flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Game URL</span>
              </button>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-6 border-t-2 border-purple-100 flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games by name or subject (e.g., Math, Puzzles, Sindhi)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-purple-100 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
            />
          </div>

          {(search || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
              }}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 6 Requested Category Pills */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-heading font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 border-2 border-white'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              <span>{cat.label}</span>
              <span className="font-sindhi text-[11px] opacity-80">({cat.sindhi})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. GAME CARDS GRID                                       */}
      {/* ======================================================== */}
      {filteredGames.length === 0 ? (
        <div className="card-3d-white p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-heading font-black text-slate-800">
              No Games Found in this Category
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try choosing another category or search keyword. You can also paste online HTML5 game URLs in Admin to make them playable right here!
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
              }}
              className="btn-3d-blue px-6 py-2.5 rounded-full text-xs cursor-pointer"
            >
              View All Games
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => {
            const previewImage = game.first_screen_image || game.thumbnail_url || '/src/assets/images/fun_with_math_1792756361029.jpg';

            return (
              <div
                key={game.id}
                onClick={() => onPlayGame(game.id)}
                className="card-3d-white rounded-3xl overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5 transition-all cursor-pointer"
              >
                {/* Game Thumbnail with Badge */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={previewImage}
                    alt={game.title_en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/fun_with_math_1792756361029.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                  {/* Category & Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black bg-purple-600 text-white shadow-md">
                      {game.category || 'Game'}
                    </span>
                    {game.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-black bg-amber-400 text-amber-950 shadow-xs">
                        {game.badge}
                      </span>
                    )}
                  </div>

                  {/* Play Action Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-purple-950/40">
                    <div className="w-14 h-14 rounded-full bg-yellow-400 text-amber-950 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-amber-950 translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info & Button */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1 leading-snug">
                      {game.title_en}
                    </h3>

                    {game.title_sd && (
                      <p className="font-sindhi text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {game.title_sd}
                      </p>
                    )}

                    {(game.description_en || game.description_sd) && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                        {game.description_en || game.description_sd}
                      </p>
                    )}
                  </div>

                  {/* Action Button: Large Play Game */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayGame(game.id);
                      }}
                      className="btn-3d-yellow w-full py-2.5 rounded-2xl text-xs sm:text-sm font-heading font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:scale-102 transition-transform"
                    >
                      <Gamepad2 className="w-4 h-4 text-amber-950" />
                      <span>Play Game Inside Website</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
