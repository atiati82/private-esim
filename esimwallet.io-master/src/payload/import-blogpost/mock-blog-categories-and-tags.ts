import { Payload } from 'payload';

import { BlogCategory, BlogTag } from '@/payload/app-types';
import { BlogCategoriesCollectionId, BlogTagsCollectionId } from '@/payload/collections';

async function ensureBlogCategoriesAndTags(
  payload: Payload,
): Promise<{ blogCategories: BlogCategory[]; blogTags: BlogTag[] }> {
  const blogCategories = await fetchOrCreateBlogCategories(payload);
  const blogTags = await fetchOrCreateBlogTags(payload);

  return { blogCategories, blogTags };
}

async function fetchOrCreateBlogCategories(payload: Payload): Promise<BlogCategory[]> {
  // Fetch existing categories
  const existingBlogCategories = await payload.find({
    collection: BlogCategoriesCollectionId,
    limit: 100,
  });
  if (existingBlogCategories.docs.length > 0) {
    return existingBlogCategories.docs;
  }

  // Create new categories if none exist
  const newCategories = ['News', 'Tech', 'Lifestyle'].map(async (name) => {
    return payload.create({
      collection: BlogCategoriesCollectionId,
      data: { name, description: `${name} category` },
    });
  });
  return Promise.all(newCategories);
}

async function fetchOrCreateBlogTags(payload: Payload): Promise<BlogTag[]> {
  // Fetch existing tags
  const existingBlogTags = await payload.find({ collection: BlogTagsCollectionId, limit: 100 });
  if (existingBlogTags.docs.length > 0) {
    return existingBlogTags.docs;
  }

  // Create new tags if none exist
  const newTags = ['Innovation', 'Health', 'Environment'].map(async (tag) => {
    return payload.create({
      collection: BlogTagsCollectionId,
      data: { tag },
    });
  });
  return Promise.all(newTags);
}

export default ensureBlogCategoriesAndTags;
