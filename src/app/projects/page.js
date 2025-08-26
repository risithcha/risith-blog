// Imports
import Navigation from '../../components/Navigation';

// Projects showcase page
export default function ProjectsPage() {
  // List of projects to display
  const projects = [
    {
      id: 1,
      title: "Personal Blog",
      description: "A modern blog built with Next.js and Tailwind CSS",
      tech: ["Next.js", "React", "Tailwind CSS"],
      status: "In Progress"
    }
  ];

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
            {projects.map((project) => (
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
                      {project.tech.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {/* Project status */}
                    <div className="text-sm">
                      <span className="text-gray-500">Status: </span>
                      <span className={`font-medium ${
                        project.status === 'Completed' 
                          ? 'text-green-400' 
                          : 'text-yellow-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
