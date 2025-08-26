import { blogPosts } from '../../data/posts';
import Link from 'next/link';
import Navigation from '../../components/Navigation';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 w-full">
        <div className="py-16">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">All Blog Posts</h1>
            <p className="text-gray-400">
              Welcome to my blog! Have fun!
            </p>
          </div>
          
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="flex items-start space-x-6">
                <div className="text-6xl font-bold text-white w-20 text-center">
                  {post.id}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-white mb-2 hover:text-purple-300 cursor-pointer">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                  <div className="text-gray-500 text-xs">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
