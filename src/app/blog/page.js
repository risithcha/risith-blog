// Imports
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import { getAllBlogPosts, formatPostDate } from '../../lib/firebase-blog';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  // Get all blog posts from Firebase
  let posts = [];
  try {
    posts = await getAllBlogPosts();
    console.log('Fetched all posts:', posts.length);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation bar */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="py-16">
          <h1 className="text-3xl font-bold mb-4">ALL BLOGS</h1>
          <p className="text-gray-400">All my blog posts in one place.</p>
        </div>

        {/* Blog Posts List */}
        <div className="pb-16">
          {/* Show message if no posts */}
          {posts.length === 0 && (
            <div className="text-gray-400 text-center py-8">
              No blog posts yet. Check back later!
            </div>
          )}
          
          {/* Loop through all posts */}
          <div className="space-y-8">
            {posts.map((post, index) => (
              <article key={post.id} className="border-b border-gray-800 pb-8">
                {/* Post title */}
                <h2 className="text-2xl font-semibold mb-3 hover:text-purple-300 cursor-pointer">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                
                {/* Post excerpt */}
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                
                {/* Post metadata */}
                <div className="text-gray-500 text-xs">
                  <span>{formatPostDate(post.createdAt)}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
