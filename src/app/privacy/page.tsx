"use client";

import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-green-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">

        <Link href="/#footer" className="flex items-center gap-2 text-green-600 font-bold mb-10 hover:gap-3 transition-all">
          <ArrowRight className="w-4 h-4" />
          חזרה לדף הבית
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-800">Taleso</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🔒</span>
          <h1 className="text-4xl font-black text-gray-900">מדיניות פרטיות</h1>
        </div>
        <p className="text-gray-500 mb-8">אנו מחויבים לשמור על פרטיותכם ואבטחת המידע שלכם</p>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100 space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">1. איסוף מידע</h2>
            <p>אנו אוספים מידע שמוזן מרצון בעת מילוי השאלון: שם, אימייל, טלפון, כתובת למשלוח, ותמונות לצורך יצירת הספר. המידע משמש אך ורק לצורך מתן השירות.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">2. שימוש במידע</h2>
            <p>המידע שנאסף משמש ליצירת הספר, עיבוד התשלום, משלוח המוצר, ותקשורת שירות לקוחות. לא נמכור או נעביר את פרטיכם לצד שלישי כלשהו.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">3. תמונות</h2>
            <p>התמונות שמועלות משמשות אך ורק ליצירת האיורים בספר. הן מאוחסנות בצורה מאובטחת ואינן משותפות עם אף גורם חיצוני. ניתן לבקש מחיקתן בכל עת.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">4. אבטחת מידע</h2>
            <p>אנו משתמשים בפרוטוקולי הצפנה מתקדמים (SSL/TLS) להגנה על המידע שלכם. כל הנתונים מאוחסנים בשרתים מאובטחים.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">5. עוגיות (Cookies)</h2>
            <p>האתר משתמש בעוגיות לשיפור חוויית הגלישה ולניתוח סטטיסטי אנונימי. ניתן לבטל עוגיות דרך הגדרות הדפדפן.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">6. זכויות המשתמש</h2>
            <p>יש לכם זכות לעיין במידע שנאסף עליכם, לתקן אותו, או לבקש את מחיקתו. לפניות בנושא: privacy@taleso.co.il</p>
          </section>

          <p className="text-sm text-gray-400 pt-4 border-t border-gray-100">עדכון אחרון: מרץ 2026</p>
        </div>
      </div>
    </main>
  );
}
