// Imports
import Navigation from '../../components/Navigation';
import { getAllProjects } from '../../lib/firebase-projects';

// Projects showcase page
export default async function ProjectsPage() {
  // Fetch projects from Firebase
  let projects = [];
  try {
    projects = await getAllProjects();
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Fallback to empty array if fetch fails
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation bar */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 w-full">
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
            {/* Loop through each project */}
            {projects.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-400">No projects found.</p>
              </div>
            ) : (
              projects.map((project) => (
                // Project card
                <div 
                  key={project.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Project title */}
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {project.title}
                      </h3>
                      {/* Project description */}
                      <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                      
                      {/* Technologies used */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Array.isArray(project.tech) && project.tech.map((tech) => (
                          <span 
                            key={tech}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                                             {/* Project links */}
                       {(project.githubUrl || project.liveUrl) && (
                         <div className="flex gap-2 mb-4">
                           {project.githubUrl && (
                             <a 
                               href={project.githubUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-purple-400 hover:text-purple-300 text-sm"
                             >
                               GitHub
                             </a>
                           )}
                           {project.liveUrl && (
                             <a 
                               href={project.liveUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-purple-400 hover:text-purple-300 text-sm"
                             >
                               Live Demo
                             </a>
                           )}
                         </div>
                       )}
                      
                      {/* Project status */}
                      <div className="text-sm">
                        <span className="text-gray-500">Status: </span>
                        <span className={`font-medium ${
                          project.status === 'Completed' 
                            ? 'text-green-400' 
                            : project.status === 'In Progress'
                            ? 'text-yellow-400'
                            : 'text-blue-400'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
