import { Document } from 'mongoose';

export interface Image {
  imageUrl: string;
  imageId: string;
}

export interface IBlog extends Document {
  title: string;
  mainImage?: Image;
  body: string;
  images: Image[];
  metaTags: string[];
  author: string;
  published: boolean;
  slug?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogInput {
  title: string;
  body: string;
  metaTags: string[];
  author: string;
  published?: boolean;
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

export interface CreateBlogArgs {
  input: BlogInput;
  files: Promise<FileUpload>[];
}

export interface UpdateBlogArgs {
  id: string;
  input: Partial<BlogInput>;
  files?: Promise<FileUpload>[];
}

export interface BlogFormData {
  title: string;
  body: string;
  metaTags: string;
  author: string;
}

export interface BlogFile extends File {
    preview?: string;
  }

export interface BlogState {
  blogs: IBlog[];
  loading: boolean;
  error: string | null;
  currentBlog: IBlog | null;
}