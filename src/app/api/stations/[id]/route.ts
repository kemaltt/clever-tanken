import { NextRequest, NextResponse } from "next/server";
import { getStationDetail } from "@/lib/tankerkoenig";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "Station ID is required" },
      { status: 400 }
    );
  }

  try {
    const station = await getStationDetail(id);
    return NextResponse.json({ ok: true, station });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Failed to fetch station details",
      },
      { status: 500 }
    );
  }
}
