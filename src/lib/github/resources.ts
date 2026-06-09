import matter from "gray-matter";
import { octokit } from "./client";

const REPO_OWNER = "NITRR-Official";
const REPO_NAME = "Help-and-Resources";

export interface ResourceItem {
  name: string;
  slug: string;
  path: string;
  type: string;
  tags?: string[];
}

export async function fetchResourcesList(): Promise<ResourceItem[]> {
  try {
    // 1. Fetch README.md to parse titles
    const titleMap: Record<string, string> = {};
    try {
      const readmeRes = await fetch(
        `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/README.md`
      );
      if (readmeRes.ok) {
        const readmeText = await readmeRes.text();
        const regex = /\[(.*?)\]\(\/?(.*?\.md)\)/g;
        let match;
        while ((match = regex.exec(readmeText)) !== null) {
          const title = match[1];
          const filename = match[2];
          titleMap[filename.toLowerCase()] = title;
        }
      }
    } catch (err) {
      console.error("Failed to parse README for titles:", err);
    }

    // 2. Fetch directory contents
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: "",
    });

    if (!Array.isArray(data)) {
      return [];
    }

    const rawFiles = data
      .filter((item) => item.type === "file" && item.name.endsWith(".md"))
      .filter((item) => item.name.toLowerCase() !== "readme.md");

    // 3. Fetch each file's raw content to extract frontmatter tags
    const resources = await Promise.all(
      rawFiles.map(async (item) => {
        const defaultName = item.name.replace(".md", "").replace(/-/g, " ");
        const title = titleMap[item.name.toLowerCase()] || defaultName;
        const slug = item.name.replace(".md", "");

        let tags: string[] = [];
        try {
          const rawRes = await fetch(
            `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${item.path}`
          );
          if (rawRes.ok) {
            const rawText = await rawRes.text();
            const parsed = matter(rawText);
            tags = parsed.data.tags || [];
          }
        } catch (err) {
          console.error("Failed to parse tags for", item.name, err);
        }

        return {
          name: title,
          slug,
          path: item.path,
          type: item.type,
          tags,
        };
      })
    );

    return resources;
  } catch (error) {
    console.error("Failed to fetch resources list:", error);
    return [];
  }
}

export async function fetchResourceContent(slug: string): Promise<string | null> {
  try {
    const path = `${slug}.md`;

    // Fetch raw content
    const res = await fetch(
      `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${path}`
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch resource content: ${res.statusText}`);
    }

    return await res.text();
  } catch (error) {
    console.error(`Failed to fetch content for ${slug}:`, error);
    return null;
  }
}
