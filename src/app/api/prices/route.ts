import { NextRequest, NextResponse } from "next/server";
import { getPrices } from "@/lib/tankerkoenig";

// Prevent Vercel from caching this route too aggressively since prices change often
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json(
        { ok: false, message: "Missing 'ids' parameter" },
        { status: 400 }
      );
    }

    const idList = ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (idList.length === 0) {
      return NextResponse.json({ ok: true, prices: {} });
    }

    const prices = await getPrices(idList);

    return NextResponse.json({ ok: true, prices });
  } catch (error: any) {
    console.error("Prices API Error:", error);
    return NextResponse.json(
      { ok: false, message: error.message || "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
