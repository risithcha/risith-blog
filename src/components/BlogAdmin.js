'use client';

// Imports
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  createBlogPost,
  generateSlug,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  formatPostDateFull,
} from '../lib/firebase-blog';
import PrimaryButton from './PrimaryButton';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Admin panel stuff for creating, viewing, editing, and deleting blog posts
// This is where I can manage all my blog stuff
export default function BlogAdmin() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for theme to be mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  // Track if we're currently saving a post (shows loading state)
  const [isLoading, setIsLoading] = useState(false);
  // Show success/error messages to the user
  const [message, setMessage] = useState('');
  // Form data for the new blog post
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
  });
  // List of all existing posts
  const [posts, setPosts] = useState([]);
  // Currently editing post (null if not editing)
  const [editingPost, setEditingPost] = useState(null);
  // Show create form or posts list
  const [view, setView] = useState('list'); // 'list' or 'create' or 'edit'
  // Preview mode for markdown
  const [previewMode, setPreviewMode] = useState('edit'); // 'edit', 'preview', 'split'

  // Load all posts when stuff mounts
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
        author: 'Risith',
      };

      // Save the post to Firebase
      const postId = await createBlogPost(postData);
      setMessage(`New post created successfully! ID: ${postId}`);

      // Reset form so I can create another post
      setNewPost({
        title: '',
        content: '',
        excerpt: '',
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
        slug,
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
    if (
      !confirm(
        'Are you sure you want to delete this post? This action cannot be undone.'
      )
    ) {
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

  // Custom styles for the markdown editor
  const editorStyles = {
    backgroundColor: '#000',
    color: '#fff',
    border: '1px solid #374151',
    borderRadius: '0.375rem',
  };

  return (
    <div className="space-y-6">
      {/* Navigation buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            view === 'list'
              ? 'bg-purple-400 text-black'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          View Posts
        </button>
        <button
          onClick={() => setView('create')}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            view === 'create'
              ? 'bg-purple-400 text-black'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Create New Post
        </button>
      </div>

      {/* Message Display - shows success or error messages */}
      {message && (
        <div
          className={`p-3 rounded ${
            message.includes('successfully')
              ? 'bg-green-100 dark:bg-green-900/20 border border-green-700 text-green-800 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/20 border border-red-700 text-red-800 dark:text-red-300'
          }`}
        >
          {message}
        </div>
      )}

      {/* Posts List View */}
      {view === 'list' && (
        <div className="border border-gray-700 rounded p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            All Blog Posts
          </h3>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-gray-400">No posts found.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-600 rounded p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </h4>
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
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    {post.excerpt}
                  </p>
                  <div className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-4">
                    <span>Created: {formatPostDateFull(post.createdAt)}</span>
                    <span className="text-purple-400 font-medium">
                      {post.views} views
                    </span>
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
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Create New Blog Post
          </h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            {/* Post title input */}
            <div>
              <label className="block text-black dark:text-white text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            {/* Post excerpt input - short preview text */}
            <div>
              <label className="block text-black dark:text-white text-sm font-medium mb-1">
                Excerpt
              </label>
              <input
                type="text"
                value={newPost.excerpt}
                onChange={(e) =>
                  setNewPost({ ...newPost, excerpt: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            {/* Markdown Editor Controls */}
            <div className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={() => setPreviewMode('edit')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  previewMode === 'edit'
                    ? 'bg-purple-400 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('preview')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  previewMode === 'preview'
                    ? 'bg-purple-400 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('split')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  previewMode === 'split'
                    ? 'bg-purple-400 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Split View
              </button>
            </div>

            {/* Main content - Markdown Editor */}
            <div>
              <label className="block text-black dark:text-white text-sm font-medium mb-1">
                Content (Markdown)
              </label>
              {previewMode === 'edit' && (
                <div
                  className="w-full"
                  data-color-mode={
                    mounted
                      ? resolvedTheme === 'dark'
                        ? 'dark'
                        : 'light'
                      : 'light'
                  }
                >
                  <MDEditor
                    value={newPost.content}
                    onChange={(value) =>
                      setNewPost({ ...newPost, content: value || '' })
                    }
                    height={400}
                    preview="edit"
                    className="w-full"
                  />
                </div>
              )}
              {previewMode === 'preview' && (
                <div className="border border-gray-300 dark:border-gray-700 rounded p-4 bg-white dark:bg-black min-h-[400px] overflow-auto prose dark:prose-invert max-w-none text-black dark:text-white">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {newPost.content}
                  </ReactMarkdown>
                </div>
              )}
              {previewMode === 'split' && (
                <div
                  className="w-full"
                  data-color-mode={
                    mounted
                      ? resolvedTheme === 'dark'
                        ? 'dark'
                        : 'light'
                      : 'light'
                  }
                >
                  <MDEditor
                    value={newPost.content}
                    onChange={(value) =>
                      setNewPost({ ...newPost, content: value || '' })
                    }
                    height={400}
                    preview="live"
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Submit button - disabled while saving */}
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Post'}
            </PrimaryButton>
          </form>
        </div>
      )}

      {/* Edit Post Section */}
      {view === 'edit' && editingPost && (
        <div className="border border-gray-700 rounded p-4">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Edit Blog Post
          </h3>
          <form onSubmit={handleEditPost} className="space-y-4">
            {/* Post title input */}
            <div>
              <label className="block text-black dark:text-white text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, title: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            {/* Post excerpt input */}
            <div>
              <label className="block text-black dark:text-white text-sm font-medium mb-1">
                Excerpt
              </label>
              <input
                type="text"
                value={editingPost.excerpt}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, excerpt: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            {/* Markdown Editor Controls */}
            <div className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={() => setPreviewMode('edit')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  previewMode === 'edit'
                    ? 'bg-purple-400 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('preview')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  previewMode === 'preview'
                    ? 'bg-purple-400 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('split')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  previewMode === 'split'
                    ? 'bg-purple-400 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Split View
              </button>
            </div>

            {/* Main content - Markdown Editor */}
            <div>
              <label className="block text-black dark:text-white text-sm font-medium mb-1">
                Content (Markdown)
              </label>
              {previewMode === 'edit' && (
                <div
                  className="w-full"
                  data-color-mode={
                    mounted
                      ? resolvedTheme === 'dark'
                        ? 'dark'
                        : 'light'
                      : 'light'
                  }
                >
                  <MDEditor
                    value={editingPost.content}
                    onChange={(value) =>
                      setEditingPost({ ...editingPost, content: value || '' })
                    }
                    height={400}
                    preview="edit"
                    className="w-full"
                  />
                </div>
              )}
              {previewMode === 'preview' && (
                <div className="border border-gray-300 dark:border-gray-700 rounded p-4 bg-white dark:bg-black min-h-[400px] overflow-auto prose dark:prose-invert max-w-none text-black dark:text-white">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {editingPost.content}
                  </ReactMarkdown>
                </div>
              )}
              {previewMode === 'split' && (
                <div
                  className="w-full"
                  data-color-mode={
                    mounted
                      ? resolvedTheme === 'dark'
                        ? 'dark'
                        : 'light'
                      : 'light'
                  }
                >
                  <MDEditor
                    value={editingPost.content}
                    onChange={(value) =>
                      setEditingPost({ ...editingPost, content: value || '' })
                    }
                    height={400}
                    preview="live"
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Post'}
              </PrimaryButton>
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
