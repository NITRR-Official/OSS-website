import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Comment from "@/lib/db/models/Comment";
import { Filter } from "bad-words";

const filter = new Filter();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");

  if (!slug || !type) {
    return NextResponse.json({ error: "Missing slug or type" }, { status: 400 });
  }

  try {
    await dbConnect();
    const comments = await Comment.find({ slug, type, isApproved: true }).sort({ createdAt: -1 });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { slug, type, authorName, content } = await request.json();

    if (!slug || !type || !authorName || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Clean the content using bad-words filter
    const cleanContent = filter.clean(content);
    const cleanAuthor = filter.clean(authorName);

    await dbConnect();
    const comment = await Comment.create({
      slug,
      type,
      authorName: cleanAuthor,
      content: cleanContent,
      isApproved: true, // Auto-approve since it's filtered
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}
