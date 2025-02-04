import BlogPost from '@/components/BlogPostComponents/BlogPost';
import  PageProps  from 'next';  // Import Next.js PageProps type

export default function Page({ params }: { params: { slug: string } }) {
  // Ensure `params` is correctly destructured and accessed
  if (!params || !params.slug) {
    return <div>Error: Slug not found</div>;
  }

  return <BlogPost slug={params.slug} />;
}
