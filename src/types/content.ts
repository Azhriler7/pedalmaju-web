export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  publishedAt: string;
  authorId: string;
};

export type Thread = {
  id: string;
  title: string;
  authorId: string;
  excerpt: string;
  createdAt: string;
  replyCount: number;
};

export type ThreadReply = {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  createdAt: string;
};
