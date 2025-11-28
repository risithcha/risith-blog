'use client';

// Imports
import { useState, useEffect } from 'react';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  formatProjectDateFull,
} from '../lib/firebase-projects';
import PrimaryButton from './PrimaryButton';

// Admin panel stuff for creating, viewing, editing, and deleting projects
export default function ProjectsAdmin() {
  // Track if we're currently saving a project (shows loading state)
  const [isLoading, setIsLoading] = useState(false);
  // Show success/error messages to the user
  const [message, setMessage] = useState('');
  // Form data for the new project
  // User-facing fields only
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tech: '',
    status: 'In Progress',
    slug: '',
    githubUrl: '',
    githubLabel: 'GitHub',
    liveUrl: '',
    liveLabel: 'Live Demo',
  });
  // List of all existing projects
  const [projects, setProjects] = useState([]);
  // Currently editing project (null if not editing)
  const [editingProject, setEditingProject] = useState(null);
  // Show create form or projects list
  const [view, setView] = useState('list'); // 'list' or 'create' or 'edit'

  // Load all projects when stuff mounts
  useEffect(() => {
    loadProjects();
  }, []);

  // Load all projects from Firebase
  const loadProjects = async () => {
    try {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      setMessage(`Failed to load projects: ${error.message}`);
    }
  };

  // Handle form submission - create the new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const projectData = {
        ...newProject,
        tech: newProject.tech
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        published: true,
        author: 'Risith',
      };
      const projectId = await createProject(projectData);
      setMessage(`New project created successfully! ID: ${projectId}`);
      setNewProject({
        title: '',
        description: '',
        tech: '',
        status: 'In Progress',
        slug: '',
        githubUrl: '',
        githubLabel: 'GitHub',
        liveUrl: '',
        liveLabel: 'Live Demo',
      });
      await loadProjects();
      setView('list');
    } catch (error) {
      setMessage(`Failed to create project: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing a project
  const handleEditProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const projectData = {
        ...editingProject,
        tech: editingProject.tech
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await updateProject(editingProject.id, projectData);
      setMessage(`Project updated successfully!`);
      setEditingProject(null);
      setView('list');
      await loadProjects();
    } catch (error) {
      setMessage(`Failed to update project: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a project
  const startEdit = async (projectId) => {
    try {
      const project = await getProjectById(projectId);
      if (project) {
        setEditingProject({
          id: project.id,
          title: project.title || '',
          description: project.description || '',
          tech: Array.isArray(project.tech)
            ? project.tech.join(', ')
            : project.tech || '',
          status: project.status || 'In Progress',
          githubUrl: project.githubUrl || '',
          githubLabel: project.githubLabel || 'GitHub',
          liveUrl: project.liveUrl || '',
          liveLabel: project.liveLabel || 'Live Demo',
        });
        setView('edit');
      }
    } catch (error) {
      setMessage(`Failed to load project for editing: ${error.message}`);
    }
  };

  // Delete a project
  const handleDeleteProject = async (projectId) => {
    if (
      !confirm(
        'Are you sure you want to delete this project? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await deleteProject(projectId);
      setMessage(`Project deleted successfully!`);

      // Reload projects list
      await loadProjects();
    } catch (error) {
      setMessage(`Failed to delete project: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 rounded font-medium ${
            view === 'list'
              ? 'bg-purple-400 text-black'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          View Projects
        </button>
        <button
          onClick={() => setView('create')}
          className={`px-4 py-2 rounded font-medium ${
            view === 'create'
              ? 'bg-purple-400 text-black'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          Create New Project
        </button>
      </div>

      {/* Message Display - shows success or error messages */}
      {message && (
        <div
          className={`p-3 rounded ${
            message.includes('successfully')
              ? 'bg-green-900/20 border border-green-700 text-green-300'
              : 'bg-red-900/20 border border-red-700 text-red-300'
          }`}
        >
          {message}
        </div>
      )}

      {/* Projects List View */}
      {view === 'list' && (
        <div className="border border-gray-700 rounded p-4">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            All Projects
          </h3>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-gray-400">No projects found.</p>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-600 rounded p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-black dark:text-white">
                      {project.title}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(project.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(project.tech) &&
                      project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded text-xs font-semibold shadow-sm border border-purple-300 dark:border-purple-700"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                  <div className="text-gray-700 dark:text-gray-400 text-xs">
                    <span className="font-medium">
                      Created: {formatProjectDateFull(project.createdAt)}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-blue-700 dark:text-blue-300">
                      Status: {project.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create New Project Section */}
      {view === 'create' && (
        <div className="border border-gray-700 rounded p-4">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Create New Project
          </h3>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({ ...newProject, title: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                rows={3}
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={newProject.tech}
                onChange={(e) =>
                  setNewProject({ ...newProject, tech: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="e.g., React, Node.js, MongoDB"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Status
              </label>
              <select
                value={newProject.status}
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Planning">Planning</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Slug (optional, for internal reference)
              </label>
              <input
                type="text"
                value={newProject.slug}
                onChange={(e) =>
                  setNewProject({ ...newProject, slug: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="e.g., my-awesome-project"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                GitHub Link
              </label>
              <input
                type="url"
                value={newProject.githubUrl}
                onChange={(e) =>
                  setNewProject({ ...newProject, githubUrl: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="https://github.com/username/project"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                GitHub Link Label
              </label>
              <input
                type="text"
                value={newProject.githubLabel}
                onChange={(e) =>
                  setNewProject({ ...newProject, githubLabel: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="GitHub"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Project Link
              </label>
              <input
                type="url"
                value={newProject.liveUrl}
                onChange={(e) =>
                  setNewProject({ ...newProject, liveUrl: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="https://project-demo.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Project Link Label
              </label>
              <input
                type="text"
                value={newProject.liveLabel}
                onChange={(e) =>
                  setNewProject({ ...newProject, liveLabel: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="Live Demo"
              />
            </div>

            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </PrimaryButton>
          </form>
        </div>
      )}

      {/* Edit Project Section */}
      {view === 'edit' && editingProject && (
        <div className="border border-gray-700 rounded p-4">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Edit Project
          </h3>
          <form onSubmit={handleEditProject} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={editingProject.title}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    title: e.target.value,
                  })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={editingProject.description}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={editingProject.tech}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, tech: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="e.g., React, Node.js, MongoDB"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Status
              </label>
              <select
                value={editingProject.status}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    status: e.target.value,
                  })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Planning">Planning</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Slug (optional, for internal reference)
              </label>
              <input
                type="text"
                value={editingProject.slug || ''}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, slug: e.target.value })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="e.g., my-awesome-project"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                GitHub Link
              </label>
              <input
                type="url"
                value={editingProject.githubUrl}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    githubUrl: e.target.value,
                  })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="https://github.com/username/project"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                GitHub Link Label
              </label>
              <input
                type="text"
                value={editingProject.githubLabel}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    githubLabel: e.target.value,
                  })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="GitHub"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Project Link
              </label>
              <input
                type="url"
                value={editingProject.liveUrl}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    liveUrl: e.target.value,
                  })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="https://project-demo.com"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Project Link Label
              </label>
              <input
                type="text"
                value={editingProject.liveLabel}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    liveLabel: e.target.value,
                  })
                }
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="Live Demo"
              />
            </div>

            <div className="flex gap-4">
              <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Project'}
              </PrimaryButton>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setView('list');
                }}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
