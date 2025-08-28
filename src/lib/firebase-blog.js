// Firebase Blog Posts Service
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where 
} from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);
const POSTS_COLLECTION = "blog_posts";

// Create a new blog post
export const createBlogPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: true
    });
    
    console.log("Blog post created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

// Get all blog posts
export const getAllBlogPosts = async () => {
  try {
    console.log('Fetching all blog posts from Firebase...');
    
    const q = query(
      collection(db, POSTS_COLLECTION), 
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to readable dates
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });
    
    console.log(`Successfully fetched ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error("Error getting blog posts:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Get a single blog post by slug
export const getBlogPostBySlug = async (slug) => {
  try {
    console.log(`Fetching blog post with slug: ${slug}`);
    
    const q = query(
      collection(db, POSTS_COLLECTION), 
      where("slug", "==", slug),
      where("published", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`No blog post found with slug: ${slug}`);
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    console.log(`Successfully fetched blog post: ${data.title}`);
    
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  } catch (error) {
    console.error("Error getting blog post by slug:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Get a single blog post by ID
export const getBlogPostById = async (postId) => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting blog post by ID:", error);
    throw error;
  }
};

// Update a blog post
export const updateBlogPost = async (postId, updateData) => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    
    console.log("Blog post updated successfully");
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlogPost = async (postId) => {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId));
    console.log("Blog post deleted successfully");
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
};

// Get recent blog posts (for homepage, etc.)
export const getRecentBlogPosts = async (count = 3) => {
  try {
    console.log(`Fetching ${count} recent blog posts from Firebase...`);
    
    const q = query(
      collection(db, POSTS_COLLECTION),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    let i = 0;
    querySnapshot.forEach((doc) => {
      if (i < count) {
        const data = doc.data();
        posts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        });
        i++;
      }
    });
    
    console.log(`Successfully fetched ${posts.length} recent blog posts`);
    return posts;
  } catch (error) {
    console.error("Error getting recent blog posts:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Helper function to format dates for display
export const formatPostDate = (date) => {
  if (!date) return "Unknown date";
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short"
  });
};

// Helper function to generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
};

export { db };
export default {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  getRecentBlogPosts,
  formatPostDate,
  generateSlug
};
