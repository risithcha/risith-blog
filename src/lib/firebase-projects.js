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
  formatFirestoreDoc 
} from "./firebase-utils";

// Initialize Firestore and set collection name
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
    
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Get all projects
export const getAllProjects = async () => {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION), 
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(formatFirestoreDoc);
    
    return projects;
  } catch (error) {
    throw error;
  }
};

// Get a single project by ID
export const getProjectById = async (projectId) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
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

// Update a project
export const updateProject = async (projectId, updateData) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
  } catch (error) {
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  } catch (error) {
    throw error;
  }
};

// Export shared utilities with project-specific aliases
export const formatProjectDateFull = formatDateFull;
export const generateProjectSlug = generateSlug;
