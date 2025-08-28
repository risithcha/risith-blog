// Firebase Projects Service
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
const PROJECTS_COLLECTION = "projects";

// Create a new project
export const createProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: true
    });
    
    console.log("Project created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Get all projects
export const getAllProjects = async () => {
  try {
    console.log('Fetching all projects from Firebase...');
    
    const q = query(
      collection(db, PROJECTS_COLLECTION), 
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const projects = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to readable dates
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });
    
    console.log(`Successfully fetched ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error("Error getting projects:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Get a single project by slug
export const getProjectBySlug = async (slug) => {
  try {
    console.log(`Fetching project with slug: ${slug}`);
    
    const q = query(
      collection(db, PROJECTS_COLLECTION), 
      where("slug", "==", slug),
      where("published", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`No project found with slug: ${slug}`);
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    console.log(`Successfully fetched project: ${data.title}`);
    
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  } catch (error) {
    console.error("Error getting project by slug:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Get a single project by ID
export const getProjectById = async (projectId) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
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
    console.error("Error getting project by ID:", error);
    throw error;
  }
};

// Update a project
export const updateProject = async (projectId, updateData) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    
    console.log("Project updated successfully");
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
    console.log("Project deleted successfully");
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Get recent projects (for homepage, etc.)
export const getRecentProjects = async (count = 3) => {
  try {
    console.log(`Fetching ${count} recent projects from Firebase...`);
    
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const projects = [];
    
    let i = 0;
    querySnapshot.forEach((doc) => {
      if (i < count) {
        const data = doc.data();
        projects.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        });
        i++;
      }
    });
    
    console.log(`Successfully fetched ${projects.length} recent projects`);
    return projects;
  } catch (error) {
    console.error("Error getting recent projects:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Helper function to format dates for display
export const formatProjectDate = (date) => {
  if (!date) return "Unknown date";
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short"
  });
};

// Helper function to format dates for admin (full format)
export const formatProjectDateFull = (date) => {
  if (!date) return "Unknown date";
  
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

// Helper function to generate slug from title
export const generateProjectSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
};

export { db };
const firebaseProjectService = {
  createProject,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  updateProject,
  deleteProject,
  getRecentProjects,
  formatProjectDate,
  formatProjectDateFull,
  generateProjectSlug
};

export default firebaseProjectService;
