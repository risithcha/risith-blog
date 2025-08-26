// Imports
import { getPostBySlug, blogPosts } from '../../../data/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';

// Generate pages on build so they render faster
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Blog post page component
// Displays a single blog post based on the slug parameter
export default function BlogPost({ params }) {
  // Get the specific post data using the slug from URL parameters
  const post = getPostBySlug(params.slug);
  
  // If post doesn't exist, show 404 page
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation bar at the top */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 w-full">
        <div className="py-16">
          {/* Post Header Section */}
          <div className="mb-8">
            {/* Post Title */}
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            {/* Post Metadata (date and read time) */}
            <div className="flex items-center text-gray-400 text-sm mb-6">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
          
          {/* Blog Post Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              // Render HTML content and convert line breaks to <br> tags
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br />') 
              }} 
            />
          </article>
          
          {/* Navigation Back to Blog List */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <Link 
              href="/blog" 
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
