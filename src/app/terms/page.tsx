"use client";

import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Terms() {
  return (
    <main className="min-h-screen bg-blue-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">

        <Link href="/#footer" className="flex items-center gap-2 text-blue-500 font-bold mb-10 hover:gap-3 transition-all">
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
          <span className="text-4xl">📋</span>
          <h1 className="text-4xl font-black text-gray-900">תנאי שימוש</h1>
        </div>
        <p className="text-gray-500 mb-8">מסמך זה מגדיר את תנאי השימוש בפלטפורמת Taleso</p>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100 space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">1. כללי</h2>
            <p>ברוכים הבאים ל-Taleso. השימוש בפלטפורמה מהווה הסכמה לתנאים המפורטים להלן. אנא קראו אותם בעיון לפני ביצוע הזמנה.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">2. השירות</h2>
            <p>Taleso מספקת שירות יצירת ספרי ילדים מותאמים אישית באמצעות בינה מלאכותית. כל ספר הוא ייחודי ונוצר לפי הפרטים שהוזנו על ידי הלקוח.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">3. הזמנה ותשלום</h2>
            <p>ההזמנה מתבצעת באמצעות מילוי שאלון ותשלום מקוון. לאחר אישור התשלום, מתחיל תהליך יצירת הספר. לא ניתן לבטל הזמנה לאחר שהספר נשלח לדפוס.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">4. אחריות ומדיניות החזרות</h2>
            <p>אנו מתחייבים לאיכות גבוהה. במידה ולא תהיו מרוצים מהמוצר, ניתן לפנות אלינו תוך 14 יום מקבלת הספר לקבלת פתרון או החזר כספי מלא.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">5. קניין רוחני</h2>
            <p>הסיפורים והאיורים שנוצרו שייכים ללקוח לשימוש אישי בלבד. אין להשתמש בהם למטרות מסחריות ללא אישור מפורש מ-Taleso.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-2">6. שינויים בתנאים</h2>
            <p>Taleso שומרת לעצמה את הזכות לעדכן תנאים אלו מעת לעת. שימוש מתמשך בשירות לאחר עדכון מהווה הסכמה לתנאים החדשים.</p>
          </section>

          <p className="text-sm text-gray-400 pt-4 border-t border-gray-100">עדכון אחרון: מרץ 2026</p>
        </div>
      </div>
    </main>
  );
}
