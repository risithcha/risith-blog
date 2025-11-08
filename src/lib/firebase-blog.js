// Imports
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
import { 
  generateSlug, 
  formatDate, 
  formatDateFull, 
  formatDateHomepage, 
  getDay, 
  formatMonthYear,
  formatFirestoreDoc 
} from "./firebase-utils";

// Initialize Firestore and set collection name
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
    
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Get all blog posts
export const getAllBlogPosts = async () => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION), 
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(formatFirestoreDoc);
    
    return posts;
  } catch (error) {
    throw error;
  }
};

// Get a single blog post by slug
export const getBlogPostBySlug = async (slug) => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION), 
      where("slug", "==", slug),
      where("published", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return formatFirestoreDoc(querySnapshot.docs[0]);
  } catch (error) {
    throw error;
  }
};

// Get a single blog post by ID
export const getBlogPostById = async (postId) => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return formatFirestoreDoc(docSnap);
    } else {
      return null;
    }
  } catch (error) {
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
  } catch (error) {
    throw error;
  }
};

// Delete a blog post
export const deleteBlogPost = async (postId) => {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId));
  } catch (error) {
    throw error;
  }
};

// Get recent blog posts (for homepage, etc.)
export const getRecentBlogPosts = async (count = 3) => {
  try {
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
        posts.push(formatFirestoreDoc(doc));
        i++;
      }
    });
    
    return posts;
  } catch (error) {
    throw error;
  }
};

// Export shared utilities with blog-specific aliases
export const formatPostDateFull = formatDateFull;
export const getPostDay = getDay;
export const formatPostMonthYear = formatMonthYear;
export const formatPostDateHomepage = formatDateHomepage;
export { generateSlug };

