import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import AOS from 'aos';
import 'aos/dist/aos.css';
import healingBg from './assets/healing/tuning-fork-2.jpg';
import aboutBg from './assets/about/about.jpeg';
import gongBg from './assets/gong/gong_bath.jpg';
import logo from './assets/logo/logo.jpg';

function HarmonicsHealing() {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [bgImage, setBgImage] = useState(healingBg);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [fadeOverlay, setFadeOverlay] = useState(0);
  const [defaultBg, setDefaultBg] = useState(healingBg);
  const lenisRef = useRef(null);
  const isTransitioningRef = useRef(false);

  const backgroundImages = {
    healing: healingBg,
    gong: gongBg,
    about: aboutBg
  };

  // Initialize Lenis
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
      offset: 120,
    });

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      AOS.refresh();
    }

    const interval = setInterval(() => {
      requestAnimationFrame(raf);
    }, 16);

    return () => {
      clearInterval(interval);
      lenis.destroy();
    };
  }, []);

  // Handle scroll to detect when to go back to home AND create parallax effect
  useEffect(() => {
    if (!lenisRef.current) return;

    const handleLenisScroll = () => {
      const scrollY = lenisRef.current.scroll;
      
      // Parallax effect on sections
      if (currentPage !== 'home') {
        const sections = document.querySelectorAll('[data-section]');
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const distance = windowHeight - rect.top;
          const parallaxAmount = Math.max(0, Math.min(distance * 0.3, 100));
          section.style.transform = `translateY(${parallaxAmount}px)`;
        });
      }
      
      // Detect scroll back to home
      if (currentPage !== 'home' && !isTransitioningRef.current && scrollY < 50) {
        isTransitioningRef.current = true;
        setFadeOverlay(1);
        
        setTimeout(() => {
          setCurrentPage('home');
          setBgImage(backgroundImages.healing);
          setDefaultBg(backgroundImages.healing);
          lenisRef.current?.scrollTo(0, { duration: 0 });
          setTimeout(() => setFadeOverlay(0), 50);
          isTransitioningRef.current = false;
        }, 250);
      }
    };

    // Use Lenis's internal RAF loop
    lenisRef.current.on('scroll', handleLenisScroll);
    
    return () => {
      if (lenisRef.current) {
        lenisRef.current.off('scroll', handleLenisScroll);
      }
    };
  }, [currentPage, backgroundImages]);

  const navigateToPage = (page) => {
    if (page === currentPage || isTransitioningRef.current) return;
    
    isTransitioningRef.current = true;
    setMenuOpen(false);
    setFadeOverlay(1);

    setTimeout(() => {
      setCurrentPage(page);
      const newBg = backgroundImages[page];
      setBgImage(newBg);
      setDefaultBg(newBg);
      
      lenisRef.current?.scrollTo(0, { duration: 0 });

      setTimeout(() => setFadeOverlay(0), 50);
      isTransitioningRef.current = false;
    }, 250);
  };

  const handleImageChange = (newImage) => {
    if (newImage === bgImage) return;
    setBgOpacity(0);
    setTimeout(() => {
      setBgImage(newImage);
      setTimeout(() => setBgOpacity(1), 5);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (bgImage !== defaultBg) {
      setBgOpacity(0);
      setTimeout(() => {
        setBgImage(defaultBg);
        setTimeout(() => setBgOpacity(1), 5);
      }, 150);
    }
  };

  return (
    <div>
      {/* Fade Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        opacity: fadeOverlay,
        transition: 'opacity 0.25s ease',
        zIndex: 3000,
        pointerEvents: fadeOverlay > 0 ? 'all' : 'none'
      }}></div>

      {/* Catchphrase */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        fontSize: '1.2rem',
        fontWeight: 300,
        letterSpacing: '2px',
        textAlign: 'center',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        padding: '0 1rem',
        whiteSpace: 'normal',
        maxWidth: '70%'
      }}>
        Tuned to Harmony, Healed by Sound
      </div>

      {/* Logo */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        left: '2rem',
        zIndex: 2000,
        opacity: 0.5,
        cursor: 'pointer'
      }}
      onClick={() => navigateToPage('home')}
      >
        <img 
          src={logo} 
          alt="Logo" 
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Hamburger Menu */}
      <div 
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          width: '30px',
          height: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          zIndex: 2001
        }}
      >
        <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(8px, 8px)' : 'none' }}></span>
        <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }}></span>
        <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none' }}></span>
      </div>

      {/* Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          paddingTop: '1.5rem',
          paddingRight: '1.5rem',
          zIndex: 1999
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'right' }}>
            <a href="https://www.instagram.com/harmonicsandhealing/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'white', textDecoration: 'none', letterSpacing: '1.5px' }}>Insta</a>
            <a href="https://www.facebook.com/profile.php?id=61581215911617" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'white', textDecoration: 'none', letterSpacing: '1.5px' }}>Facebook</a>
            <a href="https://calendly.com/harmonicsandhealingny" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'white', textDecoration: 'none', letterSpacing: '1.5px' }}>Book Now</a>
            <button onClick={() => { setMenuOpen(false); navigateToPage('about'); }} style={{ fontSize: '0.75rem', color: 'white', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '1.5px' }}>About</button>
          </div>
        </div>
      )}

      {/* Home Page */}
      {currentPage === 'home' && (
        <section style={{
          height: '100vh',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: bgOpacity,
            transition: 'opacity 0.3s ease'
          }}></div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', padding: '2rem 4rem', margin: '-2rem -4rem' }} onMouseLeave={handleMouseLeave}>
            <button 
              onClick={() => navigateToPage('healing')}
              onMouseEnter={() => handleImageChange(backgroundImages.healing)}
              style={{ 
                fontSize: '2rem',
                color: 'white',
                background: 'none',
                border: 'none',
                textDecoration: 'none',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                padding: '1rem 2rem',
                borderBottom: '1px solid transparent'
              }}
            >
              Healing Sessions
            </button>
            <button 
              onClick={() => navigateToPage('gong')}
              onMouseEnter={() => handleImageChange(backgroundImages.gong)}
              style={{ 
                fontSize: '2rem',
                color: 'white',
                background: 'none',
                border: 'none',
                textDecoration: 'none',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                padding: '1rem 2rem',
                borderBottom: '1px solid transparent'
              }}
            >
              Gong Bath
            </button>
            <button 
              onClick={() => navigateToPage('about')}
              onMouseEnter={() => handleImageChange(backgroundImages.about)}
              style={{ 
                fontSize: '2rem',
                color: 'white',
                background: 'none',
                border: 'none',
                textDecoration: 'none',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                padding: '1rem 2rem',
                borderBottom: '1px solid transparent'
              }}
            >
              About
            </button>
          </div>
        </section>
      )}

      {/* Healing Section */}
      {currentPage === 'healing' && (
        <section data-section data-aos="fade-up" data-aos-offset="100" style={{
          minHeight: '100vh',
          backgroundColor: '#fff',
          padding: '80px 2rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', height: '400px', backgroundImage: `url(${require('./assets/healing/tuning-fork-2.jpg').default})`, backgroundSize: 'cover', borderRadius: '10px' }}></div>
            <div style={{ flex: 1, minWidth: '300px', color: '#000' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', letterSpacing: '2px' }}>Healing Sessions</h2>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', textAlign: 'justify' }}>Reiki and Aura Tuning are gentle yet profound pathways to restore energetic harmony and inner peace. Each works through vibration and intention—one through the flow of universal life force, the other through the resonance of sound within the energy field.</p>
              <h3 style={{ fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Aura Tuning</h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', textAlign: 'justify' }}>Aura Tuning works with the subtle field that surrounds and connects us, using the resonance of tuning forks to identify and clear energetic imprints from the past.</p>
              <h3 style={{ fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Reiki</h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', textAlign: 'justify' }}>Reiki is a gentle yet powerful form of energy healing that channels universal life force to promote balance and well-being.</p>
              <button 
                onClick={() => window.open('https://calendly.com/harmonicsandhealingny', '_blank')}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#000', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '1px' }}
              >
                Book a Session
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Gong Section */}
      {currentPage === 'gong' && (
        <section data-section data-aos="fade-up" data-aos-offset="100" style={{
          minHeight: '100vh',
          backgroundColor: '#fff',
          padding: '80px 2rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', color: '#000' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', letterSpacing: '2px' }}>Gong Bath</h2>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', textAlign: 'justify' }}>Immerse yourself in a sacred Gong Bath, where the resonant vibrations of the gong wash over the body, mind, and spirit.</p>
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>"Concentrate on a tone, and in it you may discover the secret of 'being' and find 'the inner voice' of the Self." — Don Conreaux</p>
              <button 
                onClick={() => window.open('https://wa.me/+1234567890', '_blank')}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#000', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '1px' }}
              >
                Contact Me
              </button>
            </div>
            <div style={{ flex: 1, minWidth: '300px', height: '400px', backgroundImage: `url(${require('./assets/gong/gong_bath.jpg').default})`, backgroundSize: 'cover', borderRadius: '10px' }}></div>
          </div>
        </section>
      )}

      {/* About Section */}
      {currentPage === 'about' && (
        <section data-section data-aos="fade-up" data-aos-offset="100" style={{
          minHeight: '100vh',
          backgroundColor: '#fff',
          padding: '80px 2rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', height: '400px', backgroundImage: `url(${require('./assets/about/about.jpeg').default})`, backgroundSize: 'cover', borderRadius: '10px' }}></div>
            <div style={{ flex: 1, minWidth: '300px', color: '#000' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', letterSpacing: '2px' }}>About</h2>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>Harmonics and Healing was founded on the belief that sound and energy are powerful tools for transformation. Our practitioners are dedicated to creating sacred spaces where healing can occur naturally and deeply.</p>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>With years of training in sound therapy, energy healing, and meditation practices, we bring ancient wisdom together with modern understanding to support your journey toward wholeness and well-being.</p>
              <button 
                onClick={() => window.location.href = 'mailto:your-email@example.com'}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#000', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '1px' }}
              >
                Contact Me
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default HarmonicsHealing;