import { use } from 'react';
import BlogPost from '@/components/BlogPostComponents/BlogPost';
import { Metadata } from 'next';

// ✅ Fix for Next.js 15: params is now a Promise
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ✅ Fix for metadata function
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; // Await params before using

  return {
    title: `Blog Title - ${slug}`,
    description: `Description for ${slug}`,
    openGraph: {
      title: `Blog Title - ${slug}`,
      description: `Description for ${slug}`,
      type: 'article',
    },
  };
}

// ✅ Fix: Use `use()` for client-side reading
export default function Page({ params }: PageProps) {
  const { slug } = use(params); // React’s `use()` to access params
  return <BlogPost slug={slug} />;
}
