import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ─── הגדרות לפי גיל ───────────────────────────────────────────────────────────

type AgeProfile = {
  syllables: string;
  rhyme: string;
  rhymeExplain: string;
  stanzas: number;
  style: string;
  vocabulary: string;
  structure: string;
};

function getAgeProfile(age: string): AgeProfile {
  if (age === "שנה" || age === "שנתיים") {
    return {
      syllables: "4–6 הברות לשורה בלבד",
      rhyme: "AABB",
      rhymeExplain: "שורה 1 מתחרזת עם 2, שורה 3 עם 4",
      stanzas: 8,
      style: "קצב עדין כמו שיר ערש — מנומנם, חוזר, מרגיע",
      vocabulary: "מילים יומיומיות בלבד: אמא, אבא, ישן, אוכל, כלב, בית, שמש",
      structure: "כל בית = תמונה אחת פשוטה מהיום: בוקר, שחק, אוכל, שינה",
    };
  }
  if (age === "3" || age === "4") {
    return {
      syllables: "6–8 הברות לשורה",
      rhyme: "AABB",
      rhymeExplain: "שורה 1 מתחרזת עם 2, שורה 3 עם 4",
      stanzas: 9,
      style: "חם, שמח, צבעוני — כמו לאה גולדברג ולוין קיפניס",
      vocabulary: "מילים מוכרות לגן: חברים, גינה, חיות, מאכלים, צבעים, רגשות",
      structure: "עלילה פשוטה: יציאה להרפתקה קטנה, פגישה עם מכשול, פתרון שמח",
    };
  }
  if (age === "5" || age === "6") {
    return {
      syllables: "8–10 הברות לשורה",
      rhyme: "AABB",
      rhymeExplain: "שורה 1 מתחרזת עם 2, שורה 3 עם 4",
      stanzas: 10,
      style: "הרפתקני ומרגש — יש אתגר אמיתי וניצחון",
      vocabulary: "שפה עשירה יותר אך מוכרת — ניתן להוסיף מילה חדשה אחת לבית",
      structure: "מבנה 5 שלבים: יציאה לדרך ← קושי ← ניסיון ראשון ← כישלון ← פתרון + לקח",
    };
  }
  if (age === "7" || age === "8") {
    return {
      syllables: "10–12 הברות לשורה",
      rhyme: "AABB",
      rhymeExplain: "שורה 1 מתחרזת עם 2, שורה 3 עם 4",
      stanzas: 10,
      style: "שירה נרטיבית עם עומק רגשי — הגיבור גדל מהניסיון",
      vocabulary: "שפה ציורית ועשירה, מותר להשתמש במטאפורות פשוטות",
      structure: "עלילה עם מתח אמיתי: הגיבור נכשל, מתייאש, מוצא כוח פנימי ומנצח",
    };
  }
  // 9+
  return {
    syllables: "10–14 הברות לשורה",
    rhyme: "AABB",
    rhymeExplain: "שורה 1 מתחרזת עם 2, שורה 3 עם 4",
    stanzas: 10,
    style: "שירה נרטיבית בוגרת — דמויות מורכבות, מסר משמעותי",
    vocabulary: "שפה עשירה ומגוונת, ניתן להשתמש בדימויים ושפה ציורית",
    structure: "עלילה מורכבת עם נקודת שבר ושינוי פנימי אמיתי אצל הגיבור",
  };
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "חסר מזהה הזמנה" }, { status: 400 });
    }

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });
    }

    const genderText = order.gender === "boy" ? "ילד" : "ילדה";
    const companionsText =
      order.companions && order.companions.length > 0
        ? order.companions
            .map(
              (c: { name: string; description: string }) =>
                `${c.name}${c.description ? ` (${c.description})` : ""}`
            )
            .join(", ")
        : null;

    const profile = getAgeProfile(order.age);

    // ── שלב 1: גמיני כותב את הסיפור ──────────────────────────────────────────
    const geminiWritePrompt = `כתוב ספר ילדים שירי בעברית מנוקדת לפי הפרטים הבאים:

פרטי הסיפור:
שם הגיבור: ${order.hero_name}
מגדר: ${genderText}
גיל: ${order.age}
עולם: ${order.world}${companionsText ? `\nדמויות: ${companionsText}` : ""}${order.lesson ? `\nמסר: ${order.lesson}` : ""}${order.dedication ? `\nהקדשה: "${order.dedication}"` : ""}

הנחיות:
${profile.stanzas} בתים, כל בית 4 שורות
סכמת חרוז AABB: שורה 1+2 מתחרזות, שורה 3+4 מתחרזות
${profile.syllables}, כל שורות הבית באורך דומה
שפה של ילד בן ${order.age}: ${profile.vocabulary} — לא מילים ארכאיות
${order.lesson ? `המסר צריך להיות חיובי — ${order.hero_name} מגלה בעצמו את הלקח` : ""}${companionsText ? `\n${companionsText} פעילים בסיפור — לא רק אזכור` : ""}
ניקוד מלא לכל מילה כולל שמות
שמות בדיוק כפי שניתנו — אל תשנה אותיות

לפני שתכתוב — רשום קודם את זוגות החרוז לכל ${profile.stanzas} הבתים, ואחר כך כתוב את הסיפור.`;

    const hebrewPoetrySystem = `אתה משורר ילדים בעברית עם ניסיון של 30 שנה. אתה כותב רק שירים שעומדים בחמישה חוקים ללא יוצא מן הכלל:

חוק 1 — אפס המצאות: כל מילה שתכתוב חייבת להיות קיימת במילון עברי תקני. אסור בהחלט להמציא מילים, להטות פעלים בצורה שגויה, או לייצר תחביר שבור. אם אין לך חרוז טבעי — שנה את כל השורה, אל תמציא מילה.

חוק 2 — אסור לחרז מילה עם עצמה: "גדול/גדול", "שמחה/שמחה", "ליאור/ליאור" — אלה אינם חרוזים. זהו כישלון מוחלט. חרוז = שתי מילים שונות עם סיומת נשמעת דומה.

חוק 3 — קצב שווה: כל 4 שורות בבית חייבות להיות באורך דומה. שורה של 4 מילים לצד שורה של 10 מילים — אסור.

חוק 4 — שפה ילדים בלבד: עברית פשוטה ומדוברת. ללא מילים ארכאיות, ללא ניסוחים מאנגלית.

חוק 5 — דקדוק מושלם: זכר/נקבה, יחיד/רבים, ניקוד תקני. מוּצָץ (שם עצם) ולא מוֹצֵץ (פועל).`;

    let draft = "";
    try {
      const geminiWriter = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: hebrewPoetrySystem,
      });
      const geminiWriteResult = await geminiWriter.generateContent(geminiWritePrompt);
      draft = geminiWriteResult.response.text() || "";
    } catch (err) {
      console.warn("Gemini write failed, falling back to Claude:", err);
    }

    // Fallback: קלוד כותב אם גמיני נכשל
    if (!draft) {
      const fallback = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [{ role: "user", content: geminiWritePrompt }],
      });
      draft = fallback.content[0].type === "text" ? fallback.content[0].text : "";
    }

    // חלץ רק את הסיפור — מחפש שורה שמתחילה ב-# (כותרת ראשית), לא ## או טבלאות
    const storyMatch = draft.match(/(?:^|\n)(# [^\n]+)/);
    if (storyMatch && storyMatch.index !== undefined) {
      const idx = draft.indexOf(storyMatch[1]);
      draft = draft.slice(idx);
    }

    // ── שלב 2: גמיני בודק את עצמו — כל בית לפי 7 קריטריונים ────────────────
    const geminiSelfReviewPrompt = `כתבת עכשיו ספר ילדים שירי. עבור על כל בית בנפרד ובדוק אותו לפי 7 קריטריונים. אם מצאת בעיה — שכתב את הבית. אם הבית תקין — השאר אותו כמות שהוא.

פרטי הסיפור לעיון: גיבור: ${order.hero_name} | גיל: ${order.age} | עולם: ${order.world}${companionsText ? ` | דמויות: ${companionsText}` : ""}${order.lesson ? ` | מסר: ${order.lesson}` : ""}

לכל בית — בדוק בסדר הזה:

1. חרוזים: רשום את המילה האחרונה של כל שורה. שורה 1+2 מתחרזות? שורה 3+4 מתחרזות? חרוז מילה עם עצמה (גדול/גדול)? — שכתב מיד.

2. מילים מומצאות: כל מילה קיימת בעברית תקנית? אם יש ספק בכל מילה — החלף את כל הבית. עדיף בית חדש על מילה מומצאת.

3. היגיון עלילתי: כל משפט בבית הגיוני? האם הפעולות הגיוניות לדמויות? (כלב מכשכש בזנב ולא "נובח בשחי", חמוס לא נישא בין שיני כלב). קרא כל שורה בנפרד ושאל: "האם זה יכול לקרות?".

4. עקביות הסיפור: האם מה שקורה בבית הזה מתחבר להגיוני למה שקרה לפניו? האם הדמויות פועלות בצורה עקבית לאורך הסיפור?

5. אורך שורות: כל 4 השורות באורך דומה (${profile.syllables})? שורה קצרה בצד שורה ארוכה — תקן.

6. שפה לגיל: יש מילים ארכאיות? תרגומים מאנגלית? שפה לא מתאימה לילד בן ${order.age}? — פשט.

7. קונוטציות: האם כל המילים, במיוחד בסיום, הן חיוביות? אין מילים עם משמעות שלילית (כמו "פרוץ", "שבור", "נשחת") — גם אם הן מתחרזות.

אחרי שבדקת את כל הבתים — החזר את הסיפור המתוקן במלואו, מנוקד, ללא הסברים.

━━━ הסיפור לבדיקה עצמית ━━━
${draft}`;

    try {
      const geminiSelfReviewer = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: hebrewPoetrySystem,
      });
      const geminiSelfReviewResult = await geminiSelfReviewer.generateContent(geminiSelfReviewPrompt);
      draft = geminiSelfReviewResult.response.text() || draft;
    } catch (err) {
      console.warn("Gemini self-review skipped:", err);
    }

    // ── שלב 3: קלוד — מוציא דגשים בלבד, לא עורך ──────────────────────────────
    const claudeFeedbackPrompt = `אתה עורך תוכן לספרי ילדים. קיבלת סיפור ילדים שירי לבדיקה.
תפקידך עכשיו: לקרוא ולהוציא רשימת דגשים בלבד — אל תשכתב ואל תערוך את הסיפור.

בדוק כל בית לפי הקריטריונים הבאים ורשום רק את הבעיות שמצאת:

1. **עקביות עלילתית** — האם כל בית הגיוני? האם יש קפיצות לוגיות? האם הפעולות מתאימות לעולם ${order.world}?
2. **היגיון דמויות** — ${companionsText ? `הדמויות ${companionsText} — האם הן פועלות בצורה הגיונית לפי מה שהן?` : "האם הגיבור פועל בצורה הגיונית?"}
3. **המסר** — ${order.lesson ? `האם המסר "${order.lesson}" עולה בצורה חיובית מתוך הסיפור?` : "האם הסיפור מסתיים בחיוך?"}
4. **ניקוד שמות** — האם ${order.hero_name}${companionsText ? ` ו-${companionsText}` : ""} מנוקדים נכון ועקבי?
5. **שפה לגיל** — יש מילים לא מתאימות לילד בן ${order.age}?
6. **קונוטציות** — יש מילים עם משמעות שלילית, במיוחד בסיום?

פורמט התשובה — רשימת דגשים בלבד:
• בית [מספר]: [תיאור הבעיה]
אם אין בעיות בבית — אל תזכיר אותו.

━━━ הסיפור לבדיקה ━━━
${draft}`;

    const claudeFeedback = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: claudeFeedbackPrompt }],
    });

    const claudeNotes =
      claudeFeedback.content[0].type === "text" ? claudeFeedback.content[0].text : "";

    // ── שלב 4: גמיני — מוציא דגשים משלו ומתקן הכל ──────────────────────────
    const geminiFixPrompt = `אתה עורך ראשי של הוצאת ספרי ילדים. קיבלת סיפור ילדים שירי + דגשים מעורך אחר.

פרטי הסיפור: ${order.hero_name} | גיל ${order.age} | עולם: ${order.world}${companionsText ? ` | דמויות: ${companionsText}` : ""}

━━━ דגשים מהעורך ━━━
${claudeNotes || "לא נמצאו בעיות על ידי העורך"}

━━━ המשימה שלך ━━━
שלב א — הוסף דגשים משלך על הסיפור (מה שהעורך לא ציין):
• חרוזים שבורים (שורה 1+2, שורה 3+4)
• מילה מחורזת עם עצמה
• מילים מומצאות שלא קיימות בעברית
• שורות באורך לא שווה (${profile.syllables})
• כל בעיה אחרת שאתה מזהה

שלב ב — תקן את הסיפור לפי כל הדגשים (שלך + של העורך):
• שכתב כל בית שיש בו בעיה
• שמות: ${order.hero_name}${companionsText ? `, ${companionsText}` : ""} — אל תשנה אותיות
• עדיף לשכתב בית שלם על פני שמירת מילה מומצאת

החזר:
1. את רשימת הדגשים שלך (קצר)
2. את הסיפור המתוקן במלואו, מנוקד

━━━ הסיפור ━━━
${draft}`;

    let story = draft;
    try {
      const geminiFixModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: hebrewPoetrySystem,
      });
      const geminiFixResult = await geminiFixModel.generateContent(geminiFixPrompt);
      const geminiFixOutput = geminiFixResult.response.text() || draft;
      // חלץ רק את הסיפור — מחפש שורה שמתחילה ב-# (כותרת ראשית)
      const fixMatch = geminiFixOutput.match(/(?:^|\n)(# [^\n]+)/);
      if (fixMatch) {
        const idx = geminiFixOutput.indexOf(fixMatch[1]);
        story = geminiFixOutput.slice(idx);
      } else {
        story = geminiFixOutput;
      }
    } catch (err) {
      console.warn("Gemini fix skipped:", err);
    }

    // ── שלב 5: גמיני — קריאה אחרונה ותיקון סופי ────────────────────────────
    const geminiFinalPrompt = `אתה עורך אחראי בהוצאת ספרי ילדים. קרא את הסיפור הבא בקול רם בראש שלך, בית אחרי בית.

עבור על כל בית ובדוק:
- האם שורה 1 ושורה 2 מתחרזות? (נשמעות דומות בסוף)
- האם שורה 3 ושורה 4 מתחרזות?
- האם כל 4 השורות באורך דומה?
- האם יש מילה שלא קיימת בעברית?
- האם השפה מתאימה לילד בן ${order.age}?

אם מצאת בעיה — שכתב את הבית. אם הבית תקין — השאר אותו בדיוק כמו שהוא.
שמות: ${order.hero_name}${companionsText ? `, ${companionsText}` : ""} — אל תשנה.

החזר את הסיפור הסופי בלבד, מנוקד במלואו, ללא הסברים.

━━━ הסיפור ━━━
${story}`;

    try {
      const geminiFinal = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: hebrewPoetrySystem });
      const geminiFinalResult = await geminiFinal.generateContent(geminiFinalPrompt);
      story = geminiFinalResult.response.text() || story;
    } catch (err) {
      console.warn("Gemini final pass skipped:", err);
    }

    // ── שלב 6: גמיני — לולאת בדיקה עד שאין יותר מה לתקן (עד 3 סיבובים) ────
    const geminiQAModel = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: hebrewPoetrySystem,
    });

    for (let round = 1; round <= 3; round++) {
      const qaPrompt = `אתה עורך ראשי של הוצאת ספרי ילדים. בדוק את הסיפור הבא לפי 4 קריטריונים ותגיב בפורמט קבוע.

פרטי הסיפור: ${order.hero_name} | גיל ${order.age} | עולם: ${order.world}${companionsText ? ` | דמויות: ${companionsText}` : ""}${order.lesson ? ` | מסר: ${order.lesson}` : ""}

━━━ 5 קריטריונים לבדיקה — עבור על כל בית ━━━

1. חריזה אמיתית (הכי חשוב):
- שורה 1+2 מתחרזות? שורה 3+4 מתחרזות? בדוק בקול — צלילי הסוף דומים?
- חשוב ביותר: אם בית לא מתחרז כלל — זה כשל. עדיף לשכתב בית שלם עם חרוז אמיתי.
- אסור לחרז מילה עם עצמה. אסור להמציא מילים כדי לחרוז.
- אם אין חרוז טבעי — שנה את כל תוכן הבית, לא רק את הסוף.

2. התאמה קוגניטיבית לקהל היעד — ילד בן ${order.age}:
- המילים והמושגים מוכרים וברורים. שפה ארכאית או מטאפורות מורכבות מנתקות את הילד.
- הקונפליקט מוחשי וקונקרטי — לא מופשט.
- אורך כל בית מתאים לטווח הקשב בהקראה.

3. מבנה וקצב:
- הקריאה בקול רם "מחליקה" ללא היתקעות — משקל קצבי ואחיד.
- חרוזים מאולצים (משפט לא הגיוני רק כדי להתחרז) — חייבים שכתוב.
- ${profile.syllables} — כל 4 שורות בבית באורך דומה.

4. קשת עלילתית, מסר והתנהגות דמויות:
- הגיבור ${order.hero_name} אקטיבי — פותר בעצמו, לא מבוגר שמציל.
- המסר חיובי ומעצים — לא הטפת מוסר ולא הפחדה.
- הדמויות מתנהגות בצורה הגיונית לפי מה שהן: כלב מכשכש בזנב ומלקק — לא "מנשק על הלחיים". כדור מתגלגל — לא "גולל ביד".
- כל משפט הגיוני בתוך עולם ${order.world} — אין קפיצות לוגיות.

5. פוטנציאל ויזואלי:
- כל בית מספק סצנה ויזואלית ברורה למאייר (תנועה, פעולה, אינטראקציה).
- שני בתים רצופים באותה תנוחה — הוסף פעולה.
- יש מתח קל בסוף כל בית שמזמין לדף הבא.

6. בדיקות קריטיות נגד טריקי AI:
- איסור שבירת שורות מלאכותית: כל שורה היא יחידה תחבירית הגיונית. אסור לחתוך משפט באמצע (להפריד נושא מפועל) רק כדי לייצר חרוז בסוף שורה.
- איתור הלחמים (Portmanteaus): חפש פעלים או שמות תואר שהם חיבור לא הגיוני של שתי מילים (כמו "ליזקה" = ליקק+זינק, "שמחן" = שמח+חייכן). כל פועל חייב להיות קיים בעברית תקנית בהטיה נכונה.
- עקביות חפצים: האובייקט המרכזי שומר על שמו לאורך כל הסיפור — כדורגל לא יכול להפוך פתאום ל"גולה" רק בשביל חרוז.
- היגיון דימויים: דימויים (כמו "רענן כ...") חייבים להיות הגיוניים ויזואלית — "רענן כחרש" לא הגיוני. אם הדימוי לא עומד בפני עצמו — שנה אותו.

━━━ פורמט תשובה חובה ━━━
שורה ראשונה: כתוב בדיוק אחת מהאפשרויות: "תקין" או "יש תיקונים"
אם "יש תיקונים" — רשום את כל הבעיות, ואחר כך כתוב את הסיפור המתוקן במלואו.
אם "תקין" — כתוב רק "תקין" ואחר כך את הסיפור ללא שינויים.

━━━ הסיפור ━━━
${story}`;

      try {
        const qaResult = await geminiQAModel.generateContent(qaPrompt);
        const qaOutput = qaResult.response.text() || "";

        if (qaOutput.trimStart().startsWith("תקין")) {
          // אין יותר תיקונים — עוצרים
          const qaMatch = qaOutput.match(/(?:^|\n)(# [^\n]+)/);
          if (qaMatch) { const idx = qaOutput.indexOf(qaMatch[1]); story = qaOutput.slice(idx); }
          break;
        } else {
          // יש תיקונים — חלץ את הסיפור המתוקן
          const qaMatch = qaOutput.match(/(?:^|\n)(# [^\n]+)/);
          if (qaMatch) { const idx = qaOutput.indexOf(qaMatch[1]); story = qaOutput.slice(idx); }
        }
      } catch (err) {
        console.warn(`Gemini QA round ${round} skipped:`, err);
        break;
      }
    }

    await supabase
      .from("orders")
      .update({ story, status: "story_ready" })
      .eq("id", orderId);

    return NextResponse.json({ success: true, story });
  } catch (err) {
    console.error("Generate story error:", err);
    return NextResponse.json({ error: "שגיאה ביצירת הסיפור" }, { status: 500 });
  }
}
