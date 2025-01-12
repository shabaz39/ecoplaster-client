// src/app/blog/[slug]/metadata.ts
import type { Metadata } from 'next';

// This is a dynamic metadata function
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Fetch blog data here if needed
  return {
    title: 'Blog Title', // Replace with actual blog title
    description: 'Blog description', // Replace with actual description
    openGraph: {
      title: 'Blog Title',
      description: 'Blog description',
      type: 'article',
    },
  };
}