// Imports
import { getAllBlogPosts, getBlogPostBySlug, formatPostDateFull } from '../../../lib/firebase-blog';
import Navigation from '../../../components/Navigation';
import ProfileCard from '../../../components/ProfileCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate static params for all blog posts
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

export default async function BlogPost({ params }) {
  // Await params as required by Next.js 15
  const { slug } = await params;
  
  // Get the specific post data using the slug from URL parameters
  let post = null;
  
  try {
    post = await getBlogPostBySlug(slug);
    console.log('Fetched post:', post?.title);
  } catch (error) {
    console.error('Error fetching blog post:', error);
  }

  // If post not found, show 404
  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navigation />
        <div className="flex-1 max-w-4xl mx-auto px-6 w-full py-16">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-400">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation bar */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 w-full">
        {/* Blog Post */}
        <article className="py-16">
          {/* Post header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
            
            {/* Post metadata */}
            <div className="flex items-center text-gray-400 text-sm mb-6">
              <span>{formatPostDateFull(post.createdAt)}</span>
              {post.author && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>
            
            {/* Post excerpt */}
            {post.excerpt && (
              <p className="text-gray-400 text-lg leading-relaxed">{post.excerpt}</p>
            )}
          </header>

          {/* Post content */}
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
          
          {/* Profile Card */}
          <ProfileCard />
        </article>
      </div>
    </div>
  );
}
