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

  /** Advances the GitHub carousel to the next project (wraps around). */
  const nextProject = () => {
    if (projects.length === 0) return;
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };
  
  /** Moves the GitHub carousel to the previous project (wraps around). */
  const prevProject = () => {
    if (projects.length === 0) return;
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <>
      {/* --- [G] GitHub projects banner carousel with navigation --- */}
          <div className="group rounded-3xl border-2 border-[#2c3e50] bg-gradient-to-br from-gray-900 to-gray-800 p-5 min-h-[150px] desk:min-h-0 col-span-2 order-5 desk:order-none hover:-translate-y-1 transition-transform overflow-hidden shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Github className="text-white" size={24} />
                <h3 className="font-bold text-lg text-white leading-tight">GitHub Projects</h3>
              </div>
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

            {/* Project carousel */}
            {projects.length > 0 ? (
              <a 
                href={projects[currentProject]?.url || "#"}
                target="_blank"
                rel="noopener noreferrer" 
                className="block bg-gray-800/50 rounded-xl p-2 border border-gray-700 hover:bg-gray-700/60 hover:border-gray-500 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-base">{projects[currentProject]?.name}</h4>
                    <p className="text-sm text-gray-300 mt-1">{projects[currentProject]?.desc}</p>
                    <p className="text-xs text-gray-400 mt-2">{projects[currentProject]?.tags}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm">{projects[currentProject]?.stars}</span>
                  </div>
                </div>
              </a>
            ) : (
              <div className="block bg-gray-800/50 rounded-xl p-2 border border-gray-700 h-[88px] flex items-center justify-center">
                <span className="animate-pulse text-gray-500 text-xs">Loading...</span>
              </div>
            )}

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