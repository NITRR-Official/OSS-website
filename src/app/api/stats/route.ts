import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import PageStats from "@/lib/db/models/PageStats";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    await dbConnect();
    const stats = await PageStats.findOne({ slug });
    return NextResponse.json(stats || { slug, helpfulCount: 0, notHelpfulCount: 0 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { slug, isHelpful } = await request.json();

    if (!slug || typeof isHelpful !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await dbConnect();
    const update = isHelpful ? { $inc: { helpfulCount: 1 } } : { $inc: { notHelpfulCount: 1 } };

    const stats = await PageStats.findOneAndUpdate({ slug }, update, { new: true, upsert: true });

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}
