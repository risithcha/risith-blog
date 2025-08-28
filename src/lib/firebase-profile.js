import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);

// Collection name for profile data
const PROFILE_COLLECTION = 'profile';

// Default profile data
const defaultProfile = {
  bio: 'idk, I need to put something here.',
  updatedAt: new Date()
};

// Get profile data
export async function getProfile() {
  try {
    const profileRef = doc(db, PROFILE_COLLECTION, 'main');
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      return profileSnap.data();
    } else {
      // If no profile exists, create default one
      await setProfile(defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
}

// Set profile data (creates or overwrites)
export async function setProfile(profileData) {
  try {
    const profileRef = doc(db, PROFILE_COLLECTION, 'main');
    const dataToSave = {
      ...profileData,
      updatedAt: new Date()
    };
    
    await setDoc(profileRef, dataToSave);
    return dataToSave;
  } catch (error) {
    console.error('Error setting profile:', error);
    throw error;
  }
}

// Update profile data (partial update)
export async function updateProfile(updates) {
  try {
    const profileRef = doc(db, PROFILE_COLLECTION, 'main');
    const dataToUpdate = {
      ...updates,
      updatedAt: new Date()
    };
    
    await updateDoc(profileRef, dataToUpdate);
    return dataToUpdate;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Update just the bio text
export async function updateBio(bioText) {
  try {
    return await updateProfile({ bio: bioText });
  } catch (error) {
    console.error('Error updating bio:', error);
    throw error;
  }
}
