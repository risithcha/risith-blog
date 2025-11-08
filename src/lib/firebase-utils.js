// Shared utility functions for Firebase operations

// Generate URL-friendly slug from title
// Used for both blog posts and projects
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
};

// Format date for display (Month Year)
export const formatDate = (date) => {
  if (!date) return "Unknown date";
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short"
  });
};

// Format date with full details (Weekday, Month Day, Year)
export const formatDateFull = (date) => {
  if (!date) return "Unknown date";
  
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

// Format date for homepage (Month Day, Year)
export const formatDateHomepage = (date) => {
  if (!date) return "Unknown date";
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

// Get just the day number from a date
export const getDay = (date) => {
  if (!date) return "?";
  return date.getDate();
};

// Format month and year (Month Year)
export const formatMonthYear = (date) => {
  if (!date) return "Unknown";
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short"
  });
};

// Convert Firestore document to JavaScript object with formatted dates
export const formatFirestoreDoc = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  };
};
