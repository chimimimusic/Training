import { eq, desc, and, or, like, sql, isNull } from 'drizzle-orm';
import { getDb } from './db';
import { discussionTopics, discussionReplies, discussionLikes, users } from '../drizzle/schema';

export async function getAllTopics(filters?: {
  category?: string;
  moduleId?: number;
  search?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  let query = db
    .select({
      topic: discussionTopics,
      author: {
        id: users.id,
        name: users.name,
        role: users.role,
        profileImageUrl: users.profileImageUrl,
      },
    })
    .from(discussionTopics)
    .leftJoin(users, eq(discussionTopics.authorId, users.id))
    .$dynamic();
  
  const conditions = [];
  
  if (filters?.category) {
    conditions.push(eq(discussionTopics.category, filters.category as any));
  }
  
  if (filters?.moduleId) {
    conditions.push(eq(discussionTopics.moduleId, filters.moduleId));
  }
  
  if (filters?.search) {
    conditions.push(
      or(
        like(discussionTopics.title, `%${filters.search}%`),
        like(discussionTopics.content, `%${filters.search}%`)
      )!
    );
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)!);
  }
  
  const results = await query
    .orderBy(desc(discussionTopics.isPinned), desc(discussionTopics.lastActivityAt));
  
  return results.map((r: any) => ({
    ...r.topic,
    author: r.author,
  }));
}

export async function getTopicById(topicId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const results = await db
    .select({
      topic: discussionTopics,
      author: {
        id: users.id,
        name: users.name,
        role: users.role,
        profileImageUrl: users.profileImageUrl,
      },
    })
    .from(discussionTopics)
    .leftJoin(users, eq(discussionTopics.authorId, users.id))
    .where(eq(discussionTopics.id, topicId));
  
  if (results.length === 0) return null;
  
  const result = results[0];
  return {
    ...result.topic,
    author: result.author,
  };
}

export async function createTopic(data: {
  title: string;
  content: string;
  category: string;
  moduleId?: number;
  authorId: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const [newTopic] = await db.insert(discussionTopics).values({
    title: data.title,
    content: data.content,
    category: data.category as any,
    moduleId: data.moduleId || null,
    authorId: data.authorId,
    lastActivityAt: new Date(),
  });
  
  return newTopic;
}

export async function updateTopic(topicId: number, data: {
  isPinned?: boolean;
  isLocked?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  await db.update(discussionTopics)
    .set(data)
    .where(eq(discussionTopics.id, topicId));
}

export async function deleteTopic(topicId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  // Delete all replies first
  await db.delete(discussionReplies).where(eq(discussionReplies.topicId, topicId));
  
  // Delete all likes
  await db.delete(discussionLikes).where(eq(discussionLikes.topicId, topicId));
  
  // Delete topic
  await db.delete(discussionTopics).where(eq(discussionTopics.id, topicId));
}

export async function incrementTopicViews(topicId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  await db.update(discussionTopics)
    .set({ viewCount: sql`${discussionTopics.viewCount} + 1` })
    .where(eq(discussionTopics.id, topicId));
}

export async function getTopicReplies(topicId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const results = await db
    .select({
      reply: discussionReplies,
      author: {
        id: users.id,
        name: users.name,
        role: users.role,
        profileImageUrl: users.profileImageUrl,
      },
    })
    .from(discussionReplies)
    .leftJoin(users, eq(discussionReplies.authorId, users.id))
    .where(eq(discussionReplies.topicId, topicId))
    .orderBy(discussionReplies.createdAt);
  
  return results.map((r: any) => ({
    ...r.reply,
    author: r.author,
  }));
}

export async function createReply(data: {
  topicId: number;
  parentReplyId?: number;
  content: string;
  authorId: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const [newReply] = await db.insert(discussionReplies).values({
    topicId: data.topicId,
    parentReplyId: data.parentReplyId || null,
    content: data.content,
    authorId: data.authorId,
  });
  
  // Update topic reply count and last activity
  await db.update(discussionTopics)
    .set({
      replyCount: sql`${discussionTopics.replyCount} + 1`,
      lastActivityAt: new Date(),
    })
    .where(eq(discussionTopics.id, data.topicId));
  
  return newReply;
}

export async function deleteReply(replyId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  // Get reply to find topicId
  const replies = await db.select().from(discussionReplies).where(eq(discussionReplies.id, replyId));
  if (replies.length === 0) return;
  
  const reply = replies[0];
  
  // Delete likes for this reply
  await db.delete(discussionLikes).where(eq(discussionLikes.replyId, replyId));
  
  // Delete the reply
  await db.delete(discussionReplies).where(eq(discussionReplies.id, replyId));
  
  // Update topic reply count
  await db.update(discussionTopics)
    .set({ replyCount: sql`${discussionTopics.replyCount} - 1` })
    .where(eq(discussionTopics.id, reply.topicId));
}

export async function toggleLike(data: {
  userId: number;
  topicId?: number;
  replyId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const conditions = [eq(discussionLikes.userId, data.userId)];
  
  if (data.topicId) {
    conditions.push(eq(discussionLikes.topicId, data.topicId));
  }
  
  if (data.replyId) {
    conditions.push(eq(discussionLikes.replyId, data.replyId));
  }
  
  // Check if already liked
  const existing = await db.select()
    .from(discussionLikes)
    .where(and(...conditions)!);
  
  if (existing.length > 0) {
    // Unlike
    await db.delete(discussionLikes).where(and(...conditions)!);
    
    // Update like count
    if (data.replyId) {
      await db.update(discussionReplies)
        .set({ likeCount: sql`${discussionReplies.likeCount} - 1` })
        .where(eq(discussionReplies.id, data.replyId));
    }
    
    return { liked: false };
  } else {
    // Like
    await db.insert(discussionLikes).values({
      userId: data.userId,
      topicId: data.topicId || null,
      replyId: data.replyId || null,
    });
    
    // Update like count
    if (data.replyId) {
      await db.update(discussionReplies)
        .set({ likeCount: sql`${discussionReplies.likeCount} + 1` })
        .where(eq(discussionReplies.id, data.replyId));
    }
    
    return { liked: true };
  }
}

export async function getUserLikes(userId: number, topicId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const likes = await db.select()
    .from(discussionLikes)
    .where(
      and(
        eq(discussionLikes.userId, userId),
        or(
          eq(discussionLikes.topicId, topicId),
          isNull(discussionLikes.topicId)
        )!
      )!
    );
  
  return likes.map((like: any) => ({
    topicId: like.topicId,
    replyId: like.replyId,
  }));
}
