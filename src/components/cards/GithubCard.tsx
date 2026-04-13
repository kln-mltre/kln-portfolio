import React, { useState, useEffect } from 'react';
import { Github, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GithubCard() {
  
  // --- Projects data state ---
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches the project configuration from a remote GitHub Gist.
   * This allows real-time content updates without repository commits.
   *
   * Returns:
   * void. Updates the 'projects' and 'isLoading' states.
   */
  useEffect(() => {
    const fetchRemoteConfig = async () => {
      try {
        const GIST_URL = 'https://gist.githubusercontent.com/kln-mltre/e43307492ed0af300f3dd61dfedc039e/raw/projects.json';
        
        const response = await fetch(`${GIST_URL}?t=${new Date().getTime()}`, { 
          cache: 'no-store' 
        });

        const data = await response.json();
        setProjects(data);
        setIsLoading(false);
      } catch (error) {
        console.error("[RemoteConfig] Error loading Gist data:", error);
        setIsLoading(false);
      }
    };

    fetchRemoteConfig();
  }, []);

  // --- GitHub carousel state and navigation ---
  const [currentProject, setCurrentProject] = useState(0);
  const [previousProject, setPreviousProject] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  /** Advances the GitHub carousel to the next project (wraps around). */
  const nextProject = () => {
    if (projects.length === 0) return;
    setPreviousProject(currentProject);
    setSlideDirection('right');
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };
  
  /** Moves the GitHub carousel to the previous project (wraps around). */
  const prevProject = () => {
    if (projects.length === 0) return;
    setPreviousProject(currentProject);
    setSlideDirection('left');
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <>
      {/* --- [G] GitHub projects banner carousel with navigation --- */}
          <div className="group rounded-3xl border-2 border-[#2c3e50] bg-gradient-to-br from-gray-900 to-gray-800 p-5 min-h-[150px] desk:min-h-0 col-span-2 order-5 desk:order-none transition-transform overflow-hidden shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <a
                href="https://github.com/kln-mltre"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub profile"
                className="flex items-center gap-2 group/profile rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <Github className="text-white" size={24} />
                <h3 className="font-bold text-lg text-white leading-tight underline-offset-4 group-hover/profile:underline group-focus-visible/profile:underline">GitHub Projects</h3>
              </a>
              <div className="flex items-center gap-1">
                <button 
                  onClick={prevProject}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="text-gray-400 hover:text-white" size={20} />
                </button>
                <button 
                  onClick={nextProject}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  aria-label="Next project"
                >
                  <ChevronRight className="text-gray-400 hover:text-white" size={20} />
                </button>
              </div>
            </div>

            {/* Inject dynamic sliding animations for incoming and outgoing elements. */}
            <style>{`
              @keyframes slide-in-right {
                from { transform: translateX(110%); }
                to { transform: translateX(0); }
              }
              @keyframes slide-out-left {
                from { transform: translateX(0); }
                to { transform: translateX(-110%); }
              }
              @keyframes slide-in-left {
                from { transform: translateX(-110%); }
                to { transform: translateX(0); }
              }
              @keyframes slide-out-right {
                from { transform: translateX(0); }
                to { transform: translateX(110%); }
              }

              .animate-in-right { animation: slide-in-right 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
              .animate-out-left { animation: slide-out-left 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
              .animate-in-left { animation: slide-in-left 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
              .animate-out-right { animation: slide-out-right 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
            `}</style>

            {/* Project carousel container. 
                A single-cell CSS grid layout isolates elements, allowing them to overlap seamlessly during enter/exit animations. */}
            <div className="relative w-full grid" style={{ gridTemplateColumns: '1fr' }}>
              {projects.length > 0 ? (
                projects.map((project, idx) => {
                  
                  // Filter out inactive projects immediately to keep the DOM clean
                  if (idx !== currentProject && idx !== previousProject) return null;

                  let animClass = '';
                  
                  if (idx === currentProject) {
                    animClass = slideDirection === 'right' ? 'animate-in-right z-10' : 'animate-in-left z-10';
                  } else if (idx === previousProject && currentProject !== previousProject) {
                    animClass = slideDirection === 'right' ? 'animate-out-left z-0 pointer-events-none' : 'animate-out-right z-0 pointer-events-none';
                  }

                  return (
                    <a 
                      key={idx}
                      href={project.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className={`col-start-1 row-start-1 block bg-gray-800/50 rounded-xl p-2 border border-gray-700 hover:bg-gray-700/60 hover:border-gray-500 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 ${animClass}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-base">{project.name}</h4>
                          <p className="text-sm text-gray-300 mt-1">{project.desc}</p>
                          <p className="text-xs text-gray-400 mt-2">{project.tags}</p>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm">{project.stars}</span>
                        </div>
                      </div>
                    </a>
                  );
                })
              ) : (
                <div className="col-start-1 row-start-1 block bg-gray-800/50 rounded-xl p-2 border border-gray-700 h-[88px] flex items-center justify-center">
                  <span className="animate-pulse text-gray-500 text-xs">Loading...</span>
                </div>
              )}
            </div>

            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {projects.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentProject ? 'w-4 bg-white' : 'w-1.5 bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
    </>
  );
}