import { NextResponse } from "next/server";
import { seedMockData } from "@/lib/seed";

export async function GET() {
  try {
    await seedMockData();
    return NextResponse.json({ success: true, message: "Successfully seeded events and sponsors." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
