import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

export default function YouTubeAutomation() {
    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#2d2a24] py-32 px-4">
            <div className="max-w-4xl mx-auto">
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-[#6b6560] hover:text-[#c25a3e] transition-colors mb-8"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative h-80 overflow-hidden rounded-2xl mb-10"
                >
                    <img
                        src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"
                        alt="YouTube Automation"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-[#faf9f6]/40 to-transparent" />
                    <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 text-sm font-mono uppercase tracking-wider bg-white/80 backdrop-blur-sm text-[#4a6a7a] rounded-full border border-[rgba(74,106,122,0.2)]">
                            Automation Service
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2d2a24] mb-6">
                        YouTube <span className="gradient-text">Automation</span>
                    </h1>
                    <p className="text-[#6b6560] text-lg md:text-xl leading-relaxed mb-10">
                        AI-powered pipeline that transforms raw videos into narrated YouTube Shorts with auto-upload. 
                        Perfect for content creators looking to scale their YouTube presence without spending hours on editing.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        {[
                            { icon: "🎬", title: "AI Script Generation", desc: "Automatic script creation based on your topic" },
                            { icon: "🎙️", title: "Voiceover Synthesis", desc: "Natural AI voices in multiple languages" },
                            { icon: "✂️", title: "Auto Video Editing", desc: "Smart cuts, transitions, and effects" },
                            { icon: "📊", title: "SEO Optimization", desc: "Tags, titles, and descriptions optimized" },
                            { icon: "🚀", title: "Auto Upload & Scheduling", desc: "Publish automatically on schedule" },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-white border border-[rgba(45,42,36,0.08)] rounded-xl p-6 hover:border-[rgba(194,90,62,0.2)] transition-colors">
                                <span className="text-3xl mb-3 block">{feature.icon}</span>
                                <h3 className="text-lg font-semibold text-[#2d2a24] mb-2">{feature.title}</h3>
                                <p className="text-[#6b6560] text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl p-8 mb-10 border border-[rgba(45,42,36,0.1)]">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <a href="https://youtube.com/@bangb_iteeg" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full md:w-auto">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                    View Sample Channel
                                </Button>
                            </a>
                            <a href="/?contact=true">
                                <Button variant="primary" size="lg" className="w-full md:w-auto">
                                    Contact Dev for Code
                                </Button>
                            </a>
                        </div>
                    </div>

                    <div className="bg-[#f5f3ef] rounded-2xl p-8 border border-[rgba(45,42,36,0.06)]">
                        <h2 className="text-2xl font-bold text-[#2d2a24] mb-6">How It Works</h2>
                        <div className="space-y-6">
                            {[
                                { step: "01", title: "Share Your Content", desc: "Provide raw footage or topic ideas" },
                                { step: "02", title: "AI Processing", desc: "Our AI generates scripts, voiceovers, and edits" },
                                { step: "03", title: "Review & Approve", desc: "Preview and make any adjustments" },
                                { step: "04", title: "Auto Publish", desc: "Content goes live automatically" },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[rgba(194,90,62,0.08)] border border-[rgba(194,90,62,0.2)] flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#c25a3e] font-mono font-bold">{item.step}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#2d2a24]">{item.title}</h3>
                                        <p className="text-[#6b6560]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
