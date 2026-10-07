import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import {
  DURATION,
  EASE_OUT,
  useReducedMotion,
} from '../lib/motion';

/* The hero's reveal vocabulary, reused verbatim so this page reads as part of
   the same film: a short rise on EASE_OUT at each stage of the sequence, and
   a flat opacity counterpart so reduced motion gets the same choreography
   without any travel. Module scope keeps the refs stable across renders — a
   fresh variants object every render makes framer re-resolve each animation. */
const RISE = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE_OUT },
  },
};

const RISE_FLAT = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

/* One base URL, width appended at the call site. The frame is 896px wide at
   desktop (max-w-4xl), so a single 800px asset was being upscaled there;
   srcset lets each viewport pull the width it actually paints. Every width
   keeps the source 4:3 ratio, so width/height stay truthful at 800x600. */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=';

export default function YouTubeAutomation() {
    const reducedMotion = useReducedMotion();
    const navigate = useNavigate();
    /* Child elements swap to the flat variant; the containers keep their
       stagger, which under reduced motion only sequences opacity fades. */
    const rise = reducedMotion ? RISE_FLAT : RISE;

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#2d2a24] py-32 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Stage 1 — the way back, so the escape hatch lands first. */}
                <motion.div
                    className="mb-8"
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.reveal, ease: EASE_OUT }}
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[#6b6560] hover:text-[#c25a3e] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </motion.div>

                {/* Stage 2 — the hero image. */}
                <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.reveal, ease: EASE_OUT, delay: 0.08 }}
                    className="relative h-80 overflow-hidden rounded-2xl mb-10"
                >
                    {/* Eager on purpose: at both 1440x900 and 390x844 this
                        frame sits above the fold and is the LCP candidate, so
                        no loading="lazy" — only the fetchpriority hint. The
                        frame is h-80 with overflow-hidden and rounded-2xl, so
                        the image fills a fixed box (no CLS, no overflow) and
                        the rounding lives on the frame, not the img. */}
                    <img
                        src={`${HERO_IMAGE}1200`}
                        srcSet={`${HERO_IMAGE}800 800w, ${HERO_IMAGE}1200 1200w, ${HERO_IMAGE}1600 1600w`}
                        sizes="(max-width: 928px) calc(100vw - 2rem), 896px"
                        width={800}
                        height={600}
                        alt="Red letter N on a dark navy background"
                        fetchPriority="high"
                        className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-[#faf9f6]/40 to-transparent" />
                    <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 text-sm font-mono uppercase tracking-wider bg-white/80 backdrop-blur-sm text-[#4a6a7a] rounded-full border border-[rgba(74,106,122,0.2)]">
                            Automation Service
                        </span>
                    </div>
                </motion.div>

                {/* Stage 3 — headline and lede together, one rigid unit. */}
                <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.scene, ease: EASE_OUT, delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2d2a24] mb-6">
                        YouTube <span className="gradient-text">Automation</span>
                    </h1>
                    <p className="text-[#6b6560] text-lg md:text-xl leading-relaxed mb-10">
                        AI-powered pipeline that transforms raw videos into narrated YouTube Shorts with auto-upload. 
                        Perfect for content creators looking to scale their YouTube presence without spending hours on editing.
                    </p>
                </motion.div>

                {/* Stage 4 — the feature cards rise one after another as they
                    come into view, the way the About stats and the project
                    cards do. */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={STAGGER}
                    className="grid md:grid-cols-2 gap-6 mb-10"
                >
                    {[
                        { icon: "🎬", title: "AI Script Generation", desc: "Automatic script creation based on your topic" },
                        { icon: "🎙️", title: "Voiceover Synthesis", desc: "Natural AI voices in multiple languages" },
                        { icon: "✂️", title: "Auto Video Editing", desc: "Smart cuts, transitions, and effects" },
                        { icon: "📊", title: "SEO Optimization", desc: "Tags, titles, and descriptions optimized" },
                        { icon: "🚀", title: "Auto Upload & Scheduling", desc: "Publish automatically on schedule" },
                    ].map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={rise}
                            className="bg-white border border-[rgba(45,42,36,0.08)] rounded-xl p-6 hover:border-[rgba(194,90,62,0.2)] transition-colors"
                        >
                            <span className="text-3xl mb-3 block">{feature.icon}</span>
                            <h3 className="text-lg font-semibold text-[#2d2a24] mb-2">{feature.title}</h3>
                            <p className="text-[#6b6560] text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stage 5 — the call to action. */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={rise}
                    className="bg-white rounded-2xl p-8 mb-10 border border-[rgba(45,42,36,0.1)]"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        {/* Real anchors/buttons, never <a><button> nesting —
                            one tab stop, valid HTML, and the home link goes
                            through the router so the basename survives. */}
                        <Button
                            variant="outline"
                            className="w-full md:w-auto"
                            href="https://youtube.com/@bangb_iteeg"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            View Sample Channel
                        </Button>
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full md:w-auto"
                            onClick={() => navigate('/?contact=true')}
                        >
                            Contact Dev for Code
                        </Button>
                    </div>
                </motion.div>

                {/* Stage 6 — How It Works: the block itself holds still while
                    its heading and each step stagger in behind it. */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={STAGGER}
                    className="bg-[#f5f3ef] rounded-2xl p-8 border border-[rgba(45,42,36,0.06)]"
                >
                    <motion.h2 variants={rise} className="text-2xl font-bold text-[#2d2a24] mb-6">
                        How It Works
                    </motion.h2>
                    <div className="space-y-6">
                        {[
                            { step: "01", title: "Share Your Content", desc: "Provide raw footage or topic ideas" },
                            { step: "02", title: "AI Processing", desc: "Our AI generates scripts, voiceovers, and edits" },
                            { step: "03", title: "Review & Approve", desc: "Preview and make any adjustments" },
                            { step: "04", title: "Auto Publish", desc: "Content goes live automatically" },
                        ].map((item) => (
                            <motion.div key={item.step} variants={rise} className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-[rgba(194,90,62,0.08)] border border-[rgba(194,90,62,0.2)] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#c25a3e] font-mono font-bold">{item.step}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[#2d2a24]">{item.title}</h3>
                                    <p className="text-[#6b6560]">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
