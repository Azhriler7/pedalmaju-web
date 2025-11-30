'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Loader2,
  LogOut,
  MoreVertical,
  PlusCircle,
  Search,
  UploadCloud,
  UserRound,
  X,
  Tag as TagIcon,
  User as UserIcon,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Feed from '@/features/forum/components/ForumFeed';
import ForumService from '@/features/forum/services/ForumService';
import { listenToOnlineUsers } from '@/features/users/services/UserService';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/features/auth/services/AuthService';
import { getUnreadCount } from '@/features/notifications/services/NotificationService';
import type { Post, User } from '@/types';

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

  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [isOnlineLoading, setIsOnlineLoading] = useState(true);

  const [feedLimit, setFeedLimit] = useState(20);
  const [latestPostCount, setLatestPostCount] = useState(0);

  const timelineEndRef = useRef<HTMLDivElement | null>(null);
  const fabRef = useRef<HTMLDivElement | null>(null);

  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const unsubscribe = listenToOnlineUsers((nextUsers) => {
      setOnlineUsers(nextUsers);
      setIsOnlineLoading(false);
    });

    return () => {
      setOnlineUsers([]);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) {
        setUnreadCount(0);
        return;
      }
      try {
        const count = await getUnreadCount(user.uid);
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch unread count', error);
        setUnreadCount(0);
      }
    };
    fetchUnreadCount();
  }, [user]);

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

  const trimmedSearchTerm = searchTerm.trim();
  const shouldShowSearchResults =
    trimmedSearchTerm.length > 0 || ((isSearchInputFocused || isSearchHovered) && searchResults.length > 0);

  const recommendedTags = useMemo(() => {
    if (availableTags.length === 0) {
      return [] as string[];
    }
    return [...availableTags]
      .sort((a, b) => a.localeCompare(b, 'id'))
      .slice(0, 5);
  }, [availableTags]);

  useEffect(() => {
    if (!isFabOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!fabRef.current) return;
      if (!fabRef.current.contains(event.target as Node)) {
        setIsFabOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFabOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFabOpen]);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchResultClick = (result: TimelineFilter) => {
    setActiveFilter(result.type === 'tag' ? { ...result, value: normalizeTag(result.value) } : result);
    setSearchTerm('');
    setIsSearchHovered(false);
    setIsSearchInputFocused(false);
  };

  const clearFilter = () => {
    setActiveFilter(null);
    setSearchTerm('');
    setIsSearchHovered(false);
    setIsSearchInputFocused(false);
  };

  const handleRecommendedTagClick = (tag: string) => {
    const normalized = normalizeTag(tag);
    if (!normalized) return;
    setActiveFilter({ type: 'tag', value: normalized, label: `#${normalized}` });
    setSearchTerm('');
    setIsSearchHovered(false);
    setIsSearchInputFocused(false);
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

  const toggleFab = () => {
    setIsFabOpen((previous) => !previous);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/');
  };

  const handleNavigateProfile = () => {
    if (!user) return;
    router.push(`/profile/${user.uid}`);
    setIsFabOpen(false);
  };

  const handleNavigateNotifications = () => {
    router.push('/notification');
    setIsFabOpen(false);
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
      <div className="mx-auto w-full max-w-7xl px-4 pb-28 pt-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)_minmax(220px,280px)]">
          <aside
            ref={composerRef}
            className="mb-10 space-y-6 rounded-3xl border border-border/60 bg-background/85 p-6 shadow-sm lg:sticky lg:top-24 lg:mb-0 lg:h-fit"
          >
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

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Tambah tagar (contoh: #iot)"
                className="w-full rounded-2xl border border-border/60 bg-muted/15 px-4 py-2 text-sm text-foreground/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:flex-1"
              />
              <Button
                type="button"
                intent="secondary"
                size="sm"
                onClick={() => handleAddTag(tagInput)}
                disabled={!tagInput.trim()}
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
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

          <div className="mt-6 rounded-3xl border border-border/50 bg-background/95 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground/70">
                  User Online
                </p>
              </div>
              {onlineUsers.length > 0 && (
                <span className="text-xs font-medium text-foreground/50">{onlineUsers.length}</span>
              )}
            </div>

            {isOnlineLoading ? (
              <div className="flex min-h-[96px] items-center justify-center text-foreground/40">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : onlineUsers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center text-xs text-foreground/50">
                Belum ada anggota yang online sekarang.
              </div>
            ) : (
              <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {onlineUsers.map((onlineUser) => (
                  <div key={onlineUser.uid} className="flex items-center gap-3 rounded-2xl border border-transparent bg-muted/10 px-3 py-2 transition hover:border-accent/40">
                    <div className="relative h-10 w-10">
                      <Image
                        src={resolveAvatar(onlineUser.photoURL, fallbackAvatar)}
                        alt={onlineUser.displayName}
                        fill
                        className="rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {onlineUser.displayName || 'Anggota PedalMaju'}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/50">
                        {onlineUser.role === 'admin' ? 'Admin' : 'Petani'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </aside>

          <section className="rounded-3xl border border-border/60 bg-background/95 px-4 py-6 shadow-sm sm:px-6">
            <div className="sticky top-20 z-30 space-y-3 bg-background/95 pb-3 sm:top-24">
              <header className="flex flex-col gap-2 border-b border-border/60 pb-4">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Forum Petani</h1>
                <p className="text-sm text-foreground/60">Pantau diskusi terbaru dari komunitas dan bagikan pengalaman Anda.</p>
              </header>

              {activeFilter && (
                <div className="flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 shadow-sm">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                    <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-semibold uppercase tracking-[0.25em] text-accent">
                      {activeFilter.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearFilter}
                    className="text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/60 transition-colors hover:text-accent"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-6 pb-10 pt-4">
              <Feed
                user={user}
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

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-border/60 bg-background/95 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Cari percakapan</p>
                {trimmedSearchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setIsSearchHovered(false);
                      setIsSearchInputFocused(false);
                    }}
                    className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground/50 transition-colors hover:text-accent"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div
                className="relative mt-4"
                onMouseEnter={() => setIsSearchHovered(true)}
                onMouseLeave={() => setIsSearchHovered(false)}
              >
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/15 px-4 py-2 text-sm text-foreground/80 shadow-inner transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
                  <Search size={16} className="text-foreground/50" />
                  <input
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchInputFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchInputFocused(false), 120)}
                    placeholder="Cari tagar atau akun"
                    className="w-full bg-transparent text-sm text-foreground/80 placeholder:text-foreground/40 focus:outline-none"
                  />
                  {trimmedSearchTerm.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setIsSearchHovered(false);
                        setIsSearchInputFocused(false);
                      }}
                      className="text-foreground/50 transition-colors hover:text-accent"
                      aria-label="Bersihkan pencarian"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {shouldShowSearchResults && (
                  <div className="absolute left-0 right-0 z-30 mt-2 rounded-2xl border border-border/60 bg-background/95 p-3 shadow-xl">
                    {searchResults.length === 0 ? (
                      <p className="text-xs text-foreground/50">Tidak ada hasil untuk &ldquo;{trimmedSearchTerm}&rdquo;.</p>
                    ) : (
                      <ul className="space-y-1">
                        {searchResults.map((result) => (
                          <li key={`${result.type}-${result.value}`}>
                            <button
                              type="button"
                              onClick={() => handleSearchResultClick(result)}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-muted/20"
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
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground/50">Tagar rekomendasi</p>
                {recommendedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {recommendedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleRecommendedTagClick(tag)}
                        className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent transition-colors hover:border-accent hover:bg-accent/20"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-foreground/50">Belum ada tagar.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div ref={fabRef} className="fixed bottom-8 right-6 z-40">
        <div
          className={`flex flex-col items-end gap-3 transition-all duration-200 ${
            isFabOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
          }`}
        >
          <div className="relative">
            <Button
              type="button"
              size="sm"
              intent="secondary"
              onClick={handleNavigateNotifications}
              className="rounded-full border-border/60 bg-background/95 px-4 py-2 text-sm text-foreground shadow"
              icon={<Bell size={16} />}
            >
              Notifikasi
            </Button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            intent="secondary"
            onClick={handleNavigateProfile}
            className="rounded-full border-border/60 bg-background/95 px-4 py-2 text-sm text-foreground shadow"
            icon={<UserRound size={16} />}
          >
            Profil
          </Button>
          <Button
            type="button"
            size="sm"
            intent="logout"
            onClick={async () => {
              setIsFabOpen(false);
              await handleLogout();
            }}
            className="rounded-full border-border/60 bg-background/95 px-4 py-2 text-sm shadow"
            icon={<LogOut size={16} />}
          >
            Logout
          </Button>
        </div>
        <button
          type="button"
          onClick={toggleFab}
          className="mt-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg transition hover:bg-accent/90"
          aria-expanded={isFabOpen}
          aria-label="Menu tindakan cepat"
        >
          <MoreVertical size={20} />
        </button>
      </div>
    </main>
  );
}
