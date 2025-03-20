import React from 'react';
import Hero from './Components/Hero';
import Navbar from './Components/Navbar';
import About from './Components/About';
import Experience from './Components/Experience';
import Projects from './Components/Projects';
import Contact from './Components/Contact';
import { useEffect, useState } from 'react';
import HashLoader from "react-spinners/HashLoader";

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, 3000);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 z-20 flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      >
        <HashLoader
          color={'#3b00ff'}
          loading={loading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>

      <div
        className={`transition-opacity duration-1000 ease-in-out ${fadeOut ? 'opacity-100' : 'opacity-0'}`}
      >
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </div>
    </>
  );
}

export default App;
