import Link from "next/link";

import type { Article } from "@/types/content";

export type ArticleCardProps = {
  article: Pick<Article, "slug" | "title" | "excerpt" | "coverImage" | "publishedAt">;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-background/90 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
          {new Date(article.publishedAt).toLocaleDateString("id-ID")}
        </p>
        <h2 className="text-xl font-semibold text-foreground">{article.title}</h2>
        <p className="text-sm text-foreground/70">{article.excerpt}</p>
      </div>
      <Link
        className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
        href={`/articles/${article.slug}`}
      >
        Baca selengkapnya →
      </Link>
    </article>
  );
}
