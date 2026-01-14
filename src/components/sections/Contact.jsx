import { useState } from "react";
import Button from "../ui/Button";

export default function Contact() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("sent");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="grid md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white">Let's <span className="text-blue-500">Connect</span></h2>
                <p className="text-gray-400 leading-relaxed">
                    Have a project in mind or want to discuss the latest tech? I'm always open to new opportunities and collaborations. Drop me a message!
                </p>
                <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4 text-gray-300">
                        <span className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-blue-400">✉️</span>
                        <span>hello@mandeep.dev</span>
                    </div>
                     <div className="flex items-center gap-4 text-gray-300">
                        <span className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-blue-400">📍</span>
                        <span>Remote / Worldwide</span>
                    </div>
                </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium ml-1">Email</label>
                    <input
                    className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    type="email"
                    placeholder="john@example.com"
                    required
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium ml-1">Message</label>
                    <textarea
                    className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    rows="4"
                    placeholder="Tell me about your project..."
                    required
                    ></textarea>
                </div>

                <Button 
                    type="submit" 
                    disabled={status === "sending"}
                    className="w-full"
                    variant={status === "sent" ? "secondary" : "primary"}
                >
                    {status === "sending" ? "Sending..." : status === "sent" ? "Message Sent!" : "Send Message"}
                </Button>
            </form>
        </div>
      </div>
    </section>
  );
}
