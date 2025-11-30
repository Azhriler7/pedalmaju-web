"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Post, Vote as VoteType, User } from "@/types"; // 1. Import User type
import PostCard from "./PostCard";
import ForumService from "../services/ForumService";

type FeedFilter = { type: "tag" | "author"; value: string } | null;

interface FeedProps {
    user: User | null; // 2. Ubah props dari ID string menjadi User object
    limit?: number;
    onComment?: (post: Post) => void;
    isAdminView?: boolean;
    filter?: FeedFilter;
    onPostsLoaded?: (posts: Post[]) => void;
    onTagClick?: (tag: string) => void;
}

const normalizeTag = (tag: string) => tag.trim().replace(/^#/, "").toLowerCase();

const Feed: React.FC<FeedProps> = ({
    user, // Menggunakan object user lengkap
    limit = 25,
    onComment,
    isAdminView = false,
    filter = null,
    onPostsLoaded,
    onTagClick,
}) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userVotes, setUserVotes] = useState<Record<string, VoteType["type"] | null>>({});
    const [votePendingId, setVotePendingId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Subscribe to Posts
    useEffect(() => {
        const unsubscribe = ForumService.subscribeToPosts((nextPosts: Post[]) => {
            setPosts(nextPosts);
            setIsLoading(false);
        }, limit);

        return () => unsubscribe();
    }, [limit]);

    // Fetch User Votes
    useEffect(() => {
        if (!user || posts.length === 0) return;

        let isActive = true;

        const fetchVotes = async () => {
            try {
                const entries = await Promise.all(
                    posts.map(async (post) => {
                        // Service ini masih pakai ID string, aman
                        const vote = await ForumService.getUserVoteForPost(post.id, user.uid);
                        return [post.id, vote] as const;
                    })
                );
                if (isActive) {
                    setUserVotes(Object.fromEntries(entries));
                }
            } catch (error) {
                console.error("Failed to fetch votes", error);
            }
        };

        fetchVotes();

        return () => {
            isActive = false;
        };
    }, [posts, user]);

    // Callback loaded
    useEffect(() => {
        onPostsLoaded?.(posts);
    }, [posts, onPostsLoaded]);

    // Filtering Logic
    const filteredPosts = useMemo(() => {
        if (!filter) return posts;
        
        if (filter.type === "tag") {
            const target = normalizeTag(filter.value);
            return posts.filter((post) => {
                const tags = Array.isArray(post.tags) ? post.tags : [];
                return tags.some((tag) => normalizeTag(tag) === target);
            });
        }
        
        // Filter by Author Name
        const target = filter.value.toLowerCase();
        return posts.filter((post) => post.authorName?.toLowerCase().includes(target));
    }, [posts, filter]);

    // Handle Vote (PERBAIKAN UTAMA DISINI)
    const handleVote = async (postId: string, type: VoteType["type"]) => {
        if (!user) return; // Guard clause jika user belum login

        setVotePendingId(postId);
        setErrorMessage("");
        
        try {
            // 3. Buat object Actor
            const actor = {
                uid: user.uid,
                displayName: user.displayName || 'Pengguna',
                photoURL: user.photoURL || ''
            };

            // 4. Kirim object actor ke service
            const nextVote = await ForumService.togglePostVote(postId, actor, type);
            
            setUserVotes((prev) => ({
                ...prev,
                [postId]: nextVote,
            }));
        } catch (error) {
            console.error("Failed to vote", error);
            setErrorMessage("Tidak dapat memproses voting saat ini. Coba lagi nanti.");
        } finally {
            setVotePendingId(null);
        }
    };

    const handlePostDeleted = (postId: string) => {
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        setUserVotes((prev) => {
            const updated = { ...prev };
            delete updated[postId];
            return updated;
        });
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-foreground/60">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm">Memuat timeline komunitas...</span>
            </div>
        );
    }

    if (filteredPosts.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-8 py-12 text-center text-sm text-foreground/60">
                {filter ? "Tidak ada posting yang cocok dengan pencarian." : "Belum ada posting di timeline. Mulai percakapan pertama Anda!"}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {errorMessage && (
                <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {errorMessage}
                </div>
            )}

            {filteredPosts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    currentVote={userVotes[post.id] ?? null}
                    onVote={handleVote}
                    onComment={onComment}
                    isVotePending={votePendingId === post.id}
                    currentUserId={user?.uid} // Ambil UID dari object user
                    isAdminView={isAdminView}
                    isAdmin={user?.role === 'admin'}
                    onDelete={handlePostDeleted}
                    onTagClick={onTagClick}
                />
            ))}
        </div>
    );
};

export default Feed;