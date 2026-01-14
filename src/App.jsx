import React, { Suspense } from 'react';
import CustomCursor from './components/cursor/CustomCursor';
import Footer from './components/common/Footer';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Hero from './components/sections/Hero';
import Skills from './components/sections/Skills';
import Socials from './components/sections/Social';

function App() {
  return (
    <div className="bg-black min-h-screen font-sans text-white selection:bg-blue-500/30">
        <CustomCursor />
        
        <main className="space-y-0">
            <Hero />
            <About />
            <Skills />
            <Socials />
            <Contact />
        </main>

        <Footer />
    </div>
  );
}

export default App;
