// src/app/blog/[slug]/page.tsx
import BlogPost from '@/components/BlogPostComponents/BlogPost';

export default function Page({ params }: { params: { slug: string } }) {
  return <BlogPost slug={params.slug} />;
}