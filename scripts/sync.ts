import mongoose from "mongoose";
import { generateEmbedding } from "../src/lib/search";
import { getAllPosts } from "../src/lib/blog";
import { fetchResourcesList } from "../src/lib/github/resources";
import Embedding from "../src/lib/db/models/Embedding";

// This script generates embeddings for all blogs and resources
// and pushes them to your MongoDB database. It is meant to be run locally
// to bypass Vercel's strict memory and timeout limits.

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in your environment.");
  process.exit(1);
}

async function syncEmbeddings() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected successfully.\n");

    let embeddedCount = 0;

    // 1. Sync Blogs
    console.log("Syncing Blogs...");
    const blogs = getAllPosts();
    for (const blog of blogs) {
      console.log(`- Generating embedding for blog: ${blog.title}`);
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
    console.log("\nSyncing Resources...");
    const resources = await fetchResourcesList();
    for (const resource of resources) {
      console.log(`- Generating embedding for resource: ${resource.name}`);
      const text = `${resource.name} ${(resource.tags || []).join(" ")}`;
      const embedding = await generateEmbedding(text);
      await Embedding.findOneAndUpdate(
        { slug: resource.slug, type: "resource" },
        { title: resource.name, text, embedding },
        { upsert: true }
      );
      embeddedCount++;
    }

    console.log(`\n✅ Successfully synced ${embeddedCount} items to Vector DB.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

syncEmbeddings();
