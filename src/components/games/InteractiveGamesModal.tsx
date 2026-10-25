import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  Calculator, 
  FileCheck, 
  BookOpen, 
  ExternalLink, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  Printer, 
  CheckCircle2, 
  Volume2 
} from 'lucide-react';

interface InteractiveGamesModalProps {
  appId: string | null;
  onClose: () => void;
  mathUrl?: string;
  testMakerUrl?: string;
}

export const InteractiveGamesModal: React.FC<InteractiveGamesModalProps> = ({
  appId,
  onClose,
  mathUrl = 'FUN_WITH_MATH_URL',
  testMakerUrl = 'Anmol Ak _TEST_MAKER_URL',
}) => {
  const { language, t } = useLanguage();

  // Math Game State
  const [mathNum1, setMathNum1] = useState(6);
  const [mathNum2, setMathNum2] = useState(4);
  const [mathOp, setMathOp] = useState<'+' | '-' | '×'>('+');
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathScore, setMathScore] = useState(0);
  const [mathFeedback, setMathFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Test Maker State
  const [testClass, setTestClass] = useState('3');
  const [testSubject, setTestSubject] = useState('Sindhi');
  const [schoolName, setSchoolName] = useState('Government Primary School');
  const [testTitle, setTestTitle] = useState('ساليانو امتحان / First Term Assessment');
  const [paperGenerated, setPaperGenerated] = useState(false);

  // Sindhi Alphabet State
  const [selectedLetter, setSelectedLetter] = useState<{ char: string; word: string; mean: string } | null>({
    char: 'الف',
    word: 'انب',
    mean: 'Mango',
  });

  const sindhiAlphabet = [
    { char: 'الف', word: 'انب', mean: 'Mango' },
    { char: 'ب', word: 'بتخ', mean: 'Duck' },
    { char: 'ٻ', word: 'ٻلي', mean: 'Cat' },
    { char: 'ڀ', word: 'ڀولڙو', mean: 'Monkey' },
    { char: 'ت', word: 'تارو', mean: 'Star' },
    { char: 'ٿ', word: 'ٿيلھو', mean: 'Bag' },
    { char: 'ٽ', word: 'ٽوپي', mean: 'Cap / Sindhi Topi' },
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
    { char: 'ڏ', word: 'ڏيئو', mean: 'Earthen Lamp' },
    { char: 'ڊ', word: 'ڊيل', mean: 'Peahen' },
    { char: 'ڍ', word: 'ڍڳي', mean: 'Cow' },
    { char: 'ر', word: 'ريل', mean: 'Train' },
    { char: 'ڙ', word: 'پهاڙ', mean: 'Mountain' },
    { char: 'س', word: 'سج', mean: 'Sun' },
    { char: 'ش', word: 'شينهن', mean: 'Lion' },
    { char: 'ص', word: 'صابڻ', mean: 'Soap' },
    { char: 'ط', word: 'طوطو', mean: 'Parrot' },
    { char: 'ع', word: 'عينڪ', mean: 'Spectacles' },
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
    { char: 'ي', word: 'يڪتارو', mean: 'Yaktaro (Musical)' },
  ];

  if (!appId) return null;

  // Math handler
  const checkMathAnswer = () => {
    let expected = 0;
    if (mathOp === '+') expected = mathNum1 + mathNum2;
    if (mathOp === '-') expected = mathNum1 - mathNum2;
    if (mathOp === '×') expected = mathNum1 * mathNum2;

    if (parseInt(mathAnswer, 10) === expected) {
      setMathFeedback('correct');
      setMathScore((prev) => prev + 10);
      setTimeout(() => {
        // Next problem
        const n1 = Math.floor(Math.random() * 12) + 1;
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
      setMathFeedback('wrong');
    }
  };

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col my-auto border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-3">
            {appId === 'app_fun_with_math' && <Calculator className="w-6 h-6 text-amber-300" />}
            {appId === 'app_ra_test_maker' && <FileCheck className="w-6 h-6 text-teal-300" />}
            {appId === 'app_sindhi_alphabets' && <BookOpen className="w-6 h-6 text-amber-300" />}
            <h3 className="text-lg font-bold font-sindhi">
              {appId === 'app_fun_with_math' && 'فن ود ميٿ (Fun with Math) — رياضي چئلينج'}
              {appId === 'app_ra_test_maker' && 'آر اي ٽيسٽ ميڪر (RA Test Maker) — پرائمري امتحان ساز'}
              {appId === 'app_sindhi_alphabets' && 'سنڌي الف ب صوتي سکيا (Sindhi Alphabet)'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          
          {/* ============================================================ */}
          {/* 1. FUN WITH MATH INTERACTIVE GAME */}
          {/* ============================================================ */}
          {appId === 'app_fun_with_math' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
                    +−×
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">پرائمري رياضي تفريح (Math Practice)</h4>
                    <p className="text-xs text-slate-600">
                      Answer the equations quickly to earn gold stars!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-amber-300 shadow-xs">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-slate-800 tabular-nums">Score: {mathScore}</span>
                </div>
              </div>

              {/* Math Question Stage */}
              <div className="max-w-md mx-auto p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 text-center shadow-md">
                <div className="flex items-center justify-center gap-4 text-4xl sm:text-5xl font-extrabold text-slate-800 font-mono">
                  <span className="w-16 h-20 bg-white border border-slate-300 rounded-xl flex items-center justify-center shadow-xs text-emerald-700">
                    {mathNum1}
                  </span>
                  <span className="text-amber-500">{mathOp}</span>
                  <span className="w-16 h-20 bg-white border border-slate-300 rounded-xl flex items-center justify-center shadow-xs text-emerald-700">
                    {mathNum2}
                  </span>
                  <span className="text-slate-400">=</span>
                  <span className="w-16 h-20 bg-emerald-50 border-2 border-dashed border-emerald-500 rounded-xl flex items-center justify-center text-emerald-900">
                    {mathAnswer || '?'}
                  </span>
                </div>

                {/* Abacus Visual Dots */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap justify-center gap-1.5">
                  {Array.from({ length: mathNum1 }).map((_, i) => (
                    <div key={`n1_${i}`} className="w-3.5 h-3.5 rounded-full bg-emerald-500" title="Counter"></div>
                  ))}
                  <div className="w-1.5"></div>
                  {Array.from({ length: mathNum2 }).map((_, i) => (
                    <div key={`n2_${i}`} className="w-3.5 h-3.5 rounded-full bg-amber-500" title="Counter"></div>
                  ))}
                </div>

                {/* Answer Input */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <input
                    type="number"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkMathAnswer()}
                    placeholder="Enter answer"
                    className="w-36 text-center text-xl font-bold py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                  <button
                    onClick={checkMathAnswer}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Check
                  </button>
                </div>

                {/* Feedback */}
                {mathFeedback === 'correct' && (
                  <div className="mt-4 text-emerald-700 font-bold text-sm flex items-center justify-center gap-1.5 animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>شاباس! بلڪل صحيح جواب (+10 Points)</span>
                  </div>
                )}
                {mathFeedback === 'wrong' && (
                  <div className="mt-4 text-rose-600 font-semibold text-xs">
                    دوباره ڪوشش ڪريو! ڳڻپ چيڪ ڪريو.
                  </div>
                )}
              </div>

              {/* External App Link Launcher Bar */}
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Configured App Launcher: <strong className="font-mono text-slate-800">{mathUrl}</strong></span>
                </div>
                <a
                  href={mathUrl.startsWith('http') ? mathUrl : '#'}
                  target={mathUrl.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  onClick={(e) => {
                    if (!mathUrl.startsWith('http')) {
                      e.preventDefault();
                      alert(`External URL is configured as placeholder: ${mathUrl}. You can set the live URL in Admin Panel.`);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg flex items-center gap-1.5 font-medium hover:bg-slate-800 transition-colors"
                >
                  <span>Launch External App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. RA TEST MAKER TOOL */}
          {/* ============================================================ */}
          {appId === 'app_ra_test_maker' && (
            <div className="space-y-6">
              {!paperGenerated ? (
                <div className="space-y-5">
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                    <h4 className="font-bold text-teal-900 text-sm">پرائمري ٽيسٽ پيپر تيار ڪندڙ (Primary Exam Generator)</h4>
                    <p className="text-xs text-teal-800 mt-1">
                      Configure class, subject, and title to create a standardized primary assessment paper for print.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">اسڪول جو نالو (School Name)</label>
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">امتحان جو عنوان (Test Title)</label>
                      <input
                        type="text"
                        value={testTitle}
                        onChange={(e) => setTestTitle(e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">ڪلاس (Class Level)</label>
                      <select
                        value={testClass}
                        onChange={(e) => setTestClass(e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="1">Class 1 (پهريون)</option>
                        <option value="2">Class 2 (ٻيو)</option>
                        <option value="3">Class 3 (ٽيون)</option>
                        <option value="4">Class 4 (چوٿون)</option>
                        <option value="5">Class 5 (پنجون)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">مضمون (Subject)</label>
                      <select
                        value={testSubject}
                        onChange={(e) => setTestSubject(e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Sindhi">Sindhi (سنڌي لازما)</option>
                        <option value="Mathematics">Mathematics (رياضي)</option>
                        <option value="General Science">General Science (جنرل سائنس)</option>
                        <option value="English">English (انگريزي)</option>
                        <option value="Urdu">Urdu (اردو)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => setPaperGenerated(true)}
                    className="w-full py-3 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileCheck className="w-5 h-5" />
                    <span>Generate Test Paper / ٽيسٽ پيپر تيار ڪريو</span>
                  </button>

                  {/* External App Link Bar */}
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span>Configured Host: <strong className="font-mono text-slate-800">{testMakerUrl}</strong></span>
                    <a
                      href={testMakerUrl.startsWith('http') ? testMakerUrl : '#'}
                      onClick={(e) => {
                        if (!testMakerUrl.startsWith('http')) {
                          e.preventDefault();
                          alert(`Configured placeholder URL: ${testMakerUrl}`);
                        }
                      }}
                      className="px-3 py-1 bg-slate-900 text-white rounded hover:bg-slate-800 flex items-center gap-1"
                    >
                      <span>Open External Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                /* Printable Assessment View */
                <div className="space-y-4">
                  <div className="p-6 bg-white border-2 border-slate-800 rounded-lg text-slate-900 space-y-4 print:p-0">
                    <div className="text-center border-b-2 border-slate-800 pb-3">
                      <h3 className="text-lg font-bold uppercase tracking-wide">{schoolName}</h3>
                      <h4 className="font-sindhi text-base font-bold text-emerald-900">{testTitle}</h4>
                      <div className="flex justify-between text-xs font-semibold mt-2 pt-1 border-t border-slate-400">
                        <span>Class: {testClass}</span>
                        <span>Subject: {testSubject}</span>
                        <span>Total Marks: 25</span>
                        <span>Time: 45 Mins</span>
                      </div>
                      <div className="flex justify-between text-xs mt-2 text-slate-700">
                        <span>شاگرد جو نالو (Student Name): ___________________</span>
                        <span>رول نمبر (Roll No): ________</span>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4 text-sm font-sindhi" dir="rtl">
                      <div>
                        <h5 className="font-bold text-slate-900">سوال 1: صحيح جواب تي گول دائرو لڳايو (MCQs): [10 Marks]</h5>
                        <ol className="list-decimal list-inside space-y-2 mt-2 text-xs">
                          <li>سنڌ جو قومي پکي ڪهڙو آهي؟ (الف) ڪبوتر (ب) مور (ج) طوطو</li>
                          <li>رياضي ۾ 15 + 25 جو جواب ڇا ٿيندو؟ (الف) 30 (ب) 40 (ج) 50</li>
                          <li>موهن جو دڙو سنڌ جي ڪهڙي ضلعي ۾ آهي؟ (الف) لاڙڪاڻو (ب) سکر (ج) خيرپور</li>
                          <li>ٻوٽا سج جي روشنيءَ ۾ ڪهڙي گيس تيار ڪن ٿا؟ (الف) نائٽروجن (ب) آڪسيجن</li>
                        </ol>
                      </div>

                      <div className="pt-2">
                        <h5 className="font-bold text-slate-900">سوال 2: مختصر سوالن جا جواب لکو: [15 Marks]</h5>
                        <ol className="list-decimal list-inside space-y-3 mt-2 text-xs">
                          <li>پاڻيءَ جا ٽي اهم فائدا لکو. _____________________________________________</li>
                          <li>سنڌ جي ڪنهن به چار وڏن شهرن جا نالا لکو. ________________________________</li>
                          <li>صحت مند رهڻ لاءِ ڪهڙيون ڳالهيون ضروري آهن؟ _____________________________</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setPaperGenerated(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Edit Parameters</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Exam Paper</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. SINDHI ALPHABET PHONICS EXPLORER */}
          {/* ============================================================ */}
          {appId === 'app_sindhi_alphabets' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">سنڌي الف ب صوتي تختي (Sindhi 52 Alphabets)</h4>
                  <p className="text-xs text-emerald-800">
                    Tap any Sindhi letter to hear pronunciation and explore vocabulary examples!
                  </p>
                </div>

                {selectedLetter && (
                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-emerald-300 shadow-xs">
                    <span className="font-sindhi text-3xl font-bold text-emerald-700">
                      {selectedLetter.char}
                    </span>
                    <div className="text-right">
                      <div className="font-sindhi font-bold text-slate-900 text-sm">
                        {selectedLetter.char} مان {selectedLetter.word}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {selectedLetter.mean}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Alphabet Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-11 gap-2" dir="rtl">
                {sindhiAlphabet.map((item) => (
                  <button
                    key={item.char}
                    onClick={() => {
                      setSelectedLetter(item);
                      playChime();
                    }}
                    className={`h-12 rounded-xl flex items-center justify-center font-sindhi text-lg font-bold border transition-all cursor-pointer ${
                      selectedLetter?.char === item.char
                        ? 'bg-emerald-700 text-white border-emerald-800 scale-105 shadow-md'
                        : 'bg-slate-50 hover:bg-emerald-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
