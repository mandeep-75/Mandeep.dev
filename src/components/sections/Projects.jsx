import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projects } from "../../data/portfolio";
import Button from "../ui/Button";

// Featured: First 2 projects, Recent: Last projects
const featuredProjects = projects.slice(0, 2);
const recentProjects = projects.slice(2);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function ProjectCard({ project, featured = false }) {
  return (
    <motion.div
      variants={cardVariants}
      className={`group relative ${
        featured 
          ? "col-span-1 lg:col-span-2" 
          : "col-span-1"
      }`}
    >
      <div className={`
        relative overflow-hidden
        bg-[#12121a] rounded-2xl
        border border-[rgba(255,255,255,0.08)]
        transition-all duration-500
        hover:border-[rgba(0,245,212,0.3)]
        hover:shadow-[0_0_40px_rgba(0,245,212,0.1)]
      `}>
        {/* Image/GIF Container */}
        <div className={`
          relative overflow-hidden
          ${featured ? "h-72 md:h-80" : "h-52"}
        `}>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/20 to-transparent z-10" />
          
          {/* Image with scroll animation for BlackLoop/Nexus Go or top align for certain projects */}
          {project.title === "BlackLoop" || project.title === "Nexus Go" ? (
            <div className="w-full h-[200%] absolute top-0 left-0 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full object-cover"
                style={{ 
                  animation: "scrollUp 20s linear infinite",
                  height: "200%"
                }}
              />
              <style>{`
                @keyframes scrollUp {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(-50%); }
                }
              `}</style>
            </div>
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover object-top"
            />
          )}

          {/* Project Type Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider bg-[#0a0a0f]/80 backdrop-blur-sm text-[#00f5d4] rounded-full border border-[#00f5d4]/30">
              {featured ? "★ Featured" : "Project"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className={`font-bold text-[#f8f8f2] mb-2 group-hover:text-[#00f5d4] transition-colors ${
                featured ? "text-2xl md:text-3xl" : "text-xl"
              }`}>
                {project.title}
              </h3>
              <p className={`text-[#a0a0b0] leading-relaxed ${
                featured ? "text-base md:text-lg" : "text-sm"
              }`}>
                {project.description}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 text-xs font-medium rounded-full bg-[#1a1a24] text-[#a0a0b0] border border-[rgba(255,255,255,0.08)] hover:border-[#00f5d4]/30 hover:text-[#00f5d4] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {project.privateCode ? (
              <Link to="/youtube-automation">
                <Button 
                  variant="primary" 
                  size="sm"
                  className="text-sm py-2.5 px-5 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </Button>
              </Link>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="text-sm py-2.5 px-5 flex items-center gap-2"
                onClick={() => window.open(project.github, '_blank')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                Code
              </Button>
            )}
            {project.video && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-sm py-2.5 px-5 flex items-center gap-2"
                onClick={() => window.open(project.video, '_blank')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Demo
              </Button>
            )}
            {project.link !== "#" && (
              <Button 
                variant="primary" 
                size="sm"
                className="text-sm py-2.5 px-5 flex items-center gap-2"
                onClick={() => window.open(project.link, '_blank')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </Button>
            )}
          </div>

          {/* Social Links */}
          {project.socialLinks && (
            <div className="flex items-center gap-4 mt-5 pt-5 border-t border-[rgba(255,255,255,0.08)]">
              {project.socialLinks.youtube && (
                <a
                  href={project.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#606070] hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="text-xs uppercase tracking-wider">YouTube</span>
                </a>
              )}
              {project.socialLinks.instagram && (
                <a
                  href={project.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#606070] hover:text-pink-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-xs uppercase tracking-wider">Instagram</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Decorative corner glow */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#00f5d4]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00f5d4]/10 transition-colors duration-500" />
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-[2px] bg-gradient-to-r from-[#00f5d4] to-[#8338ec]" />
          <span className="text-[#00f5d4] font-mono text-sm uppercase tracking-wider">
            My Work
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#f8f8f2] mb-4">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <p className="text-[#a0a0b0] text-lg max-w-2xl leading-relaxed">
          A selection of projects that showcase my expertise in building modern, 
          performant, and user-centered applications.
        </p>
      </motion.div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {featuredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              featured={true}
            />
          ))}
        </motion.div>
      )}

      {recentProjects.length > 0 && (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {recentProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                featured={false}
              />
            ))}
          </motion.div>
      )}
    </section>
  );
}
