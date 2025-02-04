import BlogPost from '@/components/BlogPostComponents/BlogPost';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <BlogPost slug={params.slug} />;
}
