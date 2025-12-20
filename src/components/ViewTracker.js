'use client';

import { useEffect } from 'react';
import { incrementBlogPostViews } from '../lib/firebase-blog';

// View tracker - runs once on mount and increments the post's views.
export default function ViewTracker({ postId }) {
  useEffect(() => {
    // Increment view count when component mounts
    const incrementView = async () => {
        await incrementBlogPostViews(postId);
    };

    incrementView();
  }, [postId]);

  // This component doesn't render anything
  return null;
}
