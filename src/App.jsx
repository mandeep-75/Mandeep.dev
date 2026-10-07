import { useEffect } from 'react';
import CustomCursor from './components/cursor/CustomCursor';
import Footer from './components/common/Footer';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import WebGLBackdrop from './components/webgl/WebGLBackdrop';
import { trackPointer } from './lib/pointer';
import { initSmoothScroll, scrollToSection } from './lib/smoothScroll';

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('contact') === 'true') {
      setTimeout(() => {
        scrollToSection('contact');
      }, 100);
    }
  }, []);

  // One listener for the whole site, feeding the shared pointer MotionValues
  // that every depth layer reads. Returns its own cleanup.
  useEffect(() => trackPointer(), []);

  // Heavy wheel scrolling: one engine for the wheel and for every in-page
  // jump, so all travel on the page settles with the same weight. Reduced
  // motion gets native, instant scrolling from inside the engine.
  useEffect(() => initSmoothScroll(), []);

  return (
    <div className="min-h-screen bg-[#a50f18] text-[#fdf1e8] selection:bg-[rgba(255,209,102,0.35)] relative overflow-hidden noise-overlay">
        <CustomCursor />

        {/* The fixed backdrop the whole page sits inside: real 3D where the
            browser supports it, and the CSS depth stage where it doesn't. Same
            z-index and same role either way, so nothing above it moves. */}
        <WebGLBackdrop />

        <main className="relative z-10">
            <Hero />
            <About />
            <Projects />
            <Contact />
        </main>

        <Footer />
    </div>
  );
}
