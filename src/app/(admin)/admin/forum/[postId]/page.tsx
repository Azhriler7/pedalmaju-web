'use client';

import { use as usePromise, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import PostCard from '@/features/forum/components/PostCard';
import CommentTree from '@/features/forum/components/CommentTree';
import ForumService from '@/features/forum/services/ForumService';
import { useAuth } from '@/hooks/useAuth';
import type { Comment, Post, Vote as VoteType } from '@/types';

interface PageParams {
  postId: string;
}

interface PageProps {
  params: PageParams | Promise<PageParams>;
}

const formatTimestamp = (timestamp: number) => {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(timestamp));
  } catch {
    return 'Baru saja';
  }
};

const moderationTips = [
  'Saling menghargai pendapat, terutama saat membagikan praktik lapangan.',
  'Sertakan konteks data sensor atau kondisi lahan agar diskusi lebih relevan.',
  'Gunakan fitur laporan jika menemukan konten yang perlu dimoderasi.',
];

const fallbackAdminAvatar =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80';

const resolveAvatar = (photoUrl: string | null | undefined, fallback: string): string => {
  if (typeof photoUrl === 'string') {
    const trimmed = photoUrl.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return fallback;
};

export default function AdminForumPost({ params }: PageProps) {
  const paramsPromise = useMemo(() => {
    if (typeof (params as Promise<PageParams>).then === 'function') {
      return params as Promise<PageParams>;
    }
    return Promise.resolve(params as PageParams);
  }, [params]);

  const { postId } = usePromise(paramsPromise);
  const router = useRouter();
  const { user, loading } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [postVote, setPostVote] = useState<VoteType['type'] | null>(null);
  const [isPostVotePending, setIsPostVotePending] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isCommentSending, setIsCommentSending] = useState(false);
  const [commentVotes, setCommentVotes] = useState<Record<string, VoteType['type'] | null>>({});
  const [pendingCommentVoteIds, setPendingCommentVoteIds] = useState<Set<string>>(new Set());
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const composerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setIsPostLoading(true);
    const unsubscribe = ForumService.subscribeToPost(postId, (nextPost) => {
      setPost(nextPost);
      setIsPostLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    const unsubscribe = ForumService.subscribeToComments(postId, (nextComments) => {
      setComments(nextComments);
    });

    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    if (!user || !post) {
      setPostVote(null);
      return;
    }

    let isActive = true;

    const loadVote = async () => {
      try {
        const vote = await ForumService.getUserVoteForPost(post.id, user.uid);
        if (isActive) {
          setPostVote(vote);
        }
      } catch (error) {
        console.error('Failed to fetch post vote', error);
      }
    };

    loadVote();

    return () => {
      isActive = false;
    };
  }, [user, post]);

  useEffect(() => {
    if (!user) {
      setCommentVotes({});
      return;
    }

    if (comments.length === 0) {
      setCommentVotes({});
      return;
    }

    let isActive = true;

    const loadCommentVotes = async () => {
      try {
        const entries = await Promise.all(
          comments.map(async (comment) => {
            const vote = await ForumService.getUserVoteForComment(postId, comment.id, user.uid);
            return [comment.id, vote] as const;
          })
        );

        if (isActive) {
          setCommentVotes(Object.fromEntries(entries));
        }
      } catch (error) {
        console.error('Failed to fetch comment votes', error);
      }
    };

    loadCommentVotes();

    return () => {
      isActive = false;
    };
  }, [comments, user, postId]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.push('/forum');
    }
  }, [loading, user, router]);

  const handleScrollToComposer = () => {
    setReplyTarget(null);
    composerRef.current?.scrollIntoView({ behavior: 'smooth' });
    textareaRef.current?.focus();
  };

  const handlePostVote = async (postIdValue: string, type: VoteType['type']) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsPostVotePending(true);
    setErrorMessage(null);

    try {
      const nextVote = await ForumService.togglePostVote(postIdValue, user.uid, type);
      setPostVote(nextVote);
    } catch (error) {
      console.error('Failed to vote post', error);
      setErrorMessage('Tidak dapat memproses voting postingan.');
    } finally {
      setIsPostVotePending(false);
    }
  };

  const handleCommentVote = async (commentId: string, type: VoteType['type']) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setPendingCommentVoteIds((prev) => {
      const next = new Set(prev);
      next.add(commentId);
      return next;
    });
    setErrorMessage(null);

    try {
      const nextVote = await ForumService.toggleCommentVote(postId, commentId, user.uid, type);
      setCommentVotes((prev) => ({
        ...prev,
        [commentId]: nextVote,
      }));
    } catch (error) {
      console.error('Failed to vote comment', error);
      setErrorMessage('Tidak dapat memproses voting komentar.');
    } finally {
      setPendingCommentVoteIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  const handleSubmitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    if (!commentText.trim()) {
      setErrorMessage('Isi komentar terlebih dahulu sebelum mengirim.');
      return;
    }

    setIsCommentSending(true);
    setErrorMessage(null);

    try {
      await ForumService.createComment({
        postId,
        parentId: replyTarget?.id ?? null,
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: resolveAvatar(user.photoURL, fallbackAdminAvatar),
        authorBadge: user.role,
        text: commentText.trim(),
      });

      setCommentText('');
      setReplyTarget(null);
      setInfoMessage('Komentar berhasil dikirim.');
    } catch (error) {
      console.error('Failed to create comment', error);
      setErrorMessage('Gagal mengirim komentar. Coba lagi nanti.');
    } finally {
      setIsCommentSending(false);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyTarget(comment);
    composerRef.current?.scrollIntoView({ behavior: 'smooth' });
    textareaRef.current?.focus();
  };

  const handlePostDeleted = () => {
    router.push('/admin/forum');
  };

  const commentPlaceholder = replyTarget
    ? `Balas ${replyTarget.authorName}...`
    : 'Tuliskan tanggapan atau pertanyaan Anda...';

  const createdAt = useMemo(() => (post ? formatTimestamp(post.createdAt) : ''), [post]);

  if (loading || isPostLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span className="text-sm">Memuat detail postingan...</span>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (!post) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center text-foreground">
        <h1 className="text-2xl font-semibold">Postingan tidak ditemukan</h1>
        <p className="max-w-md text-sm text-foreground/70">
          Kemungkinan postingan sudah dihapus atau tautan kurang tepat. Kembali ke forum admin untuk melihat diskusi terbaru.
        </p>
        <Button intent="secondary" href="/admin/forum">
          Kembali ke Forum Admin
        </Button>
      </div>
    );
  }

  const isAdminView = user.role === 'admin';

  const threadStats = [
    { label: 'Dibuat pada', value: createdAt },
    { label: 'Jumlah komentar', value: `${post.commentsCount}` },
    { label: 'Total suka', value: `${post.likesCount}` },
    { label: 'Total tidak suka', value: `${post.dislikesCount}` },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="mx-auto w-full max-w-3xl border-x border-border/60 bg-background/85 shadow-sm">
        <header className="sticky top-[72px] z-10 flex items-center justify-between border-b border-border/60 bg-background/90 px-6 py-4 backdrop-blur">
          <Button intent="secondary" size="sm" href="/admin/forum">
            Kembali
          </Button>
          <span className="text-sm font-semibold text-foreground/80">Detail Postingan</span>
          <div className="w-[74px]" aria-hidden />
        </header>

        <section className="border-b border-border/60 px-6 py-6">
          <PostCard
            post={post}
            currentVote={postVote}
            onVote={handlePostVote}
            onComment={handleScrollToComposer}
            isVotePending={isPostVotePending}
            currentUserId={user.uid}
            isAdminView={isAdminView}
            onDelete={handlePostDeleted}
            hideDetailLink
          />
        </section>

        <section ref={composerRef} className="border-b border-border/60 px-6 py-6">
          {(errorMessage || infoMessage) && (
            <div
              className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
                errorMessage
                  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {errorMessage ?? infoMessage}
            </div>
          )}

          {replyTarget && (
            <div className="mb-3 flex items-center justify-between rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-medium text-accent">
              <span>Membalas {replyTarget.authorName}</span>
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                className="text-[11px] font-semibold uppercase tracking-[0.2em] hover:underline"
              >
                Batal
              </button>
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              ref={textareaRef}
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder={commentPlaceholder}
              className="h-28 w-full resize-none rounded-2xl border border-border/70 bg-muted/15 px-4 py-3 text-sm text-foreground/80 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-foreground/60">
                Berikan tanggapan bernas dan sertakan temuan lapangan yang mendukung keputusan moderasi.
              </p>
              <Button type="submit" intent="primary" size="sm" disabled={isCommentSending}>
                {isCommentSending ? 'Mengirim...' : 'Kirim Komentar'}
              </Button>
            </div>
          </form>
        </section>

        <section className="border-b border-border/60 px-6 py-6">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Tanggapan Komunitas</h2>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">
                {comments.length} komentar
              </p>
            </div>
          </header>

          {comments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 py-12 text-center text-sm text-foreground/60">
              Belum ada komentar. Jadilah yang pertama membalas postingan ini.
            </div>
          ) : (
            <CommentTree
              comments={comments}
              currentUserVotes={commentVotes}
              onVote={handleCommentVote}
              onReply={handleReply}
              isVotePendingIds={pendingCommentVoteIds}
            />
          )}
        </section>

        <section className="px-6 py-6">
          <header className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Ringkasan Moderasi</h2>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">
              Insight untuk admin
            </p>
          </header>

          <div className="grid gap-3 sm:grid-cols-2">
            {threadStats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-border/70 bg-background/90 px-4 py-4 text-sm text-foreground/70"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-foreground/50">{stat.label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{stat.value}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 space-y-2 rounded-2xl border border-border/70 bg-muted/15 px-5 py-4 text-sm text-foreground/70">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">Tips Etika Diskusi</h3>
            <ul className="space-y-2">
              {moderationTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
