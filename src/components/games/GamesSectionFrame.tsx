import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Calculator, 
  FileCheck, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Printer, 
  Gamepad2, 
  Star, 
  Check
} from 'lucide-react';

interface GamesSectionFrameProps {
  initialGameId?: string;
  onOpenExternalModal?: (gameId: string) => void;
}

export const GamesSectionFrame: React.FC<GamesSectionFrameProps> = ({
  initialGameId = 'math',
  onOpenExternalModal,
}) => {
  const { language } = useLanguage();
  const [activeGame, setActiveGame] = useState<'math' | 'test_maker' | 'sindhi_alphabets' | 'science_quiz'>(
    initialGameId.includes('math') ? 'math' :
    initialGameId.includes('test') ? 'test_maker' :
    initialGameId.includes('alphabet') ? 'sindhi_alphabets' :
    initialGameId.includes('quiz') ? 'science_quiz' : 'math'
  );

  const [soundEnabled, setSoundEnabled] = useState(true);

  // ==========================================
  // GAME 1: FUN WITH MATH STATE & LOGIC
  // ==========================================
  const [mathNum1, setMathNum1] = useState(7);
  const [mathNum2, setMathNum2] = useState(5);
  const [mathOp, setMathOp] = useState<'+' | '-' | '×'>('+');
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathScore, setMathScore] = useState(0);
  const [mathFeedback, setMathFeedback] = useState<'correct' | 'wrong' | null>(null);

  const playSoundEffect = (type: 'correct' | 'wrong' | 'click' | 'star') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'click') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch {}
  };

  const handleCheckMath = () => {
    let expected = 0;
    if (mathOp === '+') expected = mathNum1 + mathNum2;
    if (mathOp === '-') expected = mathNum1 - mathNum2;
    if (mathOp === '×') expected = mathNum1 * mathNum2;

    if (parseInt(mathAnswer, 10) === expected) {
      playSoundEffect('correct');
      setMathFeedback('correct');
      setMathScore((s) => s + 10);
      setTimeout(() => {
        const n1 = Math.floor(Math.random() * 12) + 2;
        const n2 = Math.floor(Math.random() * 9) + 1;
        const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        setMathNum1(op === '-' ? Math.max(n1, n2) : n1);
        setMathNum2(op === '-' ? Math.min(n1, n2) : n2);
        setMathOp(op);
        setMathAnswer('');
        setMathFeedback(null);
      }, 1000);
    } else {
      playSoundEffect('wrong');
      setMathFeedback('wrong');
    }
  };

  // ==========================================
  // GAME 2: RA TEST MAKER & ASSESSMENT
  // ==========================================
  const [testClass, setTestClass] = useState('3');
  const [testSubject, setTestSubject] = useState('Sindhi');
  const [testPaperGenerated, setTestPaperGenerated] = useState(false);
  const [activeQuizQuestion, setActiveQuizQuestion] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [testMakerScore, setTestMakerScore] = useState(0);

  const sampleQuestions = [
    {
      q_sd: 'سنڌوءَ جي عظيم تهذيب موهن جو دڙو ڪهڙي ضلعي ۾ آهي؟',
      q_ur: 'سندھ کی عظیم تہذیب موہن جو دڑو کس ضلع میں ہے؟',
      q_en: 'In which district of Sindh is Mohenjo-Daro situated?',
      options: ['لاڙڪاڻو (Larkana)', 'حيدرآباد (Hyderabad)', 'سکر (Sukkur)', 'ڪراچي (Karachi)'],
      correct: 0,
    },
    {
      q_sd: 'ٻوٽا سج جي روشني ۽ هوا مان ڪهڙي گيس حاصل ڪري خوراڪ تيار ڪن ٿا؟',
      q_ur: 'پودے سورج کی روشنی میں خوراک تیار کرنے کیلئے کونسی گیس جذب کرتے ہیں؟',
      q_en: 'Which gas do plants absorb from air to make food during photosynthesis?',
      options: ['آڪسيجن (Oxygen)', 'ڪاربان ڊاءِ آڪسائيڊ (Carbon Dioxide)', 'نائيٽروجن (Nitrogen)', 'هائيڊروجن (Hydrogen)'],
      correct: 1,
    },
    {
      q_sd: 'شاهه عبداللطيف ڀٽائي رح جو درگاهه ڪهڙي شهر ۾ آهي؟',
      q_ur: 'شاہ عبداللطیف بھٹائی رح کا مزار کس شہر میں واقع ہے؟',
      q_en: 'Where is the shrine of Shah Abdul Latif Bhittai located?',
      options: ['ڀٽ شاهه (Bhit Shah)', 'سيوهڻ (Sehwan)', 'ٺٽو (Thatta)', 'مٽياري (Matiari)'],
      correct: 0,
    },
    {
      q_sd: 'رياضي ۾ 9 × 8 جو صحيح جواب ڪهڙو آهي؟',
      q_ur: 'ریاضی میں 9 × 8 کا درست جواب کیا ہے؟',
      q_en: 'What is the correct answer of 9 × 8 in Mathematics?',
      options: ['64', '72', '81', '70'],
      correct: 1,
    },
  ];

  // ==========================================
  // GAME 3: SINDHI ALPHABET PHONICS STATE
  // ==========================================
  const [selectedLetter, setSelectedLetter] = useState<{ char: string; word: string; mean: string }>({
    char: 'الف',
    word: 'انب',
    mean: 'Mango',
  });

  const sindhiLetters = [
    { char: 'الف', word: 'انب', mean: 'Mango' },
    { char: 'ب', word: 'بتخ', mean: 'Duck' },
    { char: 'ٻ', word: 'ٻلي', mean: 'Cat' },
    { char: 'ڀ', word: 'ڀولڙو', mean: 'Monkey' },
    { char: 'ت', word: 'تارو', mean: 'Star' },
    { char: 'ٿ', word: 'ٿيلھو', mean: 'Bag' },
    { char: 'ٽ', word: 'ٽوپي', mean: 'Cap' },
    { char: 'ٺ', word: 'ٺوٺ', mean: 'Elbow' },
    { char: 'ث', word: 'ثمر', mean: 'Fruit' },
    { char: 'پ', word: 'پکو', mean: 'Fan' },
    { char: 'ج', word: 'جهنڊو', mean: 'Flag' },
    { char: 'ڄ', word: 'ڄامڻ', mean: 'Blackberry' },
    { char: 'ڃ', word: 'ڃاڻ', mean: 'Knowledge' },
    { char: 'چ', word: 'چمچو', mean: 'Spoon' },
    { char: 'ڇ', word: 'ڇٽي', mean: 'Umbrella' },
    { char: 'ح', word: 'حجام', mean: 'Barber' },
    { char: 'خ', word: 'خرگوش', mean: 'Rabbit' },
    { char: 'د', word: 'دروازو', mean: 'Door' },
    { char: 'ڌ', word: 'ڌرتي', mean: 'Earth' },
    { char: 'ڏ', word: 'ڏيئو', mean: 'Lamp' },
    { char: 'ڊ', word: 'ڊيل', mean: 'Peahen' },
    { char: 'ڍ', word: 'ڍڳي', mean: 'Cow' },
    { char: 'ر', word: 'ريل', mean: 'Train' },
    { char: 'ڙ', word: 'پهاڙ', mean: 'Mountain' },
    { char: 'س', word: 'سج', mean: 'Sun' },
    { char: 'ش', word: 'شينهن', mean: 'Lion' },
    { char: 'ص', word: 'صابڻ', mean: 'Soap' },
    { char: 'ط', word: 'طوطو', mean: 'Parrot' },
    { char: 'ع', word: 'عينڪ', mean: 'Glasses' },
    { char: 'ف', word: 'فوارو', mean: 'Fountain' },
    { char: 'ڦ', word: 'ڦوڪڻو', mean: 'Balloon' },
    { char: 'ق', word: 'قلم', mean: 'Pen' },
    { char: 'ڪ', word: 'ڪتاب', mean: 'Book' },
    { char: 'ک', word: 'کير', mean: 'Milk' },
    { char: 'گ', word: 'گلاب', mean: 'Rose' },
    { char: 'ڳ', word: 'ڳئون', mean: 'Cow' },
    { char: 'ڱ', word: 'سڱ', mean: 'Horn' },
    { char: 'ل', word: 'ليمن', mean: 'Lemon' },
    { char: 'م', word: 'مڇي', mean: 'Fish' },
    { char: 'ن', word: 'نڪ', mean: 'Nose' },
    { char: 'ڻ', word: 'واڻ', mean: 'Rope' },
    { char: 'و', word: 'وڻ', mean: 'Tree' },
    { char: 'هـ', word: 'هٿ', mean: 'Hand' },
    { char: 'ي', word: 'يڪتارو', mean: 'Yaktaro' },
  ];

  // ==========================================
  // GAME 4: SCIENCE STAR QUIZ STATE
  // ==========================================
  const [scienceQIndex, setScienceQIndex] = useState(0);
  const [scienceSelectedAns, setScienceSelectedAns] = useState<number | null>(null);
  const [scienceScore, setScienceScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const scienceQuestions = [
    {
      q: 'اسان جي ڌرتي سج جي چوڌاري پنهنجو ڦيرو ڪيتري وقت ۾ مڪمل ڪري ٿي؟',
      opts: ['365 ڏينهن (هڪ سال)', '30 ڏينهن (هڪ مهينو)', '24 ڪلاڪ (هڪ ڏينهن)', '12 ڪلاڪ'],
      ans: 0,
    },
    {
      q: 'انسان کي زنده رهڻ لاءِ ساهه کڻڻ دوران ڪهڙي گيس جي ضرورت هوندي آهي؟',
      opts: ['ڪاربان ڊاءِ آڪسائيڊ', 'آڪسيجن (Oxygen)', 'نائيٽروجن', 'مٿين مان ڪا به نه'],
      ans: 1,
    },
    {
      q: 'پاڻي ڪيتري درجي گرمي پد (Celsius) تي ٽهڪڻ لڳندو آهي؟',
      opts: ['50°C', '80°C', '100°C', '150°C'],
      ans: 2,
    },
  ];

  return (
    <section 
      aria-label="Educational Games Frame"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-6"
    >
      {/* 3D Glassy Frame Container */}
      <div className="relative rounded-3xl bg-[#040812]/95 border-2 border-[#00e599]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(0,229,153,0.18)] backdrop-blur-2xl overflow-hidden p-4 sm:p-7">
        
        {/* Frame Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#00e599]/25">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00e599] text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(0,229,153,0.6)]">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#00e599]/20 border border-[#00e599]/40 text-[11px] text-[#00e599] font-bold">
                  {language === 'sd' ? 'سڌو سنئون هتي کيڏو' : 'وہیں کھیلیں — نو ری ڈائریکٹ'}
                </span>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D Glassy Interactive Game Hub</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sindhi tracking-wide mt-1">
                {language === 'sd' 
                  ? 'پرائمري تعليمي راندين جو فريم (Playable Games Frame)'
                  : language === 'ur'
                  ? 'پرائمری تعلیمی کھیل فریم (Play Games Here)'
                  : 'Interactive Primary Educational Games Frame'}
              </h2>
            </div>
          </div>

          {/* Sound & Reset Action Controls */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl bg-[#091522] border border-[#00e599]/30 text-slate-300 hover:text-[#00e599] transition-all cursor-pointer shadow-sm"
              title={soundEnabled ? 'Mute Game Sound' : 'Enable Game Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00e599]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={() => {
                playSoundEffect('click');
                setMathScore(0);
                setTestMakerScore(0);
                setScienceScore(0);
                setQuizFinished(false);
                setScienceQIndex(0);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#091522] hover:bg-[#00e599]/20 border border-[#00e599]/30 text-slate-300 hover:text-[#00e599] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Reset All Scores"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'sd' ? 'ٻيهر شروع' : 'ری سیٹ'}</span>
            </button>
          </div>
        </div>

        {/* Game Navigation Switcher Tabs inside the Frame */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 my-5">
          
          {/* Tab 1: Math */}
          <button
            onClick={() => {
              setActiveGame('math');
              playSoundEffect('click');
            }}
            className={`p-3 rounded-2xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              activeGame === 'math'
                ? 'bg-gradient-to-r from-[#00e599]/25 to-[#00b875]/15 border-[#00e599] text-white shadow-[0_0_20px_rgba(0,229,153,0.25)]'
                : 'bg-[#091522]/80 hover:bg-[#091522] border-slate-800 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">فن ود ميٿ (Math)</div>
              <div className="text-[10px] text-slate-400 truncate">ڳڻپ، جوڙ ۽ ٽيبل</div>
            </div>
          </button>

          {/* Tab 2: RA Test Maker */}
          <button
            onClick={() => {
              setActiveGame('test_maker');
              playSoundEffect('click');
            }}
            className={`p-3 rounded-2xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              activeGame === 'test_maker'
                ? 'bg-gradient-to-r from-[#00e599]/25 to-[#00b875]/15 border-[#00e599] text-white shadow-[0_0_20px_rgba(0,229,153,0.25)]'
                : 'bg-[#091522]/80 hover:bg-[#091522] border-slate-800 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">آر اي ٽيسٽ ميڪر</div>
              <div className="text-[10px] text-slate-400 truncate">امتحان ۽ سوال ناما</div>
            </div>
          </button>

          {/* Tab 3: Sindhi Alphabet */}
          <button
            onClick={() => {
              setActiveGame('sindhi_alphabets');
              playSoundEffect('click');
            }}
            className={`p-3 rounded-2xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              activeGame === 'sindhi_alphabets'
                ? 'bg-gradient-to-r from-[#00e599]/25 to-[#00b875]/15 border-[#00e599] text-white shadow-[0_0_20px_rgba(0,229,153,0.25)]'
                : 'bg-[#091522]/80 hover:bg-[#091522] border-slate-800 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">سنڌي الف ب صوتيات</div>
              <div className="text-[10px] text-slate-400 truncate">52 اکر، تلفظ ۽ معنيٰ</div>
            </div>
          </button>

          {/* Tab 4: Science Star Quiz */}
          <button
            onClick={() => {
              setActiveGame('science_quiz');
              playSoundEffect('click');
            }}
            className={`p-3 rounded-2xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              activeGame === 'science_quiz'
                ? 'bg-gradient-to-r from-[#00e599]/25 to-[#00b875]/15 border-[#00e599] text-white shadow-[0_0_20px_rgba(0,229,153,0.25)]'
                : 'bg-[#091522]/80 hover:bg-[#091522] border-slate-800 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[#00e599] flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">سائنس اسٽار کوئز</div>
              <div className="text-[10px] text-slate-400 truncate">ڪلاس 1 کان 5 جاچ</div>
            </div>
          </button>
        </div>

        {/* Live Playable Stage Inside Frame */}
        <div className="min-h-[420px] rounded-2xl bg-black/60 border border-[#00e599]/25 p-4 sm:p-7 relative">
          
          {/* ============================================================ */}
          {/* GAME 1: FUN WITH MATH */}
          {/* ============================================================ */}
          {activeGame === 'math' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#091522] border border-[#00e599]/30 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                    +−×
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm font-sindhi">فن ود ميٿ (Fun with Math)</h3>
                    <p className="text-xs text-slate-400">Answer equations quickly to earn primary gold stars!</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#040810] border border-amber-400/40 rounded-xl">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-amber-300 tabular-nums">Score: {mathScore}</span>
                </div>
              </div>

              {/* Equation Box */}
              <div className="bg-gradient-to-b from-[#091522] to-[#040810] border border-[#00e599]/30 rounded-3xl p-6 sm:p-8 text-center shadow-xl space-y-6">
                <div className="flex items-center justify-center gap-3 sm:gap-6 text-4xl sm:text-6xl font-extrabold font-mono text-white">
                  <span className="w-16 sm:w-24 h-20 sm:h-28 bg-[#0b1b2d] border border-[#00e599]/50 rounded-2xl flex items-center justify-center text-[#00e599] shadow-md">
                    {mathNum1}
                  </span>
                  <span className="text-amber-400">{mathOp}</span>
                  <span className="w-16 sm:w-24 h-20 sm:h-28 bg-[#0b1b2d] border border-[#00e599]/50 rounded-2xl flex items-center justify-center text-[#00e599] shadow-md">
                    {mathNum2}
                  </span>
                  <span className="text-slate-500">=</span>
                  <span className="w-16 sm:w-24 h-20 sm:h-28 bg-[#00e599]/15 border-2 border-dashed border-[#00e599] rounded-2xl flex items-center justify-center text-white">
                    {mathAnswer || '?'}
                  </span>
                </div>

                {/* Abacus Visual Dots */}
                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  {Array.from({ length: mathNum1 }).map((_, i) => (
                    <div key={`n1_${i}`} className="w-3.5 h-3.5 rounded-full bg-[#00e599] shadow-[0_0_8px_#00e599]" title="Abacus Counter"></div>
                  ))}
                  <div className="w-2"></div>
                  {Array.from({ length: mathNum2 }).map((_, i) => (
                    <div key={`n2_${i}`} className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" title="Abacus Counter"></div>
                  ))}
                </div>

                {/* Answer Input */}
                <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
                  <input
                    type="number"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckMath()}
                    placeholder="جواب لکو"
                    className="w-36 text-center text-2xl font-bold py-2.5 px-3 bg-[#0b1b2d] border-2 border-[#00e599]/40 rounded-xl text-white focus:outline-none focus:border-[#00e599]"
                    autoFocus
                  />
                  <button
                    onClick={handleCheckMath}
                    className="px-6 py-3 bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 font-bold rounded-xl transition-all shadow-md cursor-pointer text-sm"
                  >
                    Check
                  </button>
                </div>

                {/* Feedback status */}
                {mathFeedback === 'correct' && (
                  <div className="text-[#00e599] font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>شاباس! بلڪل صحيح جواب (+10 Points)</span>
                  </div>
                )}
                {mathFeedback === 'wrong' && (
                  <div className="text-rose-400 font-semibold text-xs flex items-center justify-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>دوباره ڪوشش ڪريو! ڳڻپ چيڪ ڪريو.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* GAME 2: RA TEST MAKER & ASSESSMENT */}
          {/* ============================================================ */}
          {activeGame === 'test_maker' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#091522] border border-[#00e599]/30 rounded-2xl p-4">
                <div>
                  <h3 className="font-bold text-white text-sm font-sindhi">آر اي ٽيسٽ ميڪر (RA Test Maker)</h3>
                  <p className="text-xs text-slate-400">Class 1 to 5 interactive assessment generator and practice challenge</p>
                </div>
                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-bold">
                  MCQs Practice Test
                </span>
              </div>

              {/* Interactive Test Question Box */}
              <div className="bg-[#091522] border border-[#00e599]/30 rounded-2xl p-5 sm:p-7 space-y-5">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span>سوال {activeQuizQuestion + 1} مان {sampleQuestions.length}</span>
                  <span className="text-[#00e599] font-bold">ڪلاس {testClass} · {testSubject}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white font-sindhi leading-relaxed" dir="rtl">
                    {sampleQuestions[activeQuizQuestion].q_sd}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {sampleQuestions[activeQuizQuestion].q_en}
                  </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {sampleQuestions[activeQuizQuestion].options.map((opt, i) => {
                    const isSelected = quizSelectedOption === i;
                    const isCorrect = i === sampleQuestions[activeQuizQuestion].correct;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setQuizSelectedOption(i);
                          if (isCorrect) {
                            playSoundEffect('correct');
                            setTestMakerScore((s) => s + 25);
                          } else {
                            playSoundEffect('wrong');
                          }
                        }}
                        className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          quizSelectedOption !== null
                            ? isCorrect
                              ? 'bg-emerald-950/80 border-[#00e599] text-[#00e599]'
                              : isSelected
                              ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                              : 'bg-[#0b1b2d] border-slate-800 text-slate-400'
                            : 'bg-[#0b1b2d] hover:bg-[#0e243d] border-slate-700 text-slate-200'
                        }`}
                      >
                        <span>{opt}</span>
                        {quizSelectedOption !== null && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-[#00e599] shrink-0" />
                        )}
                        {quizSelectedOption !== null && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Next Question Control */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-xs text-amber-300 font-bold">اسڪور: {testMakerScore}</span>
                  <button
                    disabled={quizSelectedOption === null}
                    onClick={() => {
                      setQuizSelectedOption(null);
                      if (activeQuizQuestion < sampleQuestions.length - 1) {
                        setActiveQuizQuestion((prev) => prev + 1);
                      } else {
                        setActiveQuizQuestion(0);
                      }
                    }}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      quizSelectedOption !== null
                        ? 'bg-[#00e599] text-slate-950 cursor-pointer shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {activeQuizQuestion < sampleQuestions.length - 1 ? 'اڳيون سوال (Next)' : 'ٻيهر شروع (Restart)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* GAME 3: SINDHI ALPHABET PHONICS EXPLORER */}
          {/* ============================================================ */}
          {activeGame === 'sindhi_alphabets' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Visual Card */}
                <div className="md:col-span-1 bg-[#091522] border-2 border-[#00e599]/40 rounded-3xl p-6 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
                  <div className="w-28 h-28 rounded-2xl bg-[#00e599]/15 border-2 border-[#00e599] flex items-center justify-center text-6xl font-bold font-sindhi text-[#00e599] shadow-[0_0_30px_rgba(0,229,153,0.3)]">
                    {selectedLetter.char}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-sindhi">
                      {selectedLetter.char} مان {selectedLetter.word}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium">Meaning: {selectedLetter.mean}</p>
                  </div>
                  <button
                    onClick={() => playSoundEffect('correct')}
                    className="w-full py-2.5 bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>آواز ٻڌو (Listen Sound)</span>
                  </button>
                </div>

                {/* 52 Letters Grid */}
                <div className="md:col-span-2 bg-[#091522]/90 border border-[#00e599]/30 rounded-3xl p-4 sm:p-5">
                  <div className="text-xs text-slate-400 mb-3 font-semibold flex items-center justify-between">
                    <span>اکر تي ڪلڪ ڪريو (Tap any letter):</span>
                    <span className="text-[#00e599] font-bold">52 سنڌي اکر</span>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-9 gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {sindhiLetters.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedLetter(item);
                          playSoundEffect('click');
                        }}
                        className={`h-11 rounded-xl text-lg font-bold font-sindhi border transition-all cursor-pointer flex items-center justify-center ${
                          selectedLetter.char === item.char
                            ? 'bg-[#00e599] text-slate-950 border-[#00e599] shadow-md scale-105'
                            : 'bg-[#0b1b2d] hover:bg-[#00e599]/20 text-slate-200 border-slate-700 hover:border-[#00e599]/40'
                        }`}
                      >
                        {item.char}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* GAME 4: SCIENCE STAR QUIZ */}
          {/* ============================================================ */}
          {activeGame === 'science_quiz' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
              <div className="bg-[#091522] border border-[#00e599]/30 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="text-[#00e599] font-bold">سائنس اسٽار چئلينج</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold tabular-nums">اسٽارز: {scienceScore}</span>
                  </div>
                </div>

                {!quizFinished ? (
                  <>
                    <h3 className="text-lg font-bold text-white font-sindhi leading-relaxed text-right" dir="rtl">
                      {scienceQuestions[scienceQIndex].q}
                    </h3>

                    <div className="space-y-2.5 pt-2">
                      {scienceQuestions[scienceQIndex].opts.map((opt, i) => {
                        const isCorrect = i === scienceQuestions[scienceQIndex].ans;
                        const isSelected = scienceSelectedAns === i;
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setScienceSelectedAns(i);
                              if (isCorrect) {
                                playSoundEffect('correct');
                                setScienceScore((s) => s + 1);
                              } else {
                                playSoundEffect('wrong');
                              }
                            }}
                            className={`w-full p-3.5 rounded-xl border text-right text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                              scienceSelectedAns !== null
                                ? isCorrect
                                  ? 'bg-emerald-950 border-[#00e599] text-[#00e599]'
                                  : isSelected
                                  ? 'bg-rose-950 border-rose-500 text-rose-300'
                                  : 'bg-[#0b1b2d] border-slate-800 text-slate-400'
                                : 'bg-[#0b1b2d] hover:bg-[#00e599]/15 border-slate-700 text-slate-200'
                            }`}
                            dir="rtl"
                          >
                            <span>{opt}</span>
                            {scienceSelectedAns !== null && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-[#00e599] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        disabled={scienceSelectedAns === null}
                        onClick={() => {
                          setScienceSelectedAns(null);
                          if (scienceQIndex < scienceQuestions.length - 1) {
                            setScienceQIndex((prev) => prev + 1);
                          } else {
                            setQuizFinished(true);
                          }
                        }}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                          scienceSelectedAns !== null
                            ? 'bg-[#00e599] text-slate-950 cursor-pointer shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {scienceQIndex < scienceQuestions.length - 1 ? 'اڳيون سوال' : 'نتيجا ڏسو'}
                      </button>
                    </div>
                  </>
                ) : (
                  /* Quiz Completed Screen */
                  <div className="text-center py-8 space-y-4">
                    <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
                    <h3 className="text-xl font-bold text-white font-sindhi">
                      شاباس! اوهان کوئز مڪمل ڪري ورتو
                    </h3>
                    <p className="text-sm text-[#00e599] font-bold">
                      حاصل ڪيل اسٽارز: {scienceScore} / {scienceQuestions.length}
                    </p>
                    <button
                      onClick={() => {
                        setQuizFinished(false);
                        setScienceQIndex(0);
                        setScienceScore(0);
                        setScienceSelectedAns(null);
                      }}
                      className="px-6 py-2.5 bg-[#00e599] text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
                    >
                      دوباره کيڏو (Play Again)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
