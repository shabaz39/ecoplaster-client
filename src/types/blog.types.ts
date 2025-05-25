// file: types/blog.types.ts

export interface Image {
  imageUrl: string;
  imageId: string;
}

export interface IBlog {
  id: string;
  title: string;
  mainImage?: Image;
  body: string;
  images: Image[];
  metaTags: string[];
  author: string;
  published: boolean;
  slug?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  body: string;
  metaTags: string[];
  author: string;
}

export interface CreateBlogArgs {
  input: {
    title: string;
    body: string;
    metaTags: string[] | string; // Handle both string and array
    author: string;
  };
  files: any[]; // GraphQLUpload files
}

export interface UpdateBlogArgs {
  id: string;
  input: {
    title?: string;
    body?: string;
    metaTags?: string[] | string; // Handle both string and array
    author?: string;
  };
  files?: any[]; // GraphQLUpload files (optional for update)
}