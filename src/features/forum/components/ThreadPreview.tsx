import Link from "next/link";

import type { Thread } from "@/types/content";

export type ThreadPreviewProps = {
  thread: Thread;
};

export function ThreadPreview({ thread }: ThreadPreviewProps) {
  return (
    <article className="rounded-2xl border border-border bg-background/90 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">
            <Link className="hover:underline" href={`/forum/${thread.id}`}>
              {thread.title}
            </Link>
          </h2>
          <p className="text-sm text-foreground/70">{thread.excerpt}</p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
          {thread.replyCount} balasan
        </span>
      </div>
    </article>
  );
}
