import { getRecentPosts } from '../data/posts';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/Navigation';

export default function Home() {
  const recentPosts = getRecentPosts(1); // Only get 1 post as requested
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 w-full">
        {/* Hero Section */}
        <div className="py-16">
          <div className="flex items-center gap-8">
            {/* Avatar - Now using the Garfield image */}
            <div className="w-40 h-40 rounded-3xl overflow-hidden flex-shrink-0">
              <Image 
                src="/garfield.png" 
                alt="Profile" 
                width={160} 
                height={160} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content - Centered text only */}
            <div className="flex-1 flex items-center">
              <p className="text-gray-400 leading-relaxed text-sm">
                This is my newly created blog to document my coding journey. I will talk about many things here. Hope you enjoy reading my posts! 
              </p>
            </div>
          </div>
        </div>

        {/* Recent Blogs Section */}
        <div className="pb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">RECENT BLOGS</h2>
            <Link href="/blog" className="text-purple-400 text-sm hover:text-purple-300">ALL BLOGS →</Link>
          </div>
          
          {/* Blog Posts - Only 1 post now */}
          <div className="space-y-6">
            {recentPosts.map((post) => (
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
