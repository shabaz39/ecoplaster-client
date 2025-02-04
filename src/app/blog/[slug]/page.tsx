import BlogPost from '@/components/BlogPostComponents/BlogPost';
import { Metadata } from 'next';

// Explicitly define the expected structure for `params`
interface PageProps {
  params: { slug: string }; // Ensure `params` is correctly typed
  searchParams?: Record<string, string | string[] | undefined>;
}

// ✅ Fix: Ensure that params is destructured correctly
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params; // Ensure correct extraction

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

// ✅ Fix: Remove unnecessary `async` and return `BlogPost` directly
export default function Page({ params }: PageProps) {
  return <BlogPost slug={params.slug} />;
}
