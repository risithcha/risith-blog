// Imports
import { getRecentBlogPosts } from '../lib/firebase-blog';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/Navigation';

// Homepage stuff
export default async function Home() {
  // Get the 3 most recent blog posts from Firebase
  let recentPosts = [];
  try {
    recentPosts = await getRecentBlogPosts(3);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
  }
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation bar */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 w-full">
        {/* Hero Section */}
        <div className="py-16">
          <div className="flex items-center gap-8">
            {/* Little funny image of Garfield (I LOVE GARFIELD) */}
            <div className="w-40 h-40 rounded-3xl overflow-hidden flex-shrink-0">
              <Image 
                src="/garfield.png" 
                alt="Profile" 
                width={160} 
                height={160} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* About me */}
            <div className="flex-1 flex items-center">
              <p className="text-gray-400 leading-relaxed text-sm">
                This is my newly created blog to document my coding journey. I will talk about many things here. Hope you enjoy reading my posts! 
              </p>
            </div>
          </div>
        </div>

        {/* Recent Blogs Section */}
        <div className="pb-16">
          {/* Title and link to all blogs */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">RECENT BLOGS</h2>
            <Link href="/blog" className="text-purple-400 text-sm hover:text-purple-300">ALL BLOGS</Link>
          </div>
          
          {/* Recent blog posts list */}
          <div className="space-y-6">
            {/* Show message if no posts */}
            {recentPosts.length === 0 && (
              <div className="text-gray-400 text-center py-8">
                No blog posts yet. Check back later!
              </div>
            )}
            
            {/* Loop through recent posts */}
            {recentPosts.map((post, index) => (
              <div key={post.id} className="flex items-start space-x-6">
                {/* Post number */}
                <div className="text-6xl font-bold text-white w-20 text-center">
                  {index + 1}
                </div>
                {/* Post content */}
                <div className="flex-1">
                  {/* Post title (clickable link) */}
                  <h3 className="text-xl font-medium text-white mb-2 hover:text-purple-300 cursor-pointer">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {/* Post preview text */}
                  <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                  {/* Post date and read time */}
                  <div className="text-gray-500 text-xs">
                    <span>{post.originalDate || new Date(post.createdAt).toLocaleDateString()}</span>
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
