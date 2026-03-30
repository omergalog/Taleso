import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "Taleso | ספר ילדים מותאם אישית",
  description: "צור ספר ילדים ייחודי לחלוטין עם הגיבור האהוב של הילד שלך - מופעל על ידי AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body className="min-h-full flex flex-col font-heebo">{children}</body>
    </html>
  );
}
