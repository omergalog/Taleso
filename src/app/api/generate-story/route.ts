import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ─── סקיל: כתיבת ספר ילדים מותאם אישית ──────────────────────────────────────
// זהו הסקיל המלא שגמיני וקלוד עובדים לפיו בכל שלב

const SKILL = `
## 1. הבנת הדמות לפני הכתיבה
לפני שכותבים מילה אחת, הגדר לעצמך:
- מה הגיבור רוצה בסיפור הזה?
- מה הוא אוהב? מה מפחיד או מדאיג אותו?
- האם הוא אמיץ או חסר ביטחון?
- מה ייחודי בו לעומת ילדים אחרים?
- איך הוא מדבר?

## 2. תכנון זוגות חרוז — לפני הכתיבה
לפני שמתחילים לכתוב — רשום טבלה של זוגות חרוז לכל הבתים.
- רק חרוזים טבעיים ומוכרים — אם לא מצאת, תכנן את הבית בלי חרוז
- רק אחרי שהטבלה מוכנה — מתחילים לכתוב

## 3. מבנה העלילה — חובה
1. פתיחה מהאקשן — אל תתחיל בתיאורים. הצג את הגיבור בפעולה או עם בעיה מייד
2. הבעיה מופיעה — עד הבית/עמוד השלישי
3. מכשול ראשון — הגיבור מנסה ונכשל
4. מכשולים נוספים — ככל שמתקדמים, קשה יותר
5. הגיבור שוקל לוותר — האתגר גדול מדי
6. פרצת דרך — רעיון חדש או עזרה מדמות אחרת
7. פתרון וניצחון — קצר, חיובי, משמח

## 4. אורך ומבנה
- 10–12 עמודים לכל ספר
- 25–40 מילים לכל עמוד
- סה"כ: כ-250–480 מילים
- הסוף: לא יותר מעמוד-שניים אחרי שהבעיה נפתרה

## 5. שפה וניקוד
- הסיפור נכתב בעברית מנוקדת — ניקוד מלא על כל המילים
- אוצר מילים עשיר — אל תזלזל באינטליגנציה של ילדים
- דקדוק מדויק — למשל: מוּצָץ (שם עצם) ולא מוֹצֵץ (פועל)
- אל תכביד — מצא את האיזון שמאפשר זרם קריאה טבעי

## 6. חרוזים וקצב — כללי ברזל
- חרוז טבעי — מותר ורצוי
- חרוז מאולץ — גרוע מאי-חריזה כלל
- כל הבתים חייבים אותו קצב — ספור הברות בקול לכל שורה
- אסור בהחלט:
  * להמציא מילים שלא קיימות בעברית
  * לשבור שורה מלאכותית כדי לכפות חרוז
  * לחרוז מילה עם עצמה
- אם אין חרוז טבעי — לא לחרוז בכלל

## 7. חזרות והומור
- חזרות — ילדים אוהבים ביטויים שחוזרים על עצמם, הם לומדים לדקלם
- הומור — מספיקה סיטואציה מוזרה, דמות משונה, או הפתעה קטנה

## 8. הסוף
- ברגע שהבעיה נפתרה — סיים מהר
- טיפ: חזור למשפט או לרעיון מהפתיחה — יוצר תחושת עיגול מושלם

## צ'קליסט בדיקה
- [ ] תוכננה טבלת זוגות חרוז לפני הכתיבה
- [ ] הסיפור מנוקד במלואו
- [ ] הסיפור מתחיל מהאקשן — לא מתיאורים
- [ ] הבעיה מופיעה עד הבית/עמוד השלישי
- [ ] יש לפחות 2-3 מכשולים לפני הפתרון
- [ ] הגיבור שקל לוותר לפני הפתרון
- [ ] החרוזים (אם יש) — טבעיים, ללא המצאות
- [ ] הקצב שווה בין כל הבתים
- [ ] אין שבירת שורות מלאכותית
- [ ] הדקדוק מדויק
- [ ] יש חזרות שילדים יוכלו לדקלם
- [ ] כל מילה משרתת את העלילה
- [ ] הסוף קצר (עמוד-שניים) ומשמח
- [ ] 10–12 עמודים, 25–40 מילים לעמוד
`;

// ─── פרופיל גיל ───────────────────────────────────────────────────────────────

function getAgeProfile(age: string) {
  if (age === "שנה" || age === "שנתיים") {
    return {
      syllables: "4–6 הברות לשורה",
      stanzas: 8,
      vocabulary: "מילים יומיומיות בלבד: אמא, אבא, ישן, אוכל, כלב, בית, שמש",
      style: "קצב עדין כמו שיר ערש — מנומנם, חוזר, מרגיע",
    };
  }
  if (age === "3" || age === "4") {
    return {
      syllables: "6–8 הברות לשורה",
      stanzas: 10,
      vocabulary: "מילים מוכרות לגן: חברים, גינה, חיות, מאכלים, צבעים, רגשות",
      style: "חם, שמח, צבעוני",
    };
  }
  if (age === "5" || age === "6") {
    return {
      syllables: "8–10 הברות לשורה",
      stanzas: 10,
      vocabulary: "שפה עשירה אך מוכרת — מילה חדשה אחת לבית לכל היותר",
      style: "הרפתקני ומרגש — יש אתגר אמיתי וניצחון",
    };
  }
  if (age === "7" || age === "8") {
    return {
      syllables: "10–12 הברות לשורה",
      stanzas: 10,
      vocabulary: "שפה ציורית ועשירה, מותר במטאפורות פשוטות",
      style: "שירה נרטיבית עם עומק רגשי",
    };
  }
  return {
    syllables: "10–14 הברות לשורה",
    stanzas: 10,
    vocabulary: "שפה עשירה ומגוונת, דימויים ושפה ציורית",
    style: "שירה נרטיבית בוגרת — דמויות מורכבות, מסר משמעותי",
  };
}

// ─── System instruction לגמיני — כללי ברזל ───────────────────────────────────

const GEMINI_SYSTEM = `אתה משורר ילדים בעברית עם ניסיון של 30 שנה. אתה כותב רק שירים שעומדים בכללים הבאים ללא יוצא מן הכלל:

כלל 1 — אפס המצאות: כל מילה חייבת להיות קיימת במילון עברי תקני. אסור להמציא מילים, להטות פעלים בצורה שגויה, או ליצור הלחמים (חיבור שתי מילים למילה חדשה). אם אין חרוז טבעי — שנה את כל השורה.

כלל 2 — אסור לחרז מילה עם עצמה: "גדול/גדול", "שמחה/שמחה" — אלה אינם חרוזים. חרוז = שתי מילים שונות עם סיומת נשמעת דומה.

כלל 3 — קצב שווה: כל 4 שורות בבית חייבות להיות באורך דומה. שורה קצרה לצד שורה ארוכה — אסור.

כלל 4 — שפה ילדים בלבד: עברית פשוטה ומדוברת. ללא מילים ארכאיות, ללא ניסוחים מאנגלית.

כלל 5 — דקדוק מושלם: זכר/נקבה, יחיד/רבים, ניקוד תקני לכל מילה.

כלל 6 — אסור לשבור שורה מלאכותית: כל שורה היא יחידה תחבירית הגיונית. אסור לחתוך משפט באמצע רק כדי לייצר חרוז.`;

// ─── חילוץ הסיפור בלבד מהפלט ─────────────────────────────────────────────────

function extractStory(text: string): string {
  const match = text.match(/(?:^|\n)(# [^\n]+)/);
  if (match && match.index !== undefined) {
    const idx = text.indexOf(match[1]);
    return text.slice(idx).trim();
  }
  return text.trim();
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "חסר מזהה הזמנה" }, { status: 400 });

    const { data: order, error: fetchError } = await supabase
      .from("orders").select("*").eq("id", orderId).single();

    if (fetchError || !order) return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });

    const genderText = order.gender === "boy" ? "ילד" : "ילדה";
    const companionsText = order.companions?.length > 0
      ? order.companions.map((c: { name: string; description: string }) =>
          `${c.name}${c.description ? ` (${c.description})` : ""}`).join(", ")
      : null;
    const profile = getAgeProfile(order.age);

    // ════════════════════════════════════════════════════════════════════════════
    // שלב 1 — גמיני כותב את הסיפור לפי המדריך והשאלון
    // ════════════════════════════════════════════════════════════════════════════

    const writePrompt = `כתוב ספר ילדים שירי בעברית מנוקדת לפי הסקיל ופרטי הסיפור הבאים.

━━━ הסקיל — עבור לפיו בסדר ━━━
${SKILL}

━━━ פרטי הסיפור מהשאלון ━━━
שם הגיבור: ${order.hero_name}
מגדר: ${genderText}
גיל: ${order.age}${order.trait ? `\nתכונת אופי: ${order.trait}` : ""}
עולם ההרפתקה: ${order.world}${order.challenge ? `\nאתגר/בעיה: ${order.challenge}` : ""}${companionsText ? `\nדמויות נוספות: ${companionsText}` : ""}${order.lesson ? `\nמסר: ${order.lesson}` : ""}${order.dedication ? `\nהקדשה: "${order.dedication}"` : ""}

━━━ הנחיות כתיבה לפי המדריך ━━━
מבנה: ${profile.stanzas} בתים, כל בית 4 שורות (${profile.syllables}, כל שורות הבית באורך דומה)
סכמת חרוז AABB: שורה 1+2 מתחרזות, שורה 3+4 מתחרזות
שפה: ${profile.vocabulary}
סגנון: ${profile.style}

מבנה העלילה (חובה):
1. התחל מהאקשן — הצג את הגיבור בפעולה מייד, לא בתיאורים
2. הבעיה מופיעה עד הבית השלישי
3. מכשול ראשון — הגיבור מנסה ונכשל
4. מכשולים נוספים — קשה יותר
5. הגיבור שוקל לוותר
6. פרצת דרך — רעיון חדש או עזרה
7. ניצחון ושמחה — סיום קצר ומשמח
${order.lesson ? `\nהמסר עולה מתוך הסיפור בצורה חיובית — ${order.hero_name} מגלה בעצמו` : ""}${companionsText ? `\n${companionsText} פעילים בסיפור — לא רק אזכור` : ""}

כללים נוספים:
- ניקוד מלא לכל מילה כולל שמות
- שמות בדיוק כפי שניתנו — אל תשנה אותיות
- כל בית מספק סצנה ויזואלית ברורה

לפני שתכתוב — רשום טבלת זוגות חרוז לכל ${profile.stanzas} הבתים, ואז כתוב את הסיפור.`;

    const geminiWriter = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: GEMINI_SYSTEM });
    let draft = "";
    try {
      const result = await geminiWriter.generateContent(writePrompt);
      draft = extractStory(result.response.text() || "");
    } catch (err) {
      console.warn("Gemini write failed, falling back to Claude:", err);
      const fallback = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [{ role: "user", content: writePrompt }],
      });
      draft = extractStory(fallback.content[0].type === "text" ? fallback.content[0].text : "");
    }

    // ════════════════════════════════════════════════════════════════════════════
    // שלב 2 — גמיני בודק את הסיפור לפי הסקיל ומתקן
    // ════════════════════════════════════════════════════════════════════════════

    const geminiQAPrompt1 = `בדוק את ספר הילדים הבא לפי הסקיל המלא. עבור על כל בית בנפרד.

━━━ הסקיל המלא ━━━
${SKILL}

פרטי הסיפור: ${order.hero_name} | גיל ${order.age} | עולם: ${order.world}${companionsText ? ` | דמויות: ${companionsText}` : ""}
הברות לשורה: ${profile.syllables}

אם מצאת בעיה — תקן את הבית המדובר. אם הבית תקין — השאר אותו כמו שהוא.
החזר את הסיפור המתוקן במלואו, מנוקד, ללא הסברים.

━━━ הסיפור לבדיקה ━━━
${draft}`;

    try {
      const geminiQA1 = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: GEMINI_SYSTEM });
      const result = await geminiQA1.generateContent(geminiQAPrompt1);
      draft = extractStory(result.response.text() || draft);
    } catch (err) {
      console.warn("Gemini QA step 2 skipped:", err);
    }

    // ════════════════════════════════════════════════════════════════════════════
    // שלב 3 — קלוד בודק לפי הסקיל והמדריך — מוציא דגשים בלבד, לא עורך
    // ════════════════════════════════════════════════════════════════════════════

    const claudePrompt = `אתה עורך תוכן לספרי ילדים. קיבלת סיפור לבדיקה.
תפקידך: לקרוא ולהוציא רשימת דגשים בלבד — אל תשכתב ואל תערוך.

━━━ הסקיל המלא — בדוק לפיו ━━━
${SKILL}

פרטי הסיפור: ${order.hero_name} | גיל ${order.age} | עולם: ${order.world}${companionsText ? ` | דמויות: ${companionsText}` : ""}${order.lesson ? ` | מסר: ${order.lesson}` : ""}
הברות לשורה: ${profile.syllables}

פורמט התשובה — רשימת דגשים בלבד:
• בית [מספר]: [תיאור הבעיה]
אם בית תקין — לא לציין אותו.
אם הסיפור תקין לחלוטין — כתוב רק: "הסיפור תקין".

━━━ הסיפור לבדיקה ━━━
${draft}`;

    const claudeResult = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: claudePrompt }],
    });
    const claudeNotes = claudeResult.content[0].type === "text" ? claudeResult.content[0].text : "";

    // ════════════════════════════════════════════════════════════════════════════
    // שלב 4 — גמיני מקבל את הדגשים של קלוד + בודק בעצמו + מתקן הכל
    // ════════════════════════════════════════════════════════════════════════════

    const geminiFixPrompt = `אתה עורך ראשי של הוצאת ספרי ילדים. קיבלת סיפור + דגשים מעורך חיצוני.

━━━ הסקיל המלא — עבוד לפיו ━━━
${SKILL}

━━━ דגשים מהעורך החיצוני ━━━
${claudeNotes}

━━━ המשימה שלך ━━━
שלב א — הוסף דגשים משלך שהעורך לא ציין, לפי הסקיל.
שלב ב — תקן את הסיפור לפי כל הדגשים (שלך + של העורך).

פרטי הסיפור: ${order.hero_name} | גיל ${order.age} | עולם: ${order.world}${companionsText ? ` | דמויות: ${companionsText}` : ""}
הברות לשורה: ${profile.syllables}
שמות: ${order.hero_name}${companionsText ? `, ${companionsText}` : ""} — אל תשנה אותיות
עדיף לשכתב בית שלם על פני שמירת מילה מומצאת

החזר:
1. רשימת הדגשים שלך (בקצרה)
2. הסיפור המתוקן במלואו, מנוקד

━━━ הסיפור ━━━
${draft}`;

    let story = draft;
    try {
      const geminiFix = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: GEMINI_SYSTEM });
      const result = await geminiFix.generateContent(geminiFixPrompt);
      story = extractStory(result.response.text() || draft);
    } catch (err) {
      console.warn("Gemini fix step 4 skipped:", err);
    }

    // ════════════════════════════════════════════════════════════════════════════
    // שלב 5 — לולאת בדיקה של גמיני עד שאין תיקונים (מקסימום 5 סיבובים)
    // ════════════════════════════════════════════════════════════════════════════

    const geminiQALoop = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: GEMINI_SYSTEM });

    for (let round = 1; round <= 5; round++) {
      const loopPrompt = `עבור על הסיפור הבא בית אחרי בית לפי הסקיל המלא.

━━━ הסקיל המלא ━━━
${SKILL}

פרטי הסיפור: ${order.hero_name} | גיל ${order.age} | עולם: ${order.world}${companionsText ? ` | דמויות: ${companionsText}` : ""}
הברות לשורה: ${profile.syllables}

━━━ פורמט תשובה חובה ━━━
שורה ראשונה: כתוב בדיוק "תקין" או "יש תיקונים"
אם "יש תיקונים" — רשום את הבעיות, ואחר כך את הסיפור המתוקן במלואו.
אם "תקין" — כתוב "תקין" ואחר כך את הסיפור ללא שינויים.

━━━ הסיפור ━━━
${story}`;

      try {
        const result = await geminiQALoop.generateContent(loopPrompt);
        const output = result.response.text() || "";
        const corrected = extractStory(output);
        if (corrected) story = corrected;

        if (output.trimStart().startsWith("תקין")) break;
      } catch (err) {
        console.warn(`Gemini QA loop round ${round} skipped:`, err);
        break;
      }
    }

    // שמור את הסיפור הסופי
    await supabase.from("orders").update({ story, status: "story_ready" }).eq("id", orderId);

    return NextResponse.json({ success: true, story });
  } catch (err) {
    console.error("Generate story error:", err);
    return NextResponse.json({ error: "שגיאה ביצירת הסיפור" }, { status: 500 });
  }
}
