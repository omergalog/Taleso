"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronLeft, Check, Upload, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// ───────────────────────── עזר ─────────────────────────

// מסנן קלט לעברית בלבד (אותיות, רווח, פסיק, מקף, נקודה, גרש)
const hebrewOnly = (val: string) =>
  val.replace(/[^א-תׁ-ׯ\s,.\-'"״׳]/g, "");

const hadNonHebrew = (original: string, filtered: string) => original !== filtered;

// ───────────────────────── טיפוסים ─────────────────────────

type FormData = {
  // שלב 1
  name: string;
  gender: "boy" | "girl" | "";
  age: string;
  trait: string;
  // שלב 2
  world: string;
  challenge: string;
  companions: { name: string; description: string }[];
  // שלב 3
  lesson: string;
  dedication: string;
  photo: File | null;
  companionPhotos: (File | null)[];
  // שלב 4
  email: string;
  phone: string;
};

// ───────────────────────── נתונים ─────────────────────────

const WORLDS = [
  { id: "soccer", emoji: "⚽", label: "מגרש הכדורגל" },
  { id: "kitchen", emoji: "🍪", label: "המטבח הקסום" },
  { id: "forest", emoji: "🌲", label: "היער הנסתר" },
  { id: "space", emoji: "🚀", label: "החלל" },
  { id: "farm", emoji: "🐴", label: "החווה" },
  { id: "dinos", emoji: "🦕", label: "עולם הדינוזאורים" },
  { id: "ocean", emoji: "🌊", label: "הים" },
  { id: "kingdom", emoji: "🏰", label: "הממלכה הקסומה" },
];

const AGES = ["שנה", "שנתיים", "3", "4", "5", "6", "7", "8", "9+"];

const TRAITS = [
  { id: "brave", emoji: "🦁", label: "אומץ" },
  { id: "shy", emoji: "🐢", label: "ביישנות" },
  { id: "curious", emoji: "🔍", label: "סקרנות" },
  { id: "funny", emoji: "😄", label: "הומור" },
  { id: "sensitive", emoji: "🌸", label: "רגישות" },
  { id: "naughty", emoji: "😈", label: "שובבות" },
];

const TOTAL_STEPS = 4;

// ───────────────────────── Progress Bar ─────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full mb-10">
      <div className="flex justify-between mb-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-black transition-colors duration-300 ${
              i + 1 < step
                ? "bg-orange-500 text-white"
                : i + 1 === step
                ? "bg-orange-500 text-white ring-4 ring-orange-200"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-l from-orange-500 to-orange-400 rounded-full"
          animate={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <p className="text-sm text-gray-400 mt-2 text-left">שלב {step} מתוך {TOTAL_STEPS}</p>
    </div>
  );
}

// ───────────────────────── שלב 1 – הגיבור ─────────────────────────

function Step1({ data, update, onNonHebrew }: { data: FormData; update: (d: Partial<FormData>) => void; showHint?: boolean; onNonHebrew: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-1">מי הגיבור/ה? 🌟</h2>
        <p className="text-gray-500">כמה פרטים קטנים ונתחיל לקסום</p>
      </div>

      {/* שם */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">שם הגיבור/ה *</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => {
            const filtered = hebrewOnly(e.target.value);
            if (hadNonHebrew(e.target.value, filtered)) onNonHebrew();
            update({ name: filtered });
          }}
          placeholder="למשל: עמית"
          maxLength={20}
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right text-lg bg-white"
        />
        {data.name.length > 15 && (
          <p className="text-xs text-gray-400 mt-1 text-left">{data.name.length}/20</p>
        )}
      </div>

      {/* מין */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">לשון *</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "boy", label: "ילד", emoji: "👦" },
            { id: "girl", label: "ילדה", emoji: "👧" },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => update({ gender: g.id as "boy" | "girl" })}
              className={`py-4 rounded-2xl border-2 font-bold text-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                data.gender === g.id
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-100 bg-white text-gray-700 hover:border-orange-200"
              }`}
            >
              <span>{g.emoji}</span>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* גיל */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">גיל *</label>
        <div className="grid grid-cols-5 md:grid-cols-9 gap-2">
          {AGES.map((age) => (
            <button
              key={age}
              onClick={() => update({ age })}
              className={`py-2 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer text-center ${
                data.age === age
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-100 bg-white text-gray-600 hover:border-orange-200"
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* תכונת אופי */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          איך הייתם מתארים אותו/ה? <span className="text-gray-400 font-normal">(אופציונלי)</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">בחרו תכונה אחת שהכי מתאימה</p>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {TRAITS.map((t) => (
            <button
              key={t.id}
              onClick={() => update({ trait: data.trait === t.id ? "" : t.id })}
              className={`py-3 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                data.trait === t.id
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-100 bg-white text-gray-700 hover:border-orange-200"
              }`}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div
          className={`rounded-2xl border-2 border-dashed px-5 py-3 transition-all cursor-text ${
            data.trait && !TRAITS.find((t) => t.id === data.trait)
              ? "border-orange-400 bg-orange-50"
              : "border-gray-300 bg-gray-50 hover:border-orange-300 hover:bg-orange-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">✍️</span>
            <p className="text-sm font-black text-gray-700">או כתבו תכונה משלכם</p>
          </div>
          <input
            type="text"
            placeholder="למשל: חולמנות, נדיבות, אהבת חיות..."
            value={!TRAITS.find((t) => t.id === data.trait) ? data.trait : ""}
            onFocus={() => { if (TRAITS.find((t) => t.id === data.trait)) update({ trait: "" }); }}
            onChange={(e) => { const f = hebrewOnly(e.target.value); if (hadNonHebrew(e.target.value, f)) onNonHebrew(); update({ trait: f }); }}
            maxLength={30}
            className="w-full text-right text-sm bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 font-medium"
          />
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── שלב 2 – ההרפתקה ─────────────────────────

function Step2({ data, update, onNonHebrew }: { data: FormData; update: (d: Partial<FormData>) => void; onNonHebrew: () => void }) {
  const [companionName, setCompanionName] = useState("");
  const [companionDesc, setCompanionDesc] = useState("");
  const [companionError, setCompanionError] = useState("");

  const addCompanion = () => {
    const name = companionName.trim();
    const description = companionDesc.trim();
    if (!name) return;
    const letters = (name.match(/[א-תa-zA-Z]/g) || []).length;
    const hasNumbers = /\d/.test(name);
    const hasSpecial = /[#@!$%^&*()_+=\[\]{};':"\\|,.<>\/?]/.test(name);
    if (letters < 2 || hasNumbers || hasSpecial) {
      setCompanionError("נא להזין שם תקין");
      return;
    }
    setCompanionError("");
    update({ companions: [...data.companions, { name, description }] });
    setCompanionName("");
    setCompanionDesc("");
  };

  const removeCompanion = (i: number) => {
    update({ companions: data.companions.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-1">לאן יוצאים? 🗺️</h2>
        <p className="text-gray-500">בחרו את עולם ההרפתקה</p>
      </div>

      {/* עולם */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">סביבת ההרפתקה *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {WORLDS.map((w) => (
            <button
              key={w.id}
              onClick={() => update({ world: w.id })}
              className={`py-4 px-2 rounded-2xl border-2 font-bold text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                data.world === w.id
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-100 bg-white text-gray-700 hover:border-orange-200"
              }`}
            >
              <span className="text-3xl">{w.emoji}</span>
              {w.label}
            </button>
          ))}
        </div>

        {/* בחירה עצמית */}
        <div
          className={`rounded-2xl border-2 border-dashed px-5 py-4 transition-all cursor-text ${
            !WORLDS.find((w) => w.id === data.world) && data.world
              ? "border-orange-400 bg-orange-50"
              : "border-gray-300 bg-gray-50 hover:border-orange-300 hover:bg-orange-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✍️</span>
            <p className="text-sm font-black text-gray-700">או המציאו עולם משלכם</p>
          </div>
          <input
            type="text"
            placeholder="למשל: מפעל שוקולד, ספריה קסומה, עיר מתחת לים..."
            value={!WORLDS.find((w) => w.id === data.world) ? data.world : ""}
            onFocus={() => {
              if (WORLDS.find((w) => w.id === data.world)) update({ world: "" });
            }}
            onChange={(e) => { const f = hebrewOnly(e.target.value); if (hadNonHebrew(e.target.value, f)) onNonHebrew(); update({ world: f }); }}
            maxLength={60}
            className="w-full text-right text-sm bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 font-medium"
          />
        </div>
      </div>

      {/* אתגר/בעיה */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          מה קורה לגיבור/ה בסיפור? <span className="text-gray-400 font-normal">(אופציונלי)</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">למשל: מפחד להיכנס לגן חדש, מגלה גור אבוד ביער, רב עם החבר הכי טוב שלו...</p>
        <textarea
          rows={2}
          value={data.challenge}
          onChange={(e) => { const f = hebrewOnly(e.target.value); if (hadNonHebrew(e.target.value, f)) onNonHebrew(); update({ challenge: f }); }}
          placeholder="למשל: היא מפחדת להיכנס לגן חדש ורוצה שאמא תישאר איתה..."
          maxLength={150}
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right resize-none bg-white"
        />
        {data.challenge.length > 100 && (
          <p className="text-xs text-gray-400 mt-1 text-left">{data.challenge.length}/150</p>
        )}
      </div>

      {/* מה ילמד */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          מה תרצו שהוא/היא ילמד/תלמד? <span className="text-gray-400 font-normal">(אופציונלי)</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">למשל: שחברות שווה יותר מכל צעצוע, שאפשר להתגבר על פחדים, שעזרה לאחרים מרגישה טוב...</p>
        <textarea
          rows={2}
          value={data.lesson}
          onChange={(e) => { const f = hebrewOnly(e.target.value); if (hadNonHebrew(e.target.value, f)) onNonHebrew(); update({ lesson: f }); }}
          placeholder="למשל: שגם כשמפחדים אפשר לנסות, ולרוב מגלים שזה לא מפחיד כמו שחשבנו..."
          maxLength={150}
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right resize-none bg-white"
        />
        {data.lesson.length > 100 && (
          <p className="text-xs text-gray-400 mt-1 text-left">{data.lesson.length}/150</p>
        )}
      </div>

      {/* מי מצטרף */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          מי מצטרף למסע? <span className="text-gray-400 font-normal">(אופציונלי)</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">הכלב, האח הגדול, בובת הדב – הוסיפו כמה שרוצים</p>

        {/* קוביות */}
        {data.companions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {data.companions.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-orange-50 border-2 border-orange-200 text-orange-700 font-bold text-sm px-3 py-1.5 rounded-xl"
              >
                <span>{c.name}{c.description && <span className="font-normal text-orange-500"> – {c.description}</span>}</span>
                <button
                  onClick={() => removeCompanion(i)}
                  className="text-orange-400 hover:text-red-400 transition-colors cursor-pointer mr-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* שדות הוספה */}
        {companionError && (
          <p className="text-xs text-red-500 font-bold mb-2">{companionError}</p>
        )}
        {data.companions.length >= 5 && (
          <p className="text-xs text-gray-400 mb-2">הגעתם למקסימום של 5 דמויות</p>
        )}
        <div className={`space-y-2 ${data.companions.length >= 5 ? "opacity-40 pointer-events-none" : ""}`}>
          <div className="flex gap-2">
            <input
              type="text"
              value={companionName}
              onChange={(e) => { const f = hebrewOnly(e.target.value); if (hadNonHebrew(e.target.value, f)) onNonHebrew(); setCompanionName(f); setCompanionError(""); }}
              onKeyDown={(e) => e.key === "Enter" && addCompanion()}
              placeholder="שם"
              maxLength={20}
              className={`w-24 px-4 py-3 rounded-xl border-2 focus:outline-none text-right bg-white text-sm ${companionError ? "border-red-300" : "border-gray-100 focus:border-orange-300"}`}
            />
            <input
              type="text"
              value={companionDesc}
              onChange={(e) => { const f = hebrewOnly(e.target.value); if (hadNonHebrew(e.target.value, f)) onNonHebrew(); setCompanionDesc(f); }}
              onKeyDown={(e) => e.key === "Enter" && addCompanion()}
              placeholder="תיאור, למשל: הכלב של הבית"
              maxLength={40}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right bg-white text-sm"
            />
            <button
              onClick={addCompanion}
              disabled={!companionName.trim()}
              className="px-4 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
            >
              הוסף
            </button>
          </div>
          <p className="text-xs text-gray-400 text-right">למשל: ריי | הכלב של הבית</p>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── שלב 3 – הקסם האישי ─────────────────────────

function Step3({ data, update, onNonHebrew }: { data: FormData; update: (d: Partial<FormData>) => void; onNonHebrew: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const companionFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setCompanionPhoto = (index: number, file: File | null) => {
    const updated = [...data.companionPhotos];
    updated[index] = file;
    update({ companionPhotos: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-1">הנגיעה האישית ✨</h2>
        <p className="text-gray-500">זה מה שהופך את הספר לבלתי נשכח</p>
      </div>

      {/* תמונת הגיבור */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          תמונה של {data.name || "הגיבור/ה"} <span className="text-gray-400 font-normal">(אופציונלי)</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">תמונת פנים ברורה – כך האיורים יהיו הכי דומים</p>

        {data.photo ? (
          <div className="flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl">
            <img
              src={URL.createObjectURL(data.photo)}
              alt="תמונה שנבחרה"
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div className="flex-1 text-right">
              <p className="font-bold text-gray-800 text-sm">{data.photo.name}</p>
              <p className="text-xs text-gray-400">{(data.photo.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button
              onClick={() => update({ photo: null })}
              className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full py-8 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer"
          >
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 font-bold">לחצו להעלאת תמונה</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG עד 10MB</p>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) update({ photo: file });
          }}
        />
      </div>

      {/* תמונות דמויות נוספות */}
      {data.companions.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700">
            תמונות של הדמויות <span className="text-gray-400 font-normal">(אופציונלי)</span>
          </label>
          <p className="text-xs text-gray-400">העלו תמונה לכל דמות – האיורים יהיו מדויקים יותר</p>

          {data.companions.map((companion, i) => {
            const photo = data.companionPhotos[i] ?? null;
            return (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex-1 text-right">
                  <p className="font-bold text-gray-800 text-sm">
                    {companion.name}{companion.description && ` ${companion.description}`}
                  </p>
                  {photo ? (
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setCompanionPhoto(i, null)}
                        className="text-xs text-red-400 hover:text-red-500 cursor-pointer font-bold"
                      >
                        הסר
                      </button>
                      <p className="text-xs text-gray-400">{photo.name}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">לא הועלתה תמונה</p>
                  )}
                </div>

                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={companion.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-orange-200 flex-shrink-0"
                  />
                ) : (
                  <button
                    onClick={() => companionFileRefs.current[i]?.click()}
                    className="w-14 h-14 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer text-gray-400 flex-shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}

                <input
                  ref={(el) => { companionFileRefs.current[i] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCompanionPhoto(i, file);
                    e.target.value = "";
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* הקדשה */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          הקדשה אישית <span className="text-gray-400 font-normal">(אופציונלי)</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">תודפס בעמוד הראשון של הספר ❤️</p>
        <textarea
          rows={2}
          value={data.dedication}
          onChange={(e) => { const f = hebrewOnly(e.target.value); if (hadNonHebrew(e.target.value, f)) onNonHebrew(); update({ dedication: f }); }}
          placeholder='למשל: "לענק הקטן שלנו – תמשיך לחלום גדול. אמא ואבא"'
          maxLength={200}
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right resize-none bg-white"
        />
        {data.dedication.length > 140 && (
          <p className="text-xs text-gray-400 mt-1 text-left">{data.dedication.length}/200</p>
        )}
      </div>
    </div>
  );
}

// ───────────────────────── שלב 4 – פרטי קשר ─────────────────────────

function Step4({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-1">לפני שנגמור 🙌</h2>
        <p className="text-gray-500">לאן לשלוח את אישור ההזמנה?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">אימייל *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="example@email.com"
            maxLength={100}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            טלפון / וואטסאפ *
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="05X-XXXXXXX"
            maxLength={15}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right bg-white"
          />
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-gray-600 text-right leading-relaxed">
        בשלב התשלום תתבקשו להזין כתובת למשלוח. הספר יגיע אליכם תוך{" "}
        <span className="font-bold text-orange-600">7–10 ימי עסקים</span> 📦
      </div>
    </div>
  );
}

// ───────────────────────── ולידציה ─────────────────────────

function canProceed(step: number, data: FormData): boolean {
  if (step === 1) return !!data.name.trim() && !!data.gender && !!data.age;
  if (step === 2) return !!data.world;
  if (step === 3) return true;
  if (step === 4) return !!data.email.trim() && !!data.phone.trim();
  return false;
}

// ───────────────────────── ראשי ─────────────────────────

const STORAGE_KEY = "taleso_questionnaire";

function QuestionnaireContent() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") || "";

  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({
    name: initialName,
    gender: "",
    age: "",
    trait: "",
    world: "",
    challenge: "",
    companions: [],
    lesson: "",
    dedication: "",
    photo: null,
    companionPhotos: [],
    email: "",
    phone: "",
  });
  const [loaded, setLoaded] = useState(false);
  const [hebrewHint, setHebrewHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const triggerHebrewHint = () => {
    setHebrewHint(true);
    setTimeout(() => setHebrewHint(false), 2000);
  };

  // טעינה מ-localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { step: savedStep, data: savedData } = JSON.parse(saved);
        const savedName = savedData.name || "";
        // שם שונה → איפוס מלא
        if (initialName && initialName !== savedName) {
          localStorage.removeItem(STORAGE_KEY);
          setData((prev) => ({ ...prev, name: initialName }));
        } else {
          // אותו שם או בלי שם → המשך מאותה נקודה
          setStep(savedStep || 1);
          setData((prev) => ({
            ...savedData,
            photo: null,
            companionPhotos: [],
            companions: Array.isArray(savedData.companions) ? savedData.companions.map((c: any) =>
              typeof c === "string" ? { name: c, description: "" } : c
            ) : [],
            name: initialName || savedName,
          }));
        }
      } else if (initialName) {
        setData((prev) => ({ ...prev, name: initialName }));
      }
    } catch {}
    setLoaded(true);
  }, []);

  // שמירה אוטומטית ל-localStorage
  useEffect(() => {
    if (!loaded) return;
    const { photo, companionPhotos, ...dataWithoutFiles } = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data: dataWithoutFiles }));
  }, [step, data, loaded]);

  // גלילה לראש העמוד בכל מעבר שלב
  useEffect(() => {
    if (!loaded) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [step]);

  const update = (partial: Partial<FormData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submitOrder = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const worldLabel = WORLDS.find((w) => w.id === data.world)?.label ?? data.world;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          gender: data.gender,
          age: data.age,
          trait: TRAITS.find((t) => t.id === data.trait)?.label ?? "",
          world: worldLabel,
          challenge: data.challenge,
          companions: data.companions,
          lesson: data.lesson,
          dedication: data.dedication,
          email: data.email,
          phone: data.phone,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = `/generating?orderId=${json.orderId}`;
    } catch (err: any) {
      setSubmitError("משהו השתבש, נסו שוב");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50 py-12 px-4">
      {/* Toast עברית */}
      <AnimatePresence>
        {hebrewHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl"
          >
            השאלון בעברית בלבד 🙂
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-xl mx-auto">

        {/* נאב עליון */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-sm font-bold"
          >
            <X className="w-4 h-4" />
            יציאה
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-purple-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-gray-800">Taleso</span>
          </div>
        </div>

        {/* פרוגרס */}
        <ProgressBar step={step} />

        {/* כרטיס */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100 min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && <Step1 data={data} update={update} showHint={hebrewHint} onNonHebrew={triggerHebrewHint} />}
              {step === 2 && <Step2 data={data} update={update} onNonHebrew={triggerHebrewHint} />}
              {step === 3 && <Step3 data={data} update={update} onNonHebrew={triggerHebrewHint} />}
              {step === 4 && <Step4 data={data} update={update} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* כפתורים */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={back}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              חזרה
            </button>
          )}

          {submitError && (
            <p className="text-sm text-red-500 font-bold text-center w-full">{submitError}</p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={step === TOTAL_STEPS ? submitOrder : next}
            disabled={!canProceed(step, data) || submitting}
            className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all cursor-pointer ${
              canProceed(step, data) && !submitting
                ? "bg-gradient-to-l from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {step === TOTAL_STEPS ? (submitting ? "שולח..." : "לתשלום →") : "המשך"}
          </motion.button>
        </div>

      </div>
    </main>
  );
}

export default function Questionnaire() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-orange-50" />}>
      <QuestionnaireContent />
    </Suspense>
  );
}
