import { useEffect } from 'react';
import CustomCursor from './components/cursor/CustomCursor';
import Footer from './components/common/Footer';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Socials from './components/sections/Social';

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('contact') === 'true') {
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f8f8f2] selection:bg-[rgba(0,245,212,0.3)] relative overflow-hidden noise-overlay">
        <CustomCursor />
        
        <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[rgba(0,245,212,0.08)] rounded-full blur-[150px] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[rgba(255,0,110,0.06)] rounded-full blur-[180px] pointer-events-none" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[rgba(131,56,236,0.04)] rounded-full blur-[200px] pointer-events-none" />

        <main className="relative z-10">
            <Hero />
            <About />
            <Socials />
            <Projects />
            <Contact />
        </main>

        <Footer />
    </div>
  );
}
