import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ValueAdder from './components/ValueAdder'
import Footer from './components/Footer'
import { useState, useRef, useEffect } from 'react';

function App() {

  const targetRef = useRef(null);
  const footerRef = useRef(null);
  const [displayButton, setButton] = useState(false);

  const handleScroll = () => {
    const { scrollTop, scrollHeight } = document.documentElement;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - footerRef.current.offsetHeight * 0.750) {
      setButton(false);
    }
    else if(scrollTop + clientHeight >= scrollHeight - targetRef.current.offsetHeight * 1.20) setButton(true);
    else setButton(false);
        
  }
  
  useEffect(()=>{ 
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  },[])
  

  return (
    <>
      <Navbar />
      <div className='innerWrapper'>
        <Hero/>
        <ValueAdder displayButton={displayButton} targetRef={targetRef} />
      </div>
      <Footer footerRef={footerRef} />
    </>
  )
}

export default App
