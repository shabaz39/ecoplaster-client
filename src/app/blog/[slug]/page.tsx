// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import BlogPost from '@/components/BlogPostComponents/BlogPost'; // Add import

type PageProps = {
 params: {
   slug: string;
 };
 searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

export default function Page({ params }: PageProps) {
 return <BlogPost slug={params.slug} />;
}