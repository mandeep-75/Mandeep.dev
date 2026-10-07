import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projects } from "../../data/portfolio";
import Button from "../ui/Button";
import Word3D from "../ui/Word3D";
import {
  DURATION,
  EASE_OUT,
  WORD_PERSPECTIVE,
  eyebrowFlatVariants,
  eyebrowVariants,
  useReducedMotion,
} from "../../lib/motion";

// Featured: First 2 projects, Recent: Last projects
const featuredProjects = projects.slice(0, 2);
const recentProjects = projects.slice(2);

/* Module-scope so the reference stays stable across renders — a fresh variants
   object every render makes framer re-resolve the animation on each pass.
   `delayChildren` is tuned to the black frame's 0.9s expand: the cards start
   lifting at roughly the quarter-way mark so the two read as one sequence
   rather than two things that happen to overlap. */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.25,
    },
  },
};

const CARD_REVEAL = {
  hidden: { opacity: 0, y: 64, z: -240, rotateX: 15, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    z: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: DURATION.scene, ease: EASE_OUT },
  },
};

const CARD_REVEAL_FLAT = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/* Per-image framing. Every shot is one static `object-cover` plane; what
   varies is where the crop lands, so each screenshot still reads as a
   recognisable product shot inside both the featured (h-72/md:h-80) and the
   small (h-52) frame. Defaults: anchored to the top, because every one of
   these images keeps its identity — nav, hero, terminal prompt — in the
   first rows and loses it at the bottom.

   `Nexus Go` is a composite: four app screens sit in the left ~46% and the
   right half is a near-empty light panel. Rendered at 200% width and
   anchored to the left, the phones fill the frame instead of the blank
   panel; the 35% vertical anchor lands on the first screen pair at all
   three card widths (1440 / 768 / 390). */
const IMAGE_FIT = {
  'Nexus Go': 'h-full w-[200%] max-w-none object-cover object-[50%_35%]',
};
const DEFAULT_IMAGE_FIT = 'h-full w-full object-cover object-top';

function ProjectCard({ project, featured = false, reducedMotion, offset = false }) {
  /* Cards are static surfaces: no pointer tilt, no hover lift. (A 3D wrapper
     around the card kept the buttons inside it from receiving clicks.) The
     entrance reveal below is untouched — it runs once and leaves the card at
     its resting transform. */
  /* One card per track: a card is never allowed to span the centre band.
     `offset` drops right-hand cards 96px so the two tracks interleave. */
  return (
    <motion.div
      variants={reducedMotion ? CARD_REVEAL_FLAT : CARD_REVEAL}
      className={`col-span-1 ${offset ? 'lg:mt-24' : ''}`}
    >
      <div className="h-full">
        <div
          className={`
            group relative flex h-full flex-col
            overflow-hidden rounded-2xl
            border border-[rgba(253,241,232,0.18)]
            transition-colors duration-300 hover:border-[rgba(253,241,232,0.35)]
          `}
        >
          {/* Media — one screenshot, cropped by IMAGE_FIT */}
          <div className={`
            relative overflow-hidden
            ${featured ? "h-72 md:h-80" : "h-52"}
          `}>
            {/* One static screenshot, cropped by IMAGE_FIT. The overflow-hidden
                box is the only thing that ever shows the image, so the 200%-wide
                Nexus Go plane can never poke past the card's rounded corners. */}
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              className={IMAGE_FIT[project.title] || DEFAULT_IMAGE_FIT}
            />

            {/* Bottom fade — dissolves the shot into the red page, where it used
                to fade into the card's white surface. Anchored to the lower 58%
                rather than the whole frame: the seam at the very bottom stays
                opaque #a50f18 (identical to the card body below it, so there is
                no cut), while the top 42% of every screenshot now stays clean
                instead of sitting under a 55%-red wash. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[58%] bg-gradient-to-t from-[#a50f18] via-[#a50f18]/55 to-transparent" />

            {/* Project Type Badge — a translucent dark chip, because this one
                sits on the screenshot itself and needs its own contrast
                whatever the image does underneath it. */}
            <div className="absolute top-4 left-4 z-20">
              <span className={`rounded-full border bg-[rgba(0,0,0,0.4)] px-3 py-1 font-mono text-xs uppercase tracking-wider backdrop-blur-sm ${project.forSale ? 'border-[rgba(255,209,102,0.45)] text-[#ffd166]' : 'border-[rgba(253,241,232,0.4)] text-[#fdf1e8]'}`}>
                {project.forSale ? "★ For Sale" : featured ? "★ Featured" : "Project"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-6 md:p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className={`mb-2 font-bold text-[#fdf1e8] transition-colors group-hover:text-[#ffd166] ${
                  featured ? "text-2xl md:text-3xl" : "text-xl"
                }`}>
                  {project.title}
                </h3>
                <p className={`leading-relaxed text-[#f3d9cf] ${
                  featured ? "text-base md:text-lg" : "text-sm"
                }`}>
                  {project.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[rgba(253,241,232,0.25)] px-3 py-1 text-xs font-medium text-[#f3d9cf] transition-colors hover:border-[rgba(255,209,102,0.5)] hover:text-[#ffd166]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Bottom section pushed to bottom when card is stretched */}
            <div className="mt-auto">
              {/* Actions — wraps inside a 36% side track so three buttons
                  never clip at 1024px. */}
              <div className="flex flex-wrap items-center gap-3">
                {project.privateCode ? (
                  <Link to="/youtube-automation">
                    <Button variant="primary" size="sm" className="flex items-center gap-2 px-5 py-2.5 text-sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </Button>
                  </Link>
                ) : project.github ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    Code
                  </Button>
                ) : null}
                {project.video && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm"
                    href={project.video}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                    className="flex items-center gap-2 px-5 py-2.5 text-sm"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {project.forSale ? "Buy Now" : "Live Demo"}
                  </Button>
                )}
              </div>

              {/* Social Links */}
              {project.socialLinks && (
                <div className="mt-5 flex items-center gap-4 border-t border-[rgba(253,241,232,0.18)] pt-5">
                  {project.socialLinks.youtube && (
                    <a
                      href={project.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[rgba(253,241,232,0.85)] transition-colors hover:text-[#ffd166]"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                      className="flex items-center gap-2 text-sm text-[rgba(253,241,232,0.85)] transition-colors hover:text-[#ffd166]"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-2.6 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="text-xs uppercase tracking-wider">Instagram</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Decorative corner glow — amber now, since there is no white
              surface left for the terracotta wash to sit on. */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[rgba(255,209,102,0.06)] blur-3xl transition-colors duration-500 group-hover:bg-[rgba(255,209,102,0.12)]" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="projects" className="py-32">
      {/* The section header is the one block on the page that is centred
          rather than track-aligned: eyebrow, title and intro read as a single
          masthead above the zigzag of cards. Same edge padding as the grids
          below, then mx-auto holds the measure in the middle. */}
      <div className="px-5 sm:px-8 lg:px-10 xl:px-16">
        {/* Section Header */}
        <motion.div
          variants={reducedMotion ? eyebrowFlatVariants : eyebrowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#ffd166]" />
            <span className="font-mono text-sm uppercase tracking-wider text-[#ffd166]">
              My Work
            </span>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#ffd166]" />
          </div>

          <h2 className="mb-4 text-4xl font-bold text-[#fdf1e8] md:text-5xl">
            <Word3D as="span" text="Featured" style={WORD_PERSPECTIVE} className="text-[#fdf1e8]" />{" "}
            <Word3D
              as="span"
              text="Projects"
              style={WORD_PERSPECTIVE}
              className="gradient-text"
              delay={0.14}
              depth={260}
            />
          </h2>

          <motion.p
            className="text-lg leading-relaxed text-[#f3d9cf]"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: DURATION.reveal, ease: EASE_OUT, delay: 0.25 }}
          >
            A selection of projects that showcase my expertise in building modern,
            performant, and user-centered applications.
          </motion.p>
        </motion.div>
      </div>

      {/* The card grids share the section's edge padding but not a max-width:
          each track is min(36%, 36rem) — the same measure SideColumn gives
          every other block, so the two stay flush at ultrawide too — with
          `justify-between`, so the free space collects in the middle as the
          protected centre band. Odd-indexed (right-hand) cards carry
          `lg:mt-24`, which is what turns two parallel columns into a zigzag:
          card 2 starts 96px below card 1, the row grows with it, and every
          right-hand card below repeats that same 96px drop, so the tracks
          read as a diagonal step rather than a symmetric grid row. */}
      <div className="relative px-5 sm:px-8 lg:px-10 xl:px-16">
        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="depth-context relative z-10 mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[min(36%,36rem)_min(36%,36rem)] lg:justify-between"
          >
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={true}
                reducedMotion={reducedMotion}
                offset={index % 2 === 1}
              />
            ))}
          </motion.div>
        )}

        {recentProjects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="depth-context relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[min(36%,36rem)_min(36%,36rem)] lg:justify-between lg:gap-8"
          >
            {recentProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={false}
                reducedMotion={reducedMotion}
                offset={index % 2 === 1}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
