import { motion } from "framer-motion";
import { projects } from "../../data/portfolio";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-white mb-4">
          Featured <span className="text-blue-500">Projects</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Here are some of the projects I've worked on. Each represents a unique challenge and solution.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="h-full flex flex-col p-0 overflow-hidden group border-gray-800 bg-gray-900/40">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-300" />
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {tag}
                        </span>
                    ))}
                    </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <Button variant="outline" className="text-sm py-2 px-4 w-full" onClick={() => window.open(project.github, '_blank')}>
                    GitHub
                  </Button>
                  <Button variant="primary" className="text-sm py-2 px-4 w-full" onClick={() => window.open(project.link, '_blank')}>
                    Demo
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
