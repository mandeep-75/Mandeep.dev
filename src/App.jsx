import Footer from './components/common/Footer';
import CustomCursor from './components/cursor/CustomCursor';

import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Hero from './components/sections/Hero';
import Skills from './components/sections/Skills';
import Socials from './components/sections/Social';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import ProgressBar from './components/ui/ProgressBar';

function App() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen font-sans text-white">
           
        <CustomCursor />
        <Hero />
        <Card title={"mandeep singh" }description={"lol test"}/>
        <About />
         <Button/> 
        <Skills />
        <Socials />
        <Contact />
      <Footer />
    </div>
  );
}
export default App;
