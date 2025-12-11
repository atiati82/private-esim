import { BlogPost, UserDto } from '@/payload/app-types';

export const mockPost: BlogPost = {
  id: '1',
  title: 'Example Blog Post',
  content: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [],
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  },
  slug: 'example-blog-post',
  publishedDate: '2023-01-01',
  author: {
    id: 'user-123',
    fullName: 'Jane Doe',
    roles: ['admin'],
    lastActiveAt: '2024-07-30T12:00:00Z',
    updatedAt: '2024-07-30T12:00:00Z',
    createdAt: '2024-07-01T12:00:00Z',
    email: 'jane.doe@example.com',
    resetPasswordToken: null,
    resetPasswordExpiration: null,
    salt: null,
    hash: null,
    _verified: true,
    _verificationToken: null,
    loginAttempts: 0,
    lockUntil: null,
    password: 'hashed-password',
  } as UserDto,
  tags: ['tag1', 'tag2'],
  excerpt: 'This is an example blog post excerpt.',
  featuredImage: {
    id: 'id',
    name: 'sample',
    url: 'https://images.unsplash.com/5/unsplash-kitsune-4.jpg?&w=400&fit=max',
    updatedAt: '',
    createdAt: '',
  },
  categories: ['category1', 'category2'],
  meta: {
    title: 'Example Meta Title',
    description: 'Example Meta Description',
  },
  updatedAt: '2023-01-01',
  createdAt: '2023-01-01',
  _status: 'published',
};
