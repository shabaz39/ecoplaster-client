// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import BlogPost from '@/components/BlogPostComponents/BlogPost';

interface PageParams {
  slug: string;
}

type Props = {
  params: PageParams;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Blog Title - ${params.slug}`,
    description: `Description for ${params.slug}`,
    openGraph: {
      title: `Blog Title - ${params.slug}`,
      description: `Description for ${params.slug}`,
      type: 'article',
    },
  };
}

export default async function Page({ params }: Props) {
  return <BlogPost slug={params.slug} />;
}