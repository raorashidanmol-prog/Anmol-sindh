import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Music, 
  Film, 
  Video, 
  BookOpen, 
  Baby, 
  Languages, 
  Sparkles, 
  Feather, 
  FileText, 
  Gamepad2, 
  FileCheck2 
} from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (catId: string) => void;
  resourceCounts: { [cat: string]: number };
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
  resourceCounts,
}) => {
  const { language } = useLanguage();

  const categories = [
    {
      id: 'audio_poems',
      titleSd: 'آڊيو نظم',
      titleUr: 'آڈیو نظمیں',
      titleEn: 'Audio Poems',
      descSd: 'ٻارن لاءِ سرور ۽ سريلا اخلاقي ترانا',
      descUr: 'بچوں کیلئے خوبصورت اور سبق آموز نظمیں',
      descEn: 'Melodious nursery poems & children songs',
      icon: Music,
      gradient: 'from-emerald-600 to-teal-500',
      tag: 'MP3 Audio',
    },
    {
      id: 'animated_stories',
      titleSd: 'اينيميٽڊ ڪهاڻيون',
      titleUr: 'اینیمیٹڈ کہانیاں',
      titleEn: 'Animated Stories',
      descSd: 'سنڌي ۽ اردو ۾ تصويري ۽ اخلاقي لوڪ ڪهاڻيون',
      descUr: 'اخلاقی اور سبق آموز اینیمیٹڈ لوک کہانیاں',
      descEn: 'Vibrant animated cultural folk tales',
      icon: Film,
      gradient: 'from-purple-600 to-indigo-600',
      tag: 'MP4 Video',
    },
    {
      id: 'educational_videos',
      titleSd: 'تعليمي وڊيوز',
      titleUr: 'تعلیمی ویڈیوز',
      titleEn: 'Educational Videos',
      descSd: 'رياضي، سائنس ۽ عام معلومات جون وڊيوز',
      descUr: 'ریاضی، سائنس اور عمومی معلومات کی ویڈیوز',
      descEn: 'Concept explainers for math & science',
      icon: Video,
      gradient: 'from-teal-600 to-cyan-600',
      tag: 'Lessons',
    },
    {
      id: 'lessons_explanations',
      titleSd: 'سبق ۽ وضاحتون',
      titleUr: 'سبق اور وضاحتیں',
      titleEn: 'Lessons & Explanations',
      descSd: 'پرائمري درسي ڪتابن جي باب وار سمجهاڻي',
      descUr: 'پرائمری درسی کتب کی باب وار تشریح',
      descEn: 'Chapter summaries and guided solutions',
      icon: BookOpen,
      gradient: 'from-amber-600 to-orange-500',
      tag: 'Curriculum',
    },
    {
      id: 'rhymes_nursery',
      titleSd: 'نرسري نغما ۽ ترانا',
      titleUr: 'نرسری نظمیں اور ترانے',
      titleEn: 'Rhymes & Nursery Learning',
      descSd: 'ڪلاس 1 ۽ 2 لاءِ رنگين الف ب ترانا',
      descUr: 'کلاس 1 اور 2 کیلئے رنگین ترانے اور کھیل',
      descEn: 'Early childhood phonetic tunes',
      icon: Baby,
      gradient: 'from-pink-600 to-rose-500',
      tag: 'Class 1-2',
    },
    {
      id: 'english_vocabulary',
      titleSd: 'انگريزي لغت ۽ تلفظ',
      titleUr: 'انگریزی الفاظ اور تلفظ',
      titleEn: 'English Vocab & Phonics',
      descSd: 'صحيح تلفظ ۽ تصويرن سان نوان لفظ',
      descUr: 'درست تلفظ اور تصویری الفاظ کا ذخیرہ',
      descEn: 'Spelling, phonics, and sight words',
      icon: Languages,
      gradient: 'from-blue-600 to-sky-500',
      tag: 'Phonics',
    },
    {
      id: 'sindhi_learning',
      titleSd: 'سنڌي ٻولي سکيا',
      titleUr: 'سندھی زبان کی تعلیم',
      titleEn: 'Sindhi Language Learning',
      descSd: 'سنڌي 52 اکر، شاهه جو رسالو ۽ وياڪرڻ',
      descUr: 'سندھی حروف تہجی، شاہ لطیف اور گرامر',
      descEn: 'Master Sindhi script, phonics & prose',
      icon: Sparkles,
      gradient: 'from-emerald-700 to-green-600',
      tag: 'Core Heritage',
    },
    {
      id: 'urdu_learning',
      titleSd: 'اردو ٻولي سکيا',
      titleUr: 'اردو زبان کی تعلیم',
      titleEn: 'Urdu Language Learning',
      descSd: 'اردو حروف، گرامر، اسم ۽ جملابندي',
      descUr: 'اردو حروف تہجی، قواعد و انشاء اور املا',
      descEn: 'Grammar, vocabulary & creative writing',
      icon: Feather,
      gradient: 'from-indigo-600 to-violet-600',
      tag: 'Language',
    },
    {
      id: 'worksheets_pdf',
      titleSd: 'ورڪ شيٽس ۽ پي ڊي ايف ڪتاب',
      titleUr: 'ورک شیٹس اور پی ڈی ایف کتب',
      titleEn: 'Worksheets & PDF Books',
      descSd: 'پرنٽ لائق عملي مشقون ۽ درسي ڪتاب',
      descUr: 'پرنٹ کے قابل مشقی پیپرز اور درسی کتب',
      descEn: 'Printable practice papers & textbooks',
      icon: FileText,
      gradient: 'from-slate-700 to-slate-900',
      tag: 'Printable',
    },
    {
      id: 'educational_games',
      titleSd: 'تعليمي رانديون',
      titleUr: 'تعلیمی کھیل',
      titleEn: 'Educational Games',
      descSd: 'رياضي پزل، لفظن جا رانديون ۽ ڳولا',
      descUr: 'ریاضی پزل، الفاظ کے کھیل اور ذہنی آزمائش',
      descEn: 'Interactive thinking & puzzle games',
      icon: Gamepad2,
      gradient: 'from-amber-500 to-yellow-600',
      tag: 'Interactive',
    },
    {
      id: 'tests_quizzes',
      titleSd: 'ٽيسٽ ۽ سوال ناما',
      titleUr: 'ٹیسٹ اور کوئز',
      titleEn: 'Tests & Quizzes',
      descSd: 'سالياني امتحانن لاءِ ماڊل پيپرز ۽ آنلائن سوال',
      descUr: 'سالانہ امتحانات کیلئے ماڈل پیپرز اور کوئز',
      descEn: 'Standard assessment & self-evaluations',
      icon: FileCheck2,
      gradient: 'from-teal-700 to-emerald-700',
      tag: 'Evaluation',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
          {language === 'sd' ? 'تعليمي درجا بندي' : 'تعلیمی زمرہ جات'}
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 font-sindhi">
          {language === 'sd' ? 'سڀ سکيا جون ڪيٽيگريز' : language === 'ur' ? 'تمام سیکھنے کے زمرہ جات' : 'Educational Categories'}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {language === 'sd'
            ? 'پنهنجي مرضيءَ واري موضوع تي ڪلڪ ڪري سبق ۽ وسيلا چيڪ ڪريو.'
            : 'Select any category to browse tailored learning resources for primary grades.'}
        </p>
      </div>

      {/* Grid of 11 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = resourceCounts[cat.id] || 0;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="glass-card rounded-2xl p-5 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {/* Clean unboxed tag */}
                  <span className="text-[11px] font-bold text-slate-400 font-mono">
                    {cat.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-sindhi group-hover:text-emerald-700 transition-colors">
                  {language === 'sd' ? cat.titleSd : language === 'ur' ? cat.titleUr : cat.titleEn}
                </h3>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {language === 'sd' ? cat.descSd : language === 'ur' ? cat.descUr : cat.descEn}
                </p>
              </div>

              {/* Card Footer with clean metadata */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">
                  {count > 0 ? `${count} Resources` : 'Available'}
                </span>
                <span className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all">
                  Browse →
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
