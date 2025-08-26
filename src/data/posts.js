// Blog posts data
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

export const getPostBySlug = (slug) => {
  return blogPosts.find(post => post.slug === slug);
};

export const getRecentPosts = (count = 5) => {
  return blogPosts.slice(0, count);
};
