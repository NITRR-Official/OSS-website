"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  _id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentsSectionProps {
  slug: string;
  type: "blog" | "resource";
}

export function CommentsSection({ slug, type }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/comments?slug=${slug}&type=${type}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
        setIsLoading(false);
      });
  }, [slug, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, type, authorName: name, content }),
      });
      const newComment = await res.json();
      if (!newComment.error) {
        setComments([newComment, ...comments]);
        setName("");
        setContent("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-12 border-t">
      <h2 className="text-2xl font-bold mb-8">Comments ({comments.length})</h2>

      <form onSubmit={handleSubmit} className="mb-12 bg-card border rounded-2xl p-6 md:p-8">
        <h3 className="font-semibold text-lg mb-4">Leave a comment</h3>
        <div className="space-y-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={50}
            className="max-w-md"
          />
          <Textarea
            placeholder="What are your thoughts? Keep it clean!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={500}
            rows={4}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-muted rounded-2xl w-full"></div>
            <div className="h-24 bg-muted rounded-2xl w-full"></div>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <div key={comment._id} className="p-6 border rounded-2xl bg-card">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-lg">{comment.authorName}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to start the conversation!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
