import { NextRequest, NextResponse } from "next/server";
import { sendComplaint, ComplaintData } from "@/lib/tankerkoenig";

export async function POST(req: NextRequest) {
  try {
    const body: ComplaintData = await req.json();

    if (!body.id || !body.type) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields (id, type)" },
        { status: 400 }
      );
    }

    const success = await sendComplaint(body);

    if (success) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json(
        { ok: false, message: "Failed to submit complaint to TankerKoenig" },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error("Complaint API Error:", error);
    return NextResponse.json(
      { ok: false, message: error.message || "Failed to process complaint" },
      { status: 500 }
    );
  }
}
