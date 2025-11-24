'use client';

// Imports
import { useState } from 'react';
import BlogAdmin from '../../components/BlogAdmin';
import ProjectsAdmin from '../../components/ProjectsAdmin';
import ProfileAdmin from '../../components/ProfileAdmin';
import LoginForm from '../../components/LoginForm';
import PageLayout from '../../components/PageLayout';
import ContentContainer from '../../components/ContentContainer';
import { AuthProvider, useAuth } from '../../components/AuthContext';
import { logOut } from '../../lib/firebase-auth';

// Admin control panel - requires authentication
// Shows login form if not authenticated, otherwise shows admin tabs
function AdminContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('blog'); // 'blog', 'projects', or 'profile'

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <ContentContainer className="flex items-center justify-center min-h-[50vh]">
          <div className="text-xl">Loading...</div>
        </ContentContainer>
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <ContentContainer className="py-16">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Admin Control
          </h1>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </ContentContainer>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ContentContainer className="py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Control
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 dark:text-gray-300">
              Welcome Risith
            </span>
            <button
              onClick={handleLogout}
              className="bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded font-medium"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 rounded font-medium transition-colors ${
              activeTab === 'blog'
                ? 'bg-teal-700 text-white shadow-lg'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-teal-700 text-white shadow-lg'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-teal-700 text-white shadow-lg'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Profile
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === 'blog' && <BlogAdmin />}
        {activeTab === 'projects' && <ProjectsAdmin />}
        {activeTab === 'profile' && <ProfileAdmin />}
      </ContentContainer>
    </PageLayout>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  );
}
