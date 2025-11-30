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

const fallbackAvatar =
  'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80';

const resolveAvatar = (photoUrl: string | null | undefined, fallback: string): string => {
  if (typeof photoUrl === 'string') {
    const trimmed = photoUrl.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return fallback;
};

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

export default function UserForum() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);

  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<TimelineFilter | null>(null);

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);

  const [feedLimit, setFeedLimit] = useState(20);
  const [latestPostCount, setLatestPostCount] = useState(0);

  const timelineEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const nextTags = new Set<string>();
    const nextAuthors = new Set<string>();

    allPosts.forEach((post) => {
      const postTags = Array.isArray(post.tags) ? post.tags : [];
      postTags.forEach((tag) => {
        const normalized = normalizeTag(tag);
        if (normalized) {
          nextTags.add(normalized);
        }
      });

      if (post.authorName) {
        nextAuthors.add(post.authorName);
      }
    });

    setAvailableTags(Array.from(nextTags));
    setAvailableAuthors(Array.from(nextAuthors));
  }, [allPosts]);

  useEffect(() => {
    const sentinel = timelineEndRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFeedLimit((prev) => {
              if (latestPostCount < prev) {
                return prev;
              }
              return prev + 10;
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
    setFeedLimit(20);
  }, [activeFilter]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 3200);
    return () => clearTimeout(timer);
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
    setTags((prev) => [...prev, normalized]);
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
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setAttachment(file);
    const previewUrl = URL.createObjectURL(file);
    setAttachmentPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return previewUrl;
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

    if (!user) {
      router.push('/login');
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
        authorName: user.displayName ?? 'Pengguna PedalMaju',
        authorPhoto: resolveAvatar(user.photoURL, fallbackAvatar),
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
      setSuccessMessage('Postingan berhasil dibagikan.');
    } catch (error) {
      console.error('Failed to create post', error);
      setErrorMessage('Gagal membagikan postingan. Coba lagi beberapa saat.');
    } finally {
      setIsPosting(false);
    }
  };

  const avatarSrc = resolveAvatar(user?.photoURL, fallbackAvatar);
  const displayName = user?.displayName || 'Anggota PedalMaju';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span className="text-sm">Memuat forum komunitas...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const canLoadMore = latestPostCount >= feedLimit;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="mx-auto w-full max-w-6xl gap-8 px-4 pb-20 pt-10 lg:grid lg:grid-cols-[0.28fr_0.72fr]">
        <aside ref={composerRef} className="mb-10 space-y-6 rounded-3xl border border-border/60 bg-background/85 p-6 shadow-sm lg:sticky lg:top-24 lg:mb-0 lg:h-fit">
          <header className="flex items-center gap-3">
            <Image
              src={avatarSrc}
              alt={displayName}
              width={52}
              height={52}
              className="h-12 w-12 rounded-full border border-border object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">{displayName}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Bagikan kabar terbaru</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Tulis kabar, pertanyaan, atau insight untuk komunitas..."
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
                placeholder="Tambah tagar (contoh: #iot)"
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
                  {isPosting ? 'Mengirim...' : 'Bagikan'}
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
        </aside>

        <section className="space-y-6 rounded-3xl border border-border/60 bg-background/80 shadow-sm">
          <div className="sticky top-[72px] z-20 space-y-3 border-b border-border/60 bg-background/90 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">
                  <Search size={16} />
                </span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari tagar atau nama pengguna"
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
                  <p className="text-xs text-foreground/50">Tidak ada hasil untuk &ldquo;{searchTerm}&rdquo;.</p>
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
              onComment={() => handleScrollToComposer()}
              filter={activeFilter ? { type: activeFilter.type, value: activeFilter.value } : null}
              onPostsLoaded={handlePostsLoaded}
              onTagClick={handleTimelineTagClick}
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
