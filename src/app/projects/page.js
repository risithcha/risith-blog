// Imports
import PageLayout from '../../components/PageLayout';
import ContentContainer from '../../components/ContentContainer';
import { getAllProjects } from '../../lib/firebase-projects';

// Projects showcase page - displays all published projects
export default async function ProjectsPage() {
  // Fetch all projects from Firebase
  let projects = [];
  try {
    projects = await getAllProjects();
  } catch (error) {
    // Fallback to empty array if fetch fails
  }

  return (
    <PageLayout>
      <ContentContainer>
        <div className="py-16">
          {/* Page header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">My Projects</h1>
            <p className="text-gray-400">
              Here are some of the projects I&apos;ve been working on.
            </p>
          </div>
          
          {/* Projects grid */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Show message if no projects, otherwise loop through each project */}
            {projects.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-400">No projects found.</p>
              </div>
            ) : (
              projects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Project status */}
                      {project.status && (
                          <div className="text-sm mb-2">
                            <span className="text-gray-500">Status: </span>
                            <span className={`font-medium ${
                              project.status === 'Completed' ? 'text-green-400' : project.status === 'In Progress' ? 'text-yellow-400' : 'text-blue-400'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        )}
                        
                        {/* Project title */}
                        {project.title && (
                          <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                        )}
                        
                        {/* Tech Stack */}
                        {Array.isArray(project.tech) && project.tech.length > 0 && (
                          <div className="mb-4">
                            <div className="text-xs text-gray-400 mb-1">Tech Stack</div>
                            <div className="flex flex-wrap gap-2">
                              {project.tech.map((tech) => (
                                <span key={tech} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">{tech}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* GitHub link */}
                        {project.githubUrl && (
                          <div className="mb-2">
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm">GitHub</a>
                          </div>
                        )}
                        
                        {/* Blog post link */}
                        {project.slug && (
                          <div className="mb-2">
                            <a href={`/blog/${project.slug}`} className="text-purple-400 hover:text-purple-300 text-sm">Blog Post</a>
                          </div>
                        )}
                        
                        {/* Project description */}
                        {project.description && (
                          <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                        )}
                        
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </ContentContainer>
    </PageLayout>
  );
}
