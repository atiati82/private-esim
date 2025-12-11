import { shuffleArray } from '@/lib/utils';
import { BlogPost } from '@/payload/app-types';
import { BlogPostCollectionId } from '@/payload/collections';
import { calculatePostMetrics } from '@/payload/utils/data-utils';
import { appGetPayload } from '@/payload/utils/get-payload';

interface GetRelatedPostsParams {
  currentPostSlug: string;
  blogTags: string[];
  blogCategories: string[];
  limit?: number;
  page?: number;
}

interface PaginatedPostsResponse {
  docs: BlogPost[];
  totalPages: number;
}

interface PaginatedDocs<T> {
  docs: T[];
  totalDocs: number;
}

export async function findPosts(
  page: number = 1,
  limit: number = 8,
): Promise<{ docs: BlogPost[]; totalPages: number }> {
  const payloadInstance = await appGetPayload();
  const posts = await payloadInstance.find({
    collection: BlogPostCollectionId,
    where: {
      _status: { equals: 'published' },
    },
    limit: limit,
    page: page,
  });
  return posts;
}

export async function findRelatedPosts({
  currentPostSlug,
  blogTags,
  blogCategories,
  limit = 3,
  page = 1,
}: GetRelatedPostsParams): Promise<PaginatedPostsResponse> {
  const payloadInstance = await appGetPayload();

  // Fetch posts with the same tags or categories & exclude current post
  const relatedPostsResponse = await payloadInstance.find({
    collection: BlogPostCollectionId,
    where: {
      slug: { not_in: [currentPostSlug] },
      _status: { equals: 'published' },
      $or: [{ tags: { in: blogTags } }, { categories: { in: blogCategories } }],
    },
    limit: limit,
    page: page,
  });

  const relatedPosts = relatedPostsResponse.docs;

  // If we don't have enough related posts, fetch some random posts
  let randomPosts: BlogPost[] = [];
  if (relatedPosts.length < limit) {
    const remainingLimit = limit - relatedPosts.length;

    // Fetch additional posts to pick randomly
    const additionalPostsResponse: PaginatedDocs<BlogPost> = await payloadInstance.find({
      collection: BlogPostCollectionId,
      where: {
        slug: { not_in: [currentPostSlug, ...relatedPosts.map((post) => post.id)] },
        _status: { equals: 'published' },
      },
      limit: remainingLimit * 5,
    });

    const additionalPosts = additionalPostsResponse.docs;

    const shuffledPosts = shuffleArray(additionalPosts);
    randomPosts = shuffledPosts.slice(0, remainingLimit);
  }

  return {
    docs: [...relatedPosts, ...randomPosts],
    totalPages: Math.ceil((relatedPostsResponse.totalDocs + (randomPosts.length || 0)) / limit),
  };
}

export async function findPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const payloadInstance = await appGetPayload();
  const res = await payloadInstance.find({
    collection: BlogPostCollectionId,
    where: { slug: { equals: slug } },
  });

  return res.docs[0];
}

export async function findTopPosts(
  metric: 'views' | 'shares' | 'metricsTopPostScore',
  currentPostSlug?: string,
  limit: number = 5,
): Promise<BlogPost[]> {
  const payloadInstance = await appGetPayload();

  const topMarkedPostsResult = await payloadInstance.find({
    collection: BlogPostCollectionId,
    where: {
      _status: { equals: 'published' },
      markAsTopPost: { equals: true },
      slug: { not_in: [currentPostSlug] },
    },
    sort: `-${metric}`,
    limit: limit,
  });

  const topMarkedPosts = topMarkedPostsResult.docs;
  const metricsTopPostsNeeded = limit - topMarkedPosts.length;

  let metricsTopPosts: BlogPost[] = [];
  if (metricsTopPostsNeeded > 0) {
    const metricsTopPostsResult = await payloadInstance.find({
      collection: BlogPostCollectionId,
      where: {
        _status: { equals: 'published' },
        markAsTopPost: { equals: false },
        slug: { not_in: [currentPostSlug] },
      },
      sort: `-${metric}`,
      limit: metricsTopPostsNeeded,
    });

    metricsTopPosts = metricsTopPostsResult.docs;
  }

  return [...topMarkedPosts, ...metricsTopPosts];
}

export async function updatePostMetrics(
  slug: string,
  { shares = 0, views = 0 }: { shares?: number; views?: number },
): Promise<BlogPost> {
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const payloadInstance = await appGetPayload();
      const res = await payloadInstance.find({
        collection: BlogPostCollectionId,
        where: { slug: { equals: slug } },
      });
      const post = res.docs[0];
      if (!post) {
        return res.docs[0];
      }
      const incrementMetrics = {
        views: (post?.views || 0) + views,
        shares: (post?.shares || 0) + shares,
      };
      const metricsTopPostScore = calculatePostMetrics({
        views: incrementMetrics.views,
        shares: incrementMetrics.shares,
      });
      await payloadInstance.update({
        collection: BlogPostCollectionId,
        where: { slug: { equals: slug } },
        data: {
          views: incrementMetrics.views,
          shares: incrementMetrics.shares,
          metricsTopPostScore,
        },
      });

      return res.docs[0];
    } catch (error) {
      lastError = error as Error;
      if ((error as Error).message?.includes('Transaction') || 
          (error as Error).message?.includes('WriteConflict')) {
        await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
  
  console.warn('Failed to update post metrics after retries:', lastError?.message);
  const payloadInstance = await appGetPayload();
  const res = await payloadInstance.find({
    collection: BlogPostCollectionId,
    where: { slug: { equals: slug } },
  });
  return res.docs[0];
}
