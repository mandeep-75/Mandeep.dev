import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import Button from "../ui/Button";

export default function Contact() {

    const [status, setStatus] = useState("idle");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setStatus("sending");

        try {
            await emailjs.sendForm(
                "service_o2a6vdd",
                "template_c8lfe1d",
                e.target,
                "G3x_CFX0uX_Nh81gy"
            );

            setStatus("sent");
            console.log("Message sent successfully!");
            e.target.reset();

            setTimeout(() => setStatus("idle"), 3000);
        } catch (error) {
            console.error("EmailJS Error:", error);
            alert("Failed to send message. Please try again.");
            setStatus("idle");
        }
    };

    return (
        <section id="contact" className="py-32 px-4">
            <div className="max-w-5xl mx-auto">
                
                {/* Decorative background elements */}
                <div className="relative bg-[#12121a] border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 md:p-12 overflow-hidden">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#00f5d4]/30 rounded-tl-3xl" />
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#ff006e]/30 rounded-tr-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-[#8338ec]/30 rounded-bl-3xl" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#ffd60a]/30 rounded-br-3xl" />
                    
                    {/* Gradient orbs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(0,245,212,0.05)] rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[rgba(255,0,110,0.05)] rounded-full blur-[100px] -ml-32 -mb-32" />

                    <div className="max-w-xl mx-auto relative z-10">
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#00f5d4]" />
                                    <span className="text-[#00f5d4] font-mono text-sm uppercase tracking-wider">
                                        Get in Touch
                                    </span>
                                    <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#00f5d4]" />
                                </div>
                                <h2 className="text-4xl font-bold text-[#f8f8f2] mb-4">
                                    Let's <span className="gradient-text">Connect</span>
                                </h2>
                            </motion.div>

                            <motion.p 
                                className="text-[#a0a0b0]"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                Have a project in mind? Let's talk.
                            </motion.p>
                        </div>

                        <motion.form 
                            onSubmit={handleSubmit} 
                            className="space-y-5"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >

                            {/* NAME */}
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder=" "
                                    className="peer w-full bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-4 text-[#f8f8f2] placeholder-transparent focus:border-[#00f5d4] focus:border-opacity-50 outline-none transition-colors"
                                />
                                <label className="absolute left-4 top-4 text-[#606070] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#00f5d4] peer-focus:bg-[#12121a] peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs bg-[#1a1a24] px-1">
                                    Name
                                </label>
                            </div>

                            {/* EMAIL */}
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder=" "
                                    className="peer w-full bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-4 text-[#f8f8f2] placeholder-transparent focus:border-[#00f5d4] focus:border-opacity-50 outline-none transition-colors"
                                />
                                <label className="absolute left-4 top-4 text-[#606070] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#00f5d4] peer-focus:bg-[#12121a] peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs bg-[#1a1a24] px-1">
                                    Email
                                </label>
                            </div>

                            {/* MESSAGE */}
                            <div className="relative">
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    placeholder=" "
                                    className="peer w-full bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-4 text-[#f8f8f2] placeholder-transparent focus:border-[#00f5d4] focus:border-opacity-50 outline-none transition-colors resize-none"
                                />
                                <label className="absolute left-4 top-4 text-[#606070] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#00f5d4] peer-focus:bg-[#12121a] peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs bg-[#1a1a24] px-1">
                                    Message
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={status === "sending"}
                                className="w-full"
                            >
                                {status === "sending"
                                    ? "Sending..."
                                    : status === "sent"
                                        ? "✓ Message Sent!"
                                        : "Send Message"}
                            </Button>
                        </motion.form>
                    </div>
                </div>
            </div>
        </section>
    );
}
