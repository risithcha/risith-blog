// Blog posts data

// This is where I have to type my blog posts
// I plan to change this way cuz I'm not a fan of this method
export const blogPosts = [
  {
    id: 1,
    title: "My First Blog Post",
    excerpt: "Yo. It's my first blog post :0",
    date: "Jul 2025",
    readTime: "5 min read",
    slug: "my-first-blog-post",
    content: `PLACEHOLDER`
  }
];

// Find a specific post by its slug
export const getPostBySlug = (slug) => {
  return blogPosts.find(post => post.slug === slug);
};

// Get the most recent posts (limited by count)
export const getRecentPosts = (count = 3) => {
  return blogPosts.slice(0, count);
};
