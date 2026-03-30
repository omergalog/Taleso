"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg"
      >
        {/* לוגו */}
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-800">Taleso</span>
        </div>

        {/* אייקון */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-7xl mb-6"
        >
          🎉
        </motion.div>

        <h1 className="text-4xl font-black text-gray-900 mb-4">
          קיבלנו את ההזמנה שלכם!
        </h1>
        <p className="text-xl text-gray-500 mb-8 leading-relaxed">
          אנחנו כבר מתחילים ליצור את הספר המיוחד.
          <br />
          נעדכן אתכם במייל כשהספר יהיה מוכן.
        </p>

        {orderId && (
          <div className="bg-white rounded-2xl border border-orange-100 px-6 py-4 mb-8 inline-block">
            <p className="text-sm text-gray-400 mb-1">מספר הזמנה</p>
            <p className="font-black text-gray-700 text-sm">{orderId}</p>
          </div>
        )}

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 text-right">
          <p className="font-black text-gray-800 mb-1">מה קורה עכשיו?</p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>✅ קיבלנו את פרטי הסיפור שלכם</li>
            <li>✍️ הספר נכתב ומאויר בשבילכם</li>
            <li>📦 נשלח לכתובתכם תוך 7–10 ימי עסקים</li>
          </ul>
        </div>

        <Link
          href="/"
          className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
        >
          חזרה לדף הבית
        </Link>
      </motion.div>
    </main>
  );
}

export default function ThankYou() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-orange-50" />}>
      <ThankYouContent />
    </Suspense>
  );
}
