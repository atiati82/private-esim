import { Payload } from 'payload';

import { BlogPost, MediaDto, UserDto } from '@/payload/app-types';
import ensureBlogCategoriesAndTags from '@/payload/import-blogpost/mock-blog-categories-and-tags';

export const MockBlogPostData = async (
  payload: Payload,
  users: UserDto[],
  images: MediaDto[],
  count: number = 20,
): Promise<BlogPost[]> => {
  const { blogCategories, blogTags } = await ensureBlogCategoriesAndTags(payload);
  const formattedDate = new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return Array.from({ length: count }).map((_, index) => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const randomCategory = blogCategories[Math.floor(Math.random() * blogCategories.length)];
    const randomTag = blogTags[Math.floor(Math.random() * blogTags.length)];

    return {
      title: `The Future of Connectivity: Understanding e-SIM Technology ${index + 1}`,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [{ type: 'text', text: `Content for blog post ${index + 1}`, version: 1 }],
            },
          ],
          direction: 'ltr',
          format: 'left',
          indent: 0,
          version: 1,
        },
      },
      excerpt: 'This is an example blog post excerpt.',
      slug: `blog-post-${index + 1}`,
      publishedDate: formattedDate,
      author: randomUser.id,
      tags: [randomTag.id],
      categories: [randomCategory.id],
      _status: 'published',
      featuredImage: randomImage.id,
    };
  });
};
