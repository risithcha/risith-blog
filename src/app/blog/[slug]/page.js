import { getPostBySlug, blogPosts } from '../../../data/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPost({ params }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 w-full">
        <div className="py-16">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-400 text-sm mb-6">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <article className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br />') 
              }} 
            />
          </article>
          
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
