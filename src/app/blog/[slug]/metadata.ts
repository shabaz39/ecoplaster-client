import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;  // Ensure params is destructured

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
