import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Embedding from "@/lib/db/models/Embedding";
import { generateEmbedding } from "@/lib/search";
import { getAllPosts } from "@/lib/blog";
import { fetchResourcesList } from "@/lib/github/resources";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await dbConnect();

    let embeddedCount = 0;

    // 1. Sync Blogs
    const blogs = getAllPosts();
    for (const blog of blogs) {
      const text = `${blog.title} ${blog.excerpt} ${(blog.tags || []).join(" ")}`;
      const embedding = await generateEmbedding(text);
      await Embedding.findOneAndUpdate(
        { slug: blog.slug, type: "blog" },
        { title: blog.title, text, embedding },
        { upsert: true }
      );
      embeddedCount++;
    }

    // 2. Sync Resources
    const resources = await fetchResourcesList();
    for (const resource of resources) {
      const text = `${resource.name} ${(resource.tags || []).join(" ")}`;
      const embedding = await generateEmbedding(text);
      await Embedding.findOneAndUpdate(
        { slug: resource.slug, type: "resource" },
        { title: resource.name, text, embedding },
        { upsert: true }
      );
      embeddedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${embeddedCount} items to Vector DB.`,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
