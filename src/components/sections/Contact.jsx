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
                <div className="relative bg-white border border-[rgba(45,42,36,0.08)] rounded-3xl p-8 md:p-12 overflow-hidden">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[rgba(194,90,62,0.2)] rounded-tl-3xl" />
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[rgba(74,106,122,0.2)] rounded-tr-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-[rgba(90,122,138,0.2)] rounded-bl-3xl" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[rgba(212,137,91,0.2)] rounded-br-3xl" />
                    
                    {/* Subtle gradient orbs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(194,90,62,0.03)] rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[rgba(74,106,122,0.03)] rounded-full blur-[100px] -ml-32 -mb-32" />

                    <div className="max-w-xl mx-auto relative z-10">
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#c25a3e]" />
                                    <span className="text-[#c25a3e] font-mono text-sm uppercase tracking-wider">
                                        Get in Touch
                                    </span>
                                    <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[#c25a3e]" />
                                </div>
                                <h2 className="text-4xl font-bold text-[#2d2a24] mb-4">
                                    Let's <span className="gradient-text">Connect</span>
                                </h2>
                            </motion.div>

                            <motion.p 
                                className="text-[#6b6560]"
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
                                    className="peer w-full bg-[#f5f3ef] border border-[rgba(45,42,36,0.08)] rounded-xl px-4 py-4 text-[#2d2a24] placeholder-transparent focus:border-[#c25a3e] focus:border-opacity-50 outline-none transition-colors"
                                />
                                <label className="absolute left-4 top-4 text-[#9c958d] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#c25a3e] peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs bg-[#f5f3ef] px-1">
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
                                    className="peer w-full bg-[#f5f3ef] border border-[rgba(45,42,36,0.08)] rounded-xl px-4 py-4 text-[#2d2a24] placeholder-transparent focus:border-[#c25a3e] focus:border-opacity-50 outline-none transition-colors"
                                />
                                <label className="absolute left-4 top-4 text-[#9c958d] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#c25a3e] peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs bg-[#f5f3ef] px-1">
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
                                    className="peer w-full bg-[#f5f3ef] border border-[rgba(45,42,36,0.08)] rounded-xl px-4 py-4 text-[#2d2a24] placeholder-transparent focus:border-[#c25a3e] focus:border-opacity-50 outline-none transition-colors resize-none"
                                />
                                <label className="absolute left-4 top-4 text-[#9c958d] text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#c25a3e] peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs bg-[#f5f3ef] px-1">
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
