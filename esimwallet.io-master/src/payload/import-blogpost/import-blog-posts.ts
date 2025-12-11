import { getCliLogger, LoggerName } from '@/lib/logging';
import { BlogPostCollectionId, MediaCollectionId, UsersCollectionId } from '@/payload/collections';
import { MockBlogPostData } from '@/payload/import-blogpost/mock-blog-posts';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';
import { uploadImage } from '@/payload/utils/image';

const LogLabel = '[BLOG POSTS IMPORT]';

export const importBlogPosts = async (numPosts: number = 20): Promise<void> => {
  const logger = getCliLogger(LoggerName.DataImport);
  const payload = await appGetPayloadStandalone();

  const existingPosts = await payload.find({ collection: BlogPostCollectionId, limit: 1 });
  if (existingPosts.totalDocs > 0) {
    logger.info(
      `${LogLabel} ${existingPosts.totalDocs} Blog posts already present, skipping import.`,
    );
    return;
  }

  await uploadImage('https://res.cloudinary.com/vanella/image/upload/v1725267749/sample-post.jpg');

  const users = await payload.find({ collection: UsersCollectionId, limit: 100 });
  const images = await payload.find({ collection: MediaCollectionId, limit: 100 });
  const posts = await MockBlogPostData(payload, users.docs, images.docs, numPosts);

  for (const post of posts) {
    await payload.create({
      collection: BlogPostCollectionId,
      data: post,
    });
  }

  logger.info(`${LogLabel} ${posts.length} Blog posts imported successfully.`);
};
