// Imports
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  formatPostDateFull,
} from '../../../lib/firebase-blog';
import PageLayout from '../../../components/PageLayout';
import ContentContainer from '../../../components/ContentContainer';
import ProfileCard from '../../../components/ProfileCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate static params for all blog posts (for static generation)
export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Individual blog post page
export default async function BlogPost({ params }) {
  // Await params as required by Next.js 15
  const { slug } = await params;

  // Get the specific post data using the slug from URL parameters
  let post = null;

  try {
    post = await getBlogPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching blog post:', error);
  }

  // If post not found, show 404
  if (!post) {
    return (
      <PageLayout>
        <ContentContainer className="py-16">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
        </ContentContainer>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ContentContainer>
        {/* Blog Post */}
        <article className="py-16">
          {/* Post header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              {post.title}
            </h1>

            {/* Post metadata */}
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-6">
              <span>{formatPostDateFull(post.createdAt)}</span>
            </div>

            {/* Post excerpt */}
            {post.excerpt && (
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Post content */}
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Profile Card */}
          <ProfileCard />
        </article>
      </ContentContainer>
    </PageLayout>
  );
}
