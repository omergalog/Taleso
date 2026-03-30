"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Sparkles,
  BookOpen,
  Heart,
  Star,
  ChevronDown,
  Check,
  ArrowLeft,
  Dog,
  Car,
  Gift,
  Shield,
} from "lucide-react";

// ========== קומפוננטות עזר ==========

function FloatingEmoji({ emoji, delay, x, y }: { emoji: string; delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute text-3xl select-none pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
      transition={{ duration: 3 + delay, repeat: Infinity, delay }}
    >
      {emoji}
    </motion.div>
  );
}

function SectionWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ========== סקשנים ==========

function Hero() {
  const [name, setName] = useState("");
  const [hebrewHint, setHebrewHint] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const filtered = val.replace(/[^א-תׁ-ׯ\s]/g, "");
    if (filtered !== val) {
      setHebrewHint(true);
      setTimeout(() => setHebrewHint(false), 2000);
    }
    setName(filtered);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-12">
      {/* רקע גרדיאנט */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-purple-50 to-white -z-10" />

      {/* עיגולים מעוטרים ברקע */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-30 -z-10" />

      {/* אמוג'ים צפים */}
      <FloatingEmoji emoji="⭐" delay={0} x="8%" y="20%" />
      <FloatingEmoji emoji="🌈" delay={0.5} x="88%" y="15%" />
      <FloatingEmoji emoji="✨" delay={1} x="5%" y="65%" />
      <FloatingEmoji emoji="🦋" delay={1.5} x="90%" y="60%" />
      <FloatingEmoji emoji="🌟" delay={0.8} x="15%" y="80%" />
      <FloatingEmoji emoji="🎨" delay={1.2} x="80%" y="75%" />

      {/* נאב */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between w-full max-w-5xl mb-10"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-800">Taleso</span>
        </div>
        <a
          href="/contact?ref=top"
          className="bg-white border-2 border-orange-200 text-orange-500 font-bold px-5 py-2 rounded-xl hover:bg-orange-50 transition-colors text-sm"
        >
          צור קשר
        </a>
      </motion.div>

      {/* כותרת ראשית */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          <span className="text-gray-900">הסיפור</span>
          <br />
          <span className="gradient-text">שרק הילד שלך</span>
          <br />
          <span className="text-gray-900">מככב בו</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
          ספר ילדים מותאם אישית לחלוטין עם עלילה ייחודית, איורים מרהיבים,
          <br className="hidden md:block" />
          והגיבור האהוב של הילד שלך – מגיע הביתה מודפס ✨
        </p>

        {/* שדה שם + CTA */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="text"
            placeholder="מה שם הגיבור? 👦🏻"
            value={name}
            onChange={handleNameChange}
            className="flex-1 px-5 py-4 rounded-2xl border-2 border-orange-200 text-right text-lg focus:outline-none focus:border-orange-400 bg-white shadow-sm"
          />
          <motion.a
            href={`/questionnaire${name.trim() ? `?name=${encodeURIComponent(name.trim())}` : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-l from-orange-500 to-orange-400 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-orange-200 flex items-center gap-2 justify-center whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            צור את הספר
          </motion.a>
        </div>

        <div className="h-5 mt-2">
          {hebrewHint && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-orange-500 font-bold"
            >
              השאלון בעברית בלבד 🙂
            </motion.p>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-1">אין צורך בהרשמה • 5 דקות בלבד</p>
      </motion.div>

      {/* 6 ספרים */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-16 w-full max-w-5xl"
      >
        <div className="flex gap-4 justify-center items-center">
          {[
            { src: "/book-tractor.png", title: "היום של מתן", delay: 0 },
            { src: "/book-lego.png", title: "יואב הבנאי", delay: 0.1 },
            { src: "/book-dolls.png", title: "מאיה והחברה הטובה", delay: 0.2 },
            { src: "/book-soccer.png", title: "רון השוער", delay: 0.3 },
            { src: "/book-horse.png", title: "נועה והסוס הלבן", delay: 0.4 },
            { src: "/book-cooking.png", title: "תמר אופה עוגה", delay: 0.5 },
          ].map((book, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + book.delay }}
              transition={{ duration: 0.6, delay: 0.3 + book.delay }}
              className="relative flex-shrink-0 w-36 h-48 md:w-44 md:h-60 rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:-translate-y-3 hover:scale-105 transition-transform duration-100"
            >
              <img src={book.src} alt={book.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white font-black text-xs text-center">{book.title}</p>
              </div>
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-xs font-black text-gray-700 px-1.5 py-0.5 rounded-full">
                Taleso
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* חץ למטה */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8"
      >
        <ChevronDown className="w-8 h-8 text-gray-400" />
      </motion.div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: "📝", title: "ממלאים שאלון קצר", desc: "שם, תמונה, תחביבים, ועוד – תוך 5 דקות" },
    { icon: "🤖", title: "ה-AI יוצר הכל", desc: "סיפור ייחודי לחלוטין + איורים מותאמים לדמויות" },
    { icon: "📦", title: "מגיע הביתה", desc: "ספר מודפס באיכות גבוהה עד הדלת תוך 7-10 ימים" },
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionWrapper className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">איך זה עובד?</h2>
          <p className="text-xl text-gray-500">פשוט, מהיר, וקסום</p>
        </SectionWrapper>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <SectionWrapper key={i}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-gradient-to-b from-orange-50 to-white border-2 border-orange-100 rounded-3xl p-8 text-center relative"
              >
                <div className="absolute -top-4 right-6 w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center font-black text-sm">
                  {i + 1}
                </div>
                <div className="text-6xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}

function BooksGallery() {
  const books = [
    {
      image: "/book-tractor.png",
      title: "מתן והטרקטור הקסום",
      hero: "מתן, בן 5",
      tag: "הרפתקאות",
      tagColor: "bg-orange-200 text-orange-700",
    },
    {
      image: "/book-lego.png",
      title: "יואב ומגדל הלגו",
      hero: "יואב, בן 6",
      tag: "יצירתיות",
      tagColor: "bg-blue-200 text-blue-700",
    },
    {
      image: "/book-dolls.png",
      title: "מאיה ומסיבת התה",
      hero: "מאיה, בת 4",
      tag: "חברות",
      tagColor: "bg-pink-200 text-pink-700",
    },
    {
      image: "/book-soccer.png",
      title: "רון והשער המדהים",
      hero: "רון, בן 7",
      tag: "אומץ",
      tagColor: "bg-green-200 text-green-700",
    },
    {
      image: "/book-horse.png",
      title: "נועה והסוס הלבן",
      hero: "נועה, בת 5",
      tag: "אהבה",
      tagColor: "bg-yellow-200 text-yellow-700",
    },
    {
      image: "/book-cooking.png",
      title: "תמר ועוגיות הקסם",
      hero: "תמר, בת 6",
      tag: "קסם",
      tagColor: "bg-purple-200 text-purple-700",
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-orange-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionWrapper className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">ספרים שנוצרו</h2>
          <p className="text-xl text-gray-500">כל ספר – עולם אחר. כל סיפור – ייחודי לחלוטין.</p>
        </SectionWrapper>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book, i) => (
            <SectionWrapper key={i}>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="cursor-default">
                <div className="w-full aspect-[3/4] rounded-2xl shadow-xl overflow-hidden mb-3 relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {/* שכבת טקסט בתחתית */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-black text-sm leading-snug">{book.title}</p>
                  </div>
                  {/* לוגו */}
                  <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-xs font-black text-gray-700 px-2 py-1 rounded-full">
                    Taleso
                  </div>
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm text-gray-500">{book.hero}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${book.tagColor}`}>{book.tag}</span>
                </div>
              </motion.div>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const points = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "עלילה ייחודית בכל פעם",
      desc: "לא תבנית עם שמות מוחלפים – סיפור שנכתב מאפס רק בשביל הילד שלך",
      color: "from-orange-400 to-orange-500",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "כמה גיבורים שרוצים",
      desc: "ניר, הכלב שלו, והטרקטור האהוב? כולם יופיעו בסיפור ובאיורים",
      color: "from-pink-400 to-rose-500",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "ערך מוסרי שבוחרים",
      desc: "חברות, אומץ, שיתוף – הסיפור מעביר את המסר שחשוב לך",
      color: "from-purple-400 to-purple-500",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "איורים מותאמים לדמויות",
      desc: "הכלב שלך, הצעצוע האהוב – מצוירים בדיוק כמו שהם",
      color: "from-blue-400 to-blue-500",
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-5xl mx-auto">
        <SectionWrapper className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">למה Taleso שונה?</h2>
          <p className="text-xl text-gray-500">
            כל שאר האתרים מחליפים שמות בתבנית קבועה.
            <br />
            אצלנו – <strong>כל ספר הוא עולם חדש.</strong>
          </p>
        </SectionWrapper>

        <div className="grid md:grid-cols-2 gap-6">
          {points.map((point, i) => (
            <SectionWrapper key={i}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${point.color} flex items-center justify-center text-white flex-shrink-0`}>
                  {point.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">{point.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{point.desc}</p>
                </div>
              </motion.div>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}

function Characters() {
  const chars = [
    { icon: <div className="text-4xl">👦</div>, label: "ילד / ילדה" },
    { icon: <Dog className="w-10 h-10 text-amber-600" />, label: "כלב / חתול" },
    { icon: <Car className="w-10 h-10 text-blue-500" />, label: "מכונית / טרקטור" },
    { icon: <div className="text-4xl">🧸</div>, label: "צעצוע אהוב" },
    { icon: <div className="text-4xl">🦁</div>, label: "חיה אהובה" },
    { icon: <div className="text-4xl">✨</div>, label: "כל דמות שתבחרו" },
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionWrapper className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">מי יכול להיות הגיבור?</h2>
          <p className="text-xl text-gray-500">כל דמות שהילד אוהב – אפשרי</p>
        </SectionWrapper>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {chars.map((char, i) => (
            <SectionWrapper key={i}>
              <motion.div
                whileHover={{ y: -6, scale: 1.03 }}
                className="bg-gradient-to-b from-orange-50 to-white border-2 border-orange-100 rounded-3xl p-6 text-center cursor-default"
              >
                <div className="flex justify-center mb-3">{char.icon}</div>
                <p className="font-bold text-gray-700">{char.label}</p>
              </motion.div>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    {
      name: "מיכל כהן",
      role: "אמא לנועם בן 5",
      text: "נועם לא הפסיק לבקש שנקרא את הספר שוב ושוב. הוא לא האמין שהוא הגיבור האמיתי!",
      stars: 5,
      emoji: "👩",
    },
    {
      name: "סבתא רות",
      role: "סבתא לאיתי בן 6",
      text: "קניתי כמתנה ליום הולדת. כולם בחגיגה ביקשו לדעת איפה קניתי. המתנה הכי מיוחדת שנתתי.",
      stars: 5,
      emoji: "👵",
    },
    {
      name: "דני לוי",
      role: "אבא לתאיר בת 4",
      text: "תאיר ישנה עם הספר. הסיפור היה כל כך מותאם אליה – עם הכלבה שלה וצבע הנעליים האהוב.",
      stars: 5,
      emoji: "👨",
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-5xl mx-auto">
        <SectionWrapper className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">מה ההורים אומרים</h2>
          <div className="flex items-center justify-center gap-2 text-orange-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
            <span className="text-gray-600 text-lg mr-2">4.9 מתוך 5</span>
          </div>
        </SectionWrapper>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <SectionWrapper key={i}>
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-orange-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 text-right">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{review.emoji}</div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-400">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "דיגיטלי",
      price: "39",
      originalPrice: "69",
      desc: "PDF באיכות גבוהה, מיידי לאימייל",
      features: ["סיפור ייחודי מלא", "איורים מותאמים", "PDF להדפסה עצמית", "מיידי"],
      color: "border-gray-200",
      btnColor: "bg-gray-800 hover:bg-gray-700",
      badge: null,
    },
    {
      name: "ספר מודפס",
      price: "159",
      originalPrice: "219",
      desc: "ספר אמיתי עד הדלת",
      features: ["סיפור ייחודי מלא", "איורים מותאמים", "כריכה רכה איכותית", "משלוח עד הבית", "הקדשה אישית"],
      color: "border-orange-400",
      btnColor: "bg-gradient-to-l from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500",
      badge: "הכי פופולרי",
    },
    {
      name: "פרמיום",
      price: "189",
      originalPrice: "259",
      desc: "כריכה קשה, מהדורה מיוחדת",
      features: ["סיפור ייחודי מלא", "איורים מותאמים", "כריכה קשה יוקרתית", "משלוח עד הבית", "הקדשה אישית", "עמודים נוספים"],
      color: "border-purple-400",
      btnColor: "bg-gradient-to-l from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500",
      badge: "מהדורה מיוחדת",
    },
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionWrapper className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">בחרו את החבילה המתאימה</h2>
          <p className="text-xl text-gray-500">כולל משלוח חינם לכל הארץ</p>
        </SectionWrapper>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <SectionWrapper key={i}>
              <motion.div
                whileHover={{ y: -8 }}
                className={`relative bg-white border-2 ${plan.color} rounded-3xl p-8 flex flex-col`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-sm font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-xl font-black text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-gray-400 line-through text-xl ml-2">₪{plan.originalPrice}</span>
                  <div className="text-4xl font-black text-gray-900">₪{plan.price}</div>
                  <span className="inline-block mt-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                    מבצע השקה 🔥
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-right">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`${plan.btnColor} text-white py-4 rounded-2xl font-bold text-lg transition-all cursor-pointer`}
                >
                  בחר חבילה זו
                </motion.button>
              </motion.div>
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-3xl mx-auto">
        <SectionWrapper>
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-purple-100 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">אחריות מלאה – ללא שאלות</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              לא מרוצים מהספר? נחזיר לכם את הכסף במלואו.
              <br />
              אנחנו בטוחים שזו תהיה המתנה שהכי יאהבו.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-gray-500 text-sm">
              <span>✓ תשלום מאובטח</span>
              <span>✓ פרטיות מלאה</span>
              <span>✓ תמיכה בעברית</span>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <FloatingEmoji emoji="⭐" delay={0} x="5%" y="20%" />
      <FloatingEmoji emoji="✨" delay={0.7} x="90%" y="30%" />
      <FloatingEmoji emoji="🌟" delay={1.4} x="10%" y="75%" />
      <FloatingEmoji emoji="💫" delay={0.3} x="85%" y="70%" />

      <div className="max-w-3xl mx-auto text-center relative">
        <SectionWrapper>
          <div className="text-6xl mb-6">📚</div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            הסיפור של הילד שלך
            <br />
            מחכה להיכתב
          </h2>
          <p className="text-xl text-white/90 mb-10">הצטרפו לאלפי הורים שכבר הפתיעו את ילדיהם</p>
          <motion.a
            href="/questionnaire"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white text-orange-500 px-12 py-5 rounded-2xl text-xl font-black shadow-2xl inline-flex items-center gap-3 mx-auto cursor-pointer"
          >
            <Gift className="w-6 h-6" />
            צור את הספר עכשיו
            <ArrowLeft className="w-5 h-5" />
          </motion.a>
          <p className="text-white/70 mt-4 text-sm">5 דקות בלבד • משלוח עד 10 ימים</p>
        </SectionWrapper>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 text-gray-400 py-10 px-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-purple-500 rounded-lg flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-black text-lg">Taleso</span>
      </div>
      <p className="text-sm">© 2026 Taleso. כל הזכויות שמורות.</p>
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <a href="/terms" className="hover:text-white transition-colors">תנאי שימוש</a>
        <a href="/privacy" className="hover:text-white transition-colors">פרטיות</a>
        <a href="/contact" className="hover:text-white transition-colors">צור קשר</a>
      </div>
    </footer>
  );
}

// ========== דף ראשי ==========

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <WhyUs />
      <Characters />
      <Testimonials />
      <Pricing />
      <Guarantee />
      <FinalCTA />
      <Footer />
    </main>
  );
}
