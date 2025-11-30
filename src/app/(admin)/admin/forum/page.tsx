'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, PlusCircle, Search, UploadCloud, X, Tag as TagIcon, User as UserIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Feed from '@/features/forum/components/ForumFeed';
import ForumService from '@/features/forum/services/ForumService';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useAuth } from '@/hooks/useAuth';
import type { Post } from '@/types';

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

const moderationStats = [
  { label: 'Laporan aktif', value: '12', detail: '+4 dibanding kemarin' },
  { label: 'Posting terhapus', value: '5', detail: '24 jam terakhir' },
  { label: 'Pengguna diawasi', value: '3', detail: 'Butuh follow-up mentor' },
];

const priorityFlags = [
  {
    title: 'Periksa topik sensor pH',
    description: 'Diskusi ramai, pastikan moderasi tetap sopan.',
  },
  {
    title: 'Verifikasi foto panen baru',
    description: 'Pastikan sesuai panduan dokumentasi komunitas.',
  },
  {
    title: 'Sesi tanya jawab mingguan',
    description: 'Siapkan highlight untuk newsletter komunitas.',
  },
];

type TimelineFilter = {
  type: 'tag' | 'author';
  value: string;
  label: string;
};

const normalizeTag = (tag: string) => tag.trim().replace(/^#/, '').replace(/\s+/g, '').toLowerCase();

const extractTagsFromContent = (content: string): string[] => {
  const matches = content.match(/#[a-z0-9_]+/gi) ?? [];
  return matches.map(normalizeTag).filter(Boolean);
};

export default function AdminForum() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const timelineEndRef = useRef<HTMLDivElement | null>(null);

  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<TimelineFilter | null>(null);

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);

  const [feedLimit, setFeedLimit] = useState(30);
  const [latestPostCount, setLatestPostCount] = useState(0);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [loading, user, router]);

  useEffect(() => {
    const tagSet = new Set<string>();
    const authorSet = new Set<string>();

    allPosts.forEach((post) => {
      const postTags = Array.isArray(post.tags) ? post.tags : [];
      postTags.forEach((tag) => {
        const normalized = normalizeTag(tag);
        if (normalized) {
          tagSet.add(normalized);
        }
      });

      if (post.authorName) {
        authorSet.add(post.authorName);
      }
    });

    setAvailableTags(Array.from(tagSet));
    setAvailableAuthors(Array.from(authorSet));
  }, [allPosts]);

  useEffect(() => {
    const sentinel = timelineEndRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFeedLimit((previous) => {
              if (latestPostCount < previous) {
                return previous;
              }
              return previous + 10;
            });
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [latestPostCount]);

  useEffect(() => {
    return () => {
      if (attachmentPreview) {
        URL.revokeObjectURL(attachmentPreview);
      }
    };
  }, [attachmentPreview]);

  useEffect(() => {
    if (!activeFilter) {
      return;
    }
    setFeedLimit(30);
  }, [activeFilter]);

  useEffect(() => {
    if (!successMessage) return;
    const timeout = setTimeout(() => setSuccessMessage(null), 3200);
    return () => clearTimeout(timeout);
  }, [successMessage]);

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [] as TimelineFilter[];

    const matchedTags = availableTags
      .filter((tag) => tag.includes(term))
      .slice(0, 5)
      .map<TimelineFilter>((tag) => ({
        type: 'tag',
        value: tag,
        label: `#${tag}`,
      }));

    const matchedAuthors = availableAuthors
      .filter((name) => name.toLowerCase().includes(term))
      .slice(0, 5)
      .map<TimelineFilter>((name) => ({
        type: 'author',
        value: name,
        label: name,
      }));

    return [...matchedTags, ...matchedAuthors];
  }, [searchTerm, availableTags, availableAuthors]);

  const handleAddTag = (raw: string) => {
    const normalized = normalizeTag(raw);
    if (!normalized || tags.includes(normalized)) {
      setTagInput('');
      return;
    }
    if (tags.length >= 5) {
      setErrorMessage('Maksimal 5 tagar per postingan.');
      return;
    }
    setTags((previous) => [...previous, normalized]);
    setTagInput('');
    setErrorMessage(null);
  };

  const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((previous) => previous.filter((item) => item !== tag));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setAttachment(file);
    const preview = URL.createObjectURL(file);
    setAttachmentPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return preview;
    });
    setErrorMessage(null);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return null;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSearchResultClick = (result: TimelineFilter) => {
    setActiveFilter(result.type === 'tag' ? { ...result, value: normalizeTag(result.value) } : result);
    setSearchTerm('');
  };

  const clearFilter = () => {
    setActiveFilter(null);
    setSearchTerm('');
  };

  const handlePostsLoaded = (posts: Post[]) => {
    setAllPosts(posts);
    setLatestPostCount(posts.length);
  };

  const handleTimelineTagClick = (tag: string) => {
    const normalized = normalizeTag(tag);
    if (!normalized) return;
    setActiveFilter({ type: 'tag', value: normalized, label: `#${normalized}` });
    setSearchTerm('');
  };

  const handleScrollToComposer = () => {
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || user.role !== 'admin') {
      setErrorMessage('Hanya admin yang dapat mempublikasikan pengumuman.');
      return;
    }

    if (!content.trim()) {
      setErrorMessage('Tulisan tidak boleh kosong.');
      return;
    }

    setIsPosting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let uploadedImageUrl: string | undefined;
      if (attachment) {
        uploadedImageUrl = await uploadToCloudinary(attachment, 'forum');
      }

      const contentTags = extractTagsFromContent(content);
      const normalizedTags = Array.from(new Set([...tags, ...contentTags]));

      await ForumService.createPost({
        authorId: user.uid,
        authorName: user.displayName ?? 'Admin PedalMaju',
        authorPhoto: resolveAvatar(user.photoURL, fallbackAdminAvatar),
        authorBadge: user.role,
        content: content.trim(),
        imageUrl: uploadedImageUrl,
        tags: normalizedTags,
      });

      setContent('');
      setTags([]);
      setTagInput('');
      if (attachment || attachmentPreview) {
        handleRemoveAttachment();
      }
      setSuccessMessage('Pengumuman berhasil dipublikasikan ke timeline.');
    } catch (error) {
      console.error('Failed to publish announcement', error);
      setErrorMessage('Gagal mempublikasikan pengumuman. Coba lagi beberapa saat.');
    } finally {
      setIsPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span className="text-sm">Memuat panel moderasi...</span>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const adminName = user.displayName ?? 'Admin PedalMaju';
  const adminAvatar = resolveAvatar(user.photoURL, fallbackAdminAvatar);
  const composerPlaceholder =
    'Kirim pengumuman komunitas, klarifikasi kebijakan, atau highlight diskusi yang perlu diperhatikan...';
  const canLoadMore = latestPostCount >= feedLimit;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <section className="mx-auto w-full max-w-6xl px-4 pt-12 pb-8">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-r from-accent/15 via-accent/8 to-transparent p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center rounded-full border border-accent/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
                Panel Moderasi
              </span>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Seimbangkan percakapan komunitas dan soroti wawasan terbaik.
              </h1>
              <p className="max-w-2xl text-sm text-foreground/70">
                Manfaatkan panel ini untuk mengoordinasikan pengumuman resmi, menindaklanjuti laporan, dan menjaga interaksi tetap sehat. Semua aktivitas terbaru akan muncul pada timeline sehingga keputusan moderasi bisa segera dijalankan.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {moderationStats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-2xl border border-border/60 bg-background/90 p-4 text-sm shadow-sm"
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/50">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-accent">{stat.value}</p>
                    <p className="text-[11px] text-foreground/60">{stat.detail}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-3xl border border-border/60 bg-background/95 p-6 text-sm shadow-inner">
              <div className="flex items-center gap-4">
                <Image
                  src={adminAvatar}
                  alt={adminName}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border border-border object-cover"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/50">Moderator Aktif</p>
                  <p className="text-base font-semibold text-foreground">{adminName}</p>
                  <p className="text-xs text-foreground/60">Kelola percakapan dan beri highlight terbaik.</p>
                </div>
              </div>
              <p className="rounded-2xl border border-border/50 bg-muted/20 px-4 py-3 text-xs text-foreground/60">
                Pengingat cepat: pastikan postingan dengan tag program unggulan mendapat balasan tim dalam 12 jam.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl gap-6 px-4 pb-20 lg:grid lg:grid-cols-[0.34fr_0.66fr]">
        <aside
          ref={composerRef}
          className="mb-10 space-y-6 rounded-3xl border border-border/60 bg-background/85 p-6 shadow-sm lg:sticky lg:top-28 lg:mb-0"
        >
          <header className="flex items-center gap-3">
            <Image
              src={adminAvatar}
              alt={adminName}
              width={52}
              height={52}
              className="h-12 w-12 rounded-full border border-border object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">{adminName}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Moderasi komunitas</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={composerPlaceholder}
              className="min-h-[120px] w-full resize-none rounded-3xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-foreground/80 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-accent transition-colors hover:text-accent/70"
                      aria-label={`Hapus tagar ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Tambah tagar (contoh: #moderasi)"
                className="flex-1 rounded-2xl border border-border/60 bg-muted/15 px-4 py-2 text-sm text-foreground/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <Button
                type="button"
                intent="secondary"
                size="sm"
                onClick={() => handleAddTag(tagInput)}
                disabled={!tagInput.trim()}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} /> Tambah
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    intent="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <UploadCloud size={16} /> Unggah gambar
                  </Button>
                  {attachment && (
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/60 transition-colors hover:text-accent"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <Button type="submit" intent="primary" size="sm" disabled={isPosting}>
                  {isPosting ? 'Mengirim...' : 'Publikasikan'}
                </Button>
              </div>

              {attachmentPreview && (
                <div className="relative min-h-[180px] overflow-hidden rounded-3xl border border-border/70 bg-muted/20">
                  <Image
                    src={attachmentPreview}
                    alt="Pratinjau lampiran"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground/70 shadow hover:text-accent"
                    aria-label="Hapus gambar"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {(errorMessage || successMessage) && (
              <div
                className={`rounded-2xl border px-4 py-2 text-xs ${
                  errorMessage
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                {errorMessage ?? successMessage}
              </div>
            )}
          </form>

          <section className="space-y-3 rounded-3xl border border-border/60 bg-background/95 p-5 text-sm text-foreground/70">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">Fokus Moderasi</h2>
            <ul className="space-y-2">
              {priorityFlags.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-border/60 bg-muted/15 px-4 py-3 transition-colors hover:border-accent/60 hover:bg-muted/25"
                >
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-foreground/60">{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <section className="space-y-6 rounded-3xl border border-border/60 bg-background/80 shadow-sm">
          <div className="sticky top-[84px] z-20 space-y-3 border-b border-border/60 bg-background/90 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">
                  <Search size={16} />
                </span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari tagar komunitas atau nama anggota"
                  className="w-full rounded-full border border-border/60 bg-muted/15 py-2 pl-9 pr-4 text-sm text-foreground/80 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              {activeFilter && (
                <Button type="button" intent="secondary" size="sm" onClick={clearFilter} className="flex items-center gap-2">
                  <X size={14} /> Reset
                </Button>
              )}
            </div>

            {searchTerm && (
              <div className="space-y-2 rounded-2xl border border-border/60 bg-background/95 p-3 text-sm text-foreground/70 shadow-sm">
                {searchResults.length === 0 ? (
                  <p className="text-xs text-foreground/50">Tidak ada hasil untuk &quot;{searchTerm}&quot;.</p>
                ) : (
                  <ul className="space-y-2">
                    {searchResults.map((result) => (
                      <li key={`${result.type}-${result.value}`}>
                        <button
                          type="button"
                          onClick={() => handleSearchResultClick(result)}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-foreground/80 transition-colors hover:bg-muted/20"
                        >
                          {result.type === 'tag' ? (
                            <TagIcon size={16} className="text-accent" />
                          ) : (
                            <UserIcon size={16} className="text-accent" />
                          )}
                          <span>{result.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeFilter && (
              <div className="flex items-center gap-2 text-xs text-foreground/60">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-semibold uppercase tracking-[0.25em] text-accent">
                  {activeFilter.label}
                </span>
                <button
                  type="button"
                  onClick={clearFilter}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em] transition-colors hover:text-accent"
                >
                  <X size={10} /> Hapus filter
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6 px-4 pb-10 pt-6">
            <Feed
              currentUserId={user.uid}
              limit={feedLimit}
              onComment={handleScrollToComposer}
              filter={activeFilter ? { type: activeFilter.type, value: activeFilter.value } : null}
              onPostsLoaded={handlePostsLoaded}
              onTagClick={handleTimelineTagClick}
              isAdminView
            />

            <div ref={timelineEndRef} className="flex items-center justify-center py-6 text-sm text-foreground/60">
              {canLoadMore ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memuat postingan lain...</span>
                </div>
              ) : (
                <span>Sudah mencapai akhir timeline.</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
