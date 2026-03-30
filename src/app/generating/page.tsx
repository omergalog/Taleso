"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const LOADING_MESSAGES = [
  "קוראים את פרטי ההרפתקה...",
  "בוחרים את העולם המושלם...",
  "מכניסים את הדמויות לסיפור...",
  "כותבים את הפרק הראשון...",
  "מוסיפים קצת קסם...",
  "הסיפור כמעט מוכן...",
];

function StoryDisplay({ story }: { story: string }) {
  // פיצול לבתים לפי שורה ריקה
  const blocks = story.split(/\n\s*\n/).filter((b) => b.trim());

  return (
    <div className="max-w-xl mx-auto px-4 py-12" dir="rtl">
      <div className="flex items-center gap-2 justify-center mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-500 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-black text-gray-800">Taleso</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8 md:p-14"
      >
        {blocks.map((block, i) => {
          const trimmed = block.trim();

          // כותרת ראשית
          if (trimmed.startsWith("# ")) {
            return (
              <h1 key={i} className="text-3xl font-black text-gray-900 mb-10 text-center leading-relaxed">
                {trimmed.replace("# ", "")}
              </h1>
            );
          }

          // בית שירה — כל שורה בנפרד, מרווח בין בתים
          const stanzaLines = trimmed.split("\n").filter((l) => l.trim());
          return (
            <div key={i} className="mb-8 text-center">
              {stanzaLines.map((line, j) => (
                <p key={j} className="text-gray-800 text-xl leading-relaxed font-medium">
                  {line}
                </p>
              ))}
            </div>
          );
        })}
      </motion.div>

      <div className="text-center mt-10">
        <p className="text-gray-400 text-sm mb-6">הסיפור נוצר במיוחד עבורכם ✨</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-l from-orange-500 to-orange-400 text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl transition-shadow"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}

function ProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const DURATION = 180; // seconds
    const INTERVAL = 500; // ms
    const STEP = 90 / ((DURATION * 1000) / INTERVAL); // reach 90% by end

    const timer = setInterval(() => {
      setPct((prev) => {
        const next = prev + STEP;
        return next >= 90 ? 90 : next;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>מכין את הסיפור...</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-l from-orange-500 to-orange-300 rounded-full transition-all duration-500 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function GeneratingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [msgIndex, setMsgIndex] = useState(0);
  const [story, setStory] = useState<string | null>(null);
  const [error, setError] = useState(false);

  // מחזור הודעות טעינה
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // יצירת הסיפור
  useEffect(() => {
    if (!orderId) return;

    fetch("/api/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.story) setStory(data.story);
        else setError(true);
      })
      .catch(() => setError(true));
  }, [orderId]);

  if (story) {
    return <StoryDisplay story={story} />;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-2xl mb-4">משהו השתבש 😔</p>
        <Link href="/" className="text-orange-500 font-bold hover:text-orange-600">
          חזרה לדף הבית
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm"
      >
        <div className="flex items-center gap-2 justify-center mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-800">Taleso</span>
        </div>

        {/* אנימציית ספר */}
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl mb-8"
        >
          📖
        </motion.div>

        <h1 className="text-2xl font-black text-gray-900 mb-3">
          הסיפור שלכם נכתב עכשיו
        </h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-gray-500 text-lg mb-10"
          >
            {LOADING_MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>

        {/* פס טעינה */}
        <ProgressBar />
      </motion.div>
    </main>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-orange-50" />}>
      <GeneratingContent />
    </Suspense>
  );
}
