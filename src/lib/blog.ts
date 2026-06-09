import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDirectory = path.join(process.cwd(), "src/content/blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export function getAllPosts(): BlogPostMeta[] {
  // Ensure the directory exists
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const files = fs.readdirSync(blogDirectory);

  const posts = files
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || "Unknown date",
        author: data.author || "Anonymous",
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || undefined,
        tags: data.tags || [],
      };
    });

  // Sort posts by date in descending order
  return posts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || "Unknown date",
      author: data.author || "Anonymous",
      excerpt: data.excerpt || "",
      coverImage: data.coverImage || undefined,
      tags: data.tags || [],
      content,
    };
  } catch (error) {
    console.error(`Failed to read blog post ${slug}:`, error);
    return null;
  }
}
