import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import healingBg from './assets/healing/tuning-fork-2.jpg';
import aboutBg from './assets/about/about.jpeg';
import gongBg from './assets/gong/gong_bath.jpg';
import logo from './assets/logo/logo.jpg';

function HarmonicsHealing() {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bgImage, setBgImage] = useState(healingBg);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [fadeOverlay, setFadeOverlay] = useState(0);
  const [defaultBg, setDefaultBg] = useState(healingBg);
  const lenisRef = useRef(null);

  const backgroundImages = {
    healing: healingBg,
    gong: gongBg,
    about: aboutBg
  };

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle scroll for parallax
  useEffect(() => {
    const handleLenisScroll = () => {
      if (!lenisRef.current) return;

      const scrollY = lenisRef.current.scroll;
      const windowHeight = window.innerHeight;

      // Calculate sections and their parallax
      const healingSection = document.querySelector('[data-section="healing"]');
      const gongSection = document.querySelector('[data-section="gong"]');
      const aboutSection = document.querySelector('[data-section="about"]');

      const updateParallax = (section) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const distance = scrollY - sectionTop;
        const parallaxAmount = Math.max(0, Math.min(distance * 0.3, 100));
        section.style.transform = `translateY(${parallaxAmount}px)`;
      };

      updateParallax(healingSection);
      updateParallax(gongSection);
      updateParallax(aboutSection);
    };

    window.addEventListener('scroll', handleLenisScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleLenisScroll);
  }, []);

  const navigateToPage = (page) => {
    setMenuOpen(false);
    setFadeOverlay(1);

    setTimeout(() => {
      setCurrentPage(page);

      if (page === 'home') {
        setBgImage(backgroundImages.healing);
        setDefaultBg(backgroundImages.healing);
        // Scroll to top
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { duration: 1.2 });
        }
      } else {
        const newBg = backgroundImages[page];
        setDefaultBg(newBg);
        setBgImage(newBg);
      }

      setTimeout(() => setFadeOverlay(0), 50);
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

      {/* Fixed Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 2000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Logo */}
        <div style={{ opacity: 0.8, cursor: 'pointer' }} onClick={() => navigateToPage('home')}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
          />
        </div>

        {/* Catchphrase */}
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 300,
          letterSpacing: '2px',
          textAlign: 'center',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          flex: 1
        }}>
          Tuned to Harmony, Healed by Sound
        </div>

        {/* Hamburger */}
        <div 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            width: '30px',
            height: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(8px, 8px)' : 'none' }}></span>
          <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }}></span>
          <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none' }}></span>
        </div>
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

      {/* Hero Section */}
      <section style={{
        height: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: '80px'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }} onMouseLeave={handleMouseLeave}>
          <a 
            href="#healing"
            onClick={(e) => { e.preventDefault(); navigateToPage('healing'); }}
            onMouseEnter={() => handleImageChange(backgroundImages.healing)}
            style={{ 
              fontSize: '2.5rem',
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
              cursor: 'pointer',
              borderBottom: '1px solid transparent'
            }}
          >
            Healing Sessions
          </a>
          <a 
            href="#gong"
            onClick={(e) => { e.preventDefault(); navigateToPage('gong'); }}
            onMouseEnter={() => handleImageChange(backgroundImages.gong)}
            style={{ 
              fontSize: '2.5rem',
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
              cursor: 'pointer',
              borderBottom: '1px solid transparent'
            }}
          >
            Gong Bath
          </a>
          <a 
            href="#about"
            onClick={(e) => { e.preventDefault(); navigateToPage('about'); }}
            onMouseEnter={() => handleImageChange(backgroundImages.about)}
            style={{ 
              fontSize: '2.5rem',
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
              cursor: 'pointer',
              borderBottom: '1px solid transparent'
            }}
          >
            About
          </a>
        </div>
      </section>

      {/* Healing Section */}
      <section data-section="healing" id="healing" style={{
        minHeight: '100vh',
        backgroundColor: '#fff',
        padding: '80px 2rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        willChange: 'transform'
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

      {/* Gong Section */}
      <section data-section="gong" id="gong" style={{
        minHeight: '100vh',
        backgroundColor: '#fff',
        padding: '80px 2rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        willChange: 'transform'
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

      {/* About Section */}
      <section data-section="about" id="about" style={{
        minHeight: '100vh',
        backgroundColor: '#fff',
        padding: '80px 2rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        willChange: 'transform'
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
    </div>
  );
}

export default HarmonicsHealing;