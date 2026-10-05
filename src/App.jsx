import { useEffect } from 'react';
import CustomCursor from './components/cursor/CustomCursor';
import Footer from './components/common/Footer';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Socials from './components/sections/Social';
import WebGLBackdrop from './components/webgl/WebGLBackdrop';
import { trackPointer } from './lib/pointer';

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('contact') === 'true') {
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  // One listener for the whole site, feeding the shared pointer MotionValues
  // that every depth layer reads. Returns its own cleanup.
  useEffect(() => trackPointer(), []);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2d2a24] selection:bg-[rgba(194,90,62,0.15)] relative overflow-hidden noise-overlay">
        <CustomCursor />

        {/* The fixed backdrop the whole page sits inside: real 3D where the
            browser supports it, and the CSS depth stage where it doesn't. Same
            z-index and same role either way, so nothing above it moves. */}
        <WebGLBackdrop />

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
