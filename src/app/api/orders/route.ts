import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, gender, age, world, companions, lesson, dedication, email, phone } = body;

    // ולידציה בסיסית
    if (!name || !gender || !age || !world || !email || !phone) {
      return NextResponse.json({ error: "חסרים שדות חובה" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          hero_name: name,
          gender,
          age,
          world,
          companions: companions ?? [],
          lesson: lesson ?? "",
          dedication: dedication ?? "",
          email,
          phone,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "שגיאה בשמירת ההזמנה" }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId: data.id });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "שגיאה כללית" }, { status: 500 });
  }
}
