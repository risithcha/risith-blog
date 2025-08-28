'use client';

import { useState, useEffect } from 'react';
import { createBlogPost, generateSlug, getAllBlogPosts, getBlogPostById, updateBlogPost, deleteBlogPost, formatPostDate } from '../lib/firebase-blog';

// Admin panel for creating, viewing, editing, and deleting blog posts
// This is where I can manage all my blog content
export default function BlogAdmin() {
  // Track if we're currently saving a post (shows loading state)
  const [isLoading, setIsLoading] = useState(false);
  // Show success/error messages to the user
  const [message, setMessage] = useState('');
  // Form data for the new blog post
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    readTime: '5 min read'
  });
  // List of all existing posts
  const [posts, setPosts] = useState([]);
  // Currently editing post (null if not editing)
  const [editingPost, setEditingPost] = useState(null);
  // Show create form or posts list
  const [view, setView] = useState('list'); // 'list' or 'create' or 'edit'

  // Load all posts when component mounts
  useEffect(() => {
    loadPosts();
  }, []);

  // Load all posts from Firebase
  const loadPosts = async () => {
    try {
      const allPosts = await getAllBlogPosts();
      setPosts(allPosts);
    } catch (error) {
      setMessage(`Failed to load posts: ${error.message}`);
    }
  };

  // Handle form submission - create the new blog post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Generate a URL-friendly slug from the title
      const slug = generateSlug(newPost.title);
      // Prepare the post data with all required fields
      const postData = {
        ...newPost,
        slug,
        published: true,
        author: 'Risith'
      };

      // Save the post to Firebase
      const postId = await createBlogPost(postData);
      setMessage(`New post created successfully! ID: ${postId}`);
      
      // Reset form so I can create another post
      setNewPost({
        title: '',
        content: '',
        excerpt: '',
        readTime: '5 min read'
      });
      
      // Reload posts list
      await loadPosts();
      setView('list');
    } catch (error) {
      setMessage(`Failed to create post: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing a post
  const handleEditPost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Generate new slug if title changed
      const slug = generateSlug(editingPost.title);
      const updateData = {
        ...editingPost,
        slug
      };

      // Update the post in Firebase
      await updateBlogPost(editingPost.id, updateData);
      setMessage(`Post updated successfully!`);
      
      // Reset editing state
      setEditingPost(null);
      setView('list');
      
      // Reload posts list
      await loadPosts();
    } catch (error) {
      setMessage(`Failed to update post: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a post
  const startEdit = async (postId) => {
    try {
      const post = await getBlogPostById(postId);
      if (post) {
        setEditingPost(post);
        setView('edit');
      }
    } catch (error) {
      setMessage(`Failed to load post for editing: ${error.message}`);
    }
  };

  // Delete a post
  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await deleteBlogPost(postId);
      setMessage(`Post deleted successfully!`);
      
      // Reload posts list
      await loadPosts();
    } catch (error) {
      setMessage(`Failed to delete post: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 rounded font-medium ${
            view === 'list' 
              ? 'bg-purple-400 text-black' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          View Posts
        </button>
        <button
          onClick={() => setView('create')}
          className={`px-4 py-2 rounded font-medium ${
            view === 'create' 
              ? 'bg-purple-400 text-black' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          Create New Post
        </button>
      </div>

      {/* Message Display - shows success or error messages */}
      {message && (
        <div className={`p-3 rounded ${
          message.includes('successfully') 
            ? 'bg-green-900/20 border border-green-700 text-green-300' 
            : 'bg-red-900/20 border border-red-700 text-red-300'
        }`}>
          {message}
        </div>
      )}

      {/* Posts List View */}
      {view === 'list' && (
        <div className="border border-gray-700 rounded p-4">
          <h3 className="text-lg font-semibold text-white mb-4">All Blog Posts</h3>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-gray-400">No posts found.</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="border border-gray-600 rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-white">{post.title}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(post.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                  <div className="text-gray-500 text-xs">
                    <span>Created: {formatPostDate(post.createdAt)}</span>
                    <span className="mx-2">•</span>
                    <span>Read time: {post.readTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create New Post Section */}
      {view === 'create' && (
        <div className="border border-gray-700 rounded p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Blog Post</h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            {/* Post title input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                required
              />
            </div>
            
            {/* Post excerpt input - short preview text */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Excerpt
              </label>
              <input
                type="text"
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                required
              />
            </div>
            
            {/* Read time input - how long it takes to read */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Read Time
              </label>
              <input
                type="text"
                value={newPost.readTime}
                onChange={(e) => setNewPost({ ...newPost, readTime: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="e.g., 5 min read"
              />
            </div>
            
            {/* Main content textarea */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Content
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={10}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                required
              />
            </div>
            
            {/* Submit button - disabled while saving */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-400 hover:bg-purple-300 disabled:bg-gray-600 text-black px-4 py-2 rounded font-medium"
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </form>
        </div>
      )}

      {/* Edit Post Section */}
      {view === 'edit' && editingPost && (
        <div className="border border-gray-700 rounded p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Edit Blog Post</h3>
          <form onSubmit={handleEditPost} className="space-y-4">
            {/* Post title input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                required
              />
            </div>
            
            {/* Post excerpt input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Excerpt
              </label>
              <input
                type="text"
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                required
              />
            </div>
            
            {/* Read time input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Read Time
              </label>
              <input
                type="text"
                value={editingPost.readTime}
                onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
            
            {/* Main content textarea */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Content
              </label>
              <textarea
                value={editingPost.content}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                rows={10}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                required
              />
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-purple-400 hover:bg-purple-300 disabled:bg-gray-600 text-black px-4 py-2 rounded font-medium"
              >
                {isLoading ? 'Updating...' : 'Update Post'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setView('list');
                }}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
