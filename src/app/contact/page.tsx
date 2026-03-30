"use client";

import { BookOpen, ArrowRight, Mail, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ContactContent() {
  const searchParams = useSearchParams();
  const backHref = searchParams.get("ref") === "top" ? "/" : "/#footer";

  return (
    <main className="min-h-screen bg-orange-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">

        <Link href={backHref} className="flex items-center gap-2 text-orange-500 font-bold mb-10 hover:gap-3 transition-all">
          <ArrowRight className="w-4 h-4" />
          חזרה לדף הבית
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-800">Taleso</span>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-4">צור קשר</h1>
        <p className="text-xl text-gray-500 mb-10">אנחנו כאן לעזור – נשמח לשמוע מכם</p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <motion.a
            href="mailto:info@taleso.co.il"
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100 cursor-pointer"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-orange-500" />
            </div>
            <p className="font-black text-gray-900 mb-1">אימייל</p>
            <p className="text-sm text-gray-500">info@taleso.co.il</p>
          </motion.a>

          <motion.a
            href="https://wa.me/972527565262"
            target="_blank"
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100 cursor-pointer"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-green-500" />
            </div>
            <p className="font-black text-gray-900 mb-1">וואטסאפ</p>
            <p className="text-sm text-gray-500">זמין א׳–ה׳ 9:00–18:00</p>
          </motion.a>

          <motion.a
            href="tel:+972527565262"
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100 cursor-pointer"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-purple-500" />
            </div>
            <p className="font-black text-gray-900 mb-1">טלפון</p>
            <p className="text-sm text-gray-500">052-756-5262</p>
          </motion.a>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100">
          <h2 className="text-2xl font-black text-gray-900 mb-6">שלחו הודעה</h2>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">שם מלא</label>
                <input
                  type="text"
                  placeholder="ישראל ישראלי"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">אימייל</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">נושא</label>
              <input
                type="text"
                placeholder="במה נוכל לעזור?"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">הודעה</label>
              <textarea
                rows={4}
                placeholder="כתבו את ההודעה שלכם כאן..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-orange-300 focus:outline-none text-right resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-l from-orange-500 to-orange-400 text-white py-4 rounded-xl font-black text-lg cursor-pointer"
            >
              שלח הודעה
            </motion.button>
          </form>
        </div>

      </div>
    </main>
  );
}

export default function Contact() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-orange-50" />}>
      <ContactContent />
    </Suspense>
  );
}
