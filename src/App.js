import React, { useState, useEffect } from 'react';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [bgColor, setBgColor] = useState('linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)');
  const [scrollProgress, setScrollProgress] = useState(0);

  const backgrounds = {
    default: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    healing: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gong: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    about: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  };

  useEffect(() => {
    let scrollTimeout;
    let isTransitioning = false;
    
    const checkIfAtBottom = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      return scrollHeight - scrollTop - clientHeight < 150;
    };

    const handleWheel = (e) => {
      if (currentPage !== 'home') {
        const atBottom = checkIfAtBottom();
        
        if (atBottom && e.deltaY > 0 && scrollProgress === 0) {
          isTransitioning = true;
          e.preventDefault();
        }
        
        if (isTransitioning || scrollProgress > 0) {
          e.preventDefault();
          
          if (e.deltaY > 0) {
            setScrollProgress(prev => {
              const newProgress = Math.min(prev + 0.5, 100);
              if (newProgress === 100) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                  setCurrentPage('home');
                  setScrollProgress(0);
                  isTransitioning = false;
                  window.scrollTo(0, 0);
                }, 200);
              }
              return newProgress;
            });
          } else if (e.deltaY < 0) {
            setScrollProgress(prev => {
              const newVal = Math.max(prev - 0.5, 0);
              if (newVal === 0) {
                isTransitioning = false;
              }
              return newVal;
            });
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, [currentPage, scrollProgress]);

  const navigateToPage = (page) => {
    setMenuOpen(false);
    setCurrentPage(page);
    setScrollProgress(0);
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const HeroPage = () => (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: bgColor,
      transition: 'background 0.8s ease',
      position: 'relative'
    }}>
      <div style={{ textAlign: 'center', color: 'white', zIndex: 2 }}>
        <h1 style={{
          fontSize: '5rem',
          fontWeight: 300,
          letterSpacing: '8px',
          marginBottom: '3rem',
          textTransform: 'uppercase'
        }}>
          HARMONICS AND HEALING
        </h1>
        <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            onClick={() => navigateToPage('healing')}
            onMouseEnter={() => setBgColor(backgrounds.healing)}
            onMouseLeave={() => setBgColor(backgrounds.default)}
            style={linkStyle}
          >
            Healing Sessions
          </a>
          <a
            onClick={() => navigateToPage('gong')}
            onMouseEnter={() => setBgColor(backgrounds.gong)}
            onMouseLeave={() => setBgColor(backgrounds.default)}
            style={linkStyle}
          >
            Gong Bath
          </a>
          <a
            onClick={() => navigateToPage('about')}
            onMouseEnter={() => setBgColor(backgrounds.about)}
            onMouseLeave={() => setBgColor(backgrounds.default)}
            style={linkStyle}
          >
            About Us
          </a>
        </div>
      </div>
    </div>
  );

  const HealingPage = () => (
    <div style={sectionStyle('#fafafa')}>
      <h2 style={headingStyle}>Healing Sessions</h2>
      <div style={{ maxWidth: '900px', textAlign: 'center' }}>
        <p style={paragraphStyle}>
          Experience transformative healing through the power of sound, energy work, and ancient practices designed to restore balance and harmony to your mind, body, and spirit.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          marginTop: '3rem',
          maxWidth: '1200px'
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={subheadingStyle}>Sound Healing</h3>
            <p style={smallTextStyle}>Immerse yourself in therapeutic vibrations that promote deep relaxation and cellular healing.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={subheadingStyle}>Energy Work</h3>
            <p style={smallTextStyle}>Release blockages and restore the natural flow of energy throughout your body.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={subheadingStyle}>Private Sessions</h3>
            <p style={smallTextStyle}>Personalized one-on-one healing experiences tailored to your unique needs.</p>
          </div>
        </div>
        <button style={ctaStyle}>Book a Session</button>
      </div>
      <p style={{ marginTop: '3rem', color: '#999', fontSize: '0.9rem' }}>
        Scroll down to return home
      </p>
    </div>
  );

  const GongPage = () => (
    <div style={{ ...sectionStyle('white'), overflow: 'hidden' }}>
      <h2 style={headingStyle}>Gong Bath</h2>
      <div style={{ maxWidth: '900px', textAlign: 'center' }}>
        <p style={paragraphStyle}>
          Surrender to the profound waves of sound in our signature gong bath experience. The rich, harmonic tones of the gong wash over you, creating a deeply meditative state that allows for profound healing and transformation.
        </p>
        <p style={paragraphStyle}>
          Each gong bath session is carefully crafted to guide you through a journey of release, renewal, and restoration. The vibrations penetrate every cell, promoting physical healing while quieting the mind and opening the heart.
        </p>
        <button style={ctaStyle}>Join a Gong Bath</button>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div style={sectionStyle('#f5f5f5')}>
      <h2 style={headingStyle}>About Us</h2>
      <div style={{ maxWidth: '900px', textAlign: 'center' }}>
        <p style={paragraphStyle}>
          Harmonics and Healing was founded on the belief that sound and energy are powerful tools for transformation. Our practitioners are dedicated to creating sacred spaces where healing can occur naturally and deeply.
        </p>
        <p style={paragraphStyle}>
          With years of training in sound therapy, energy healing, and meditation practices, we bring ancient wisdom together with modern understanding to support your journey toward wholeness and well-being.
        </p>
      </div>
      <p style={{ marginTop: '3rem', color: '#999', fontSize: '0.9rem' }}>
        Scroll down to return home
      </p>
    </div>
  );

  // small style constants to keep App.js readable
  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 300,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid transparent',
    transition: 'all 0.3s ease'
  };

  const sectionStyle = (bg) => ({
    minHeight: '100vh',
    padding: '6rem 4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: bg
  });

  const headingStyle = {
    fontSize: '4rem',
    fontWeight: 300,
    letterSpacing: '4px',
    marginBottom: '2rem',
    textTransform: 'uppercase'
  };

  const subheadingStyle = {
    fontSize: '1.8rem',
    fontWeight: 300,
    letterSpacing: '2px',
    marginBottom: '1rem',
    textTransform: 'uppercase'
  };

  const paragraphStyle = {
    fontSize: '1.2rem',
    lineHeight: 1.8,
    color: '#555',
    marginBottom: '1.5rem'
  };

  const smallTextStyle = { fontSize: '1.1rem', lineHeight: 1.8, color: '#666' };

  const ctaStyle = {
    padding: '1.2rem 3rem',
    background: '#1a1a1a',
    color: 'white',
    fontSize: '0.95rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    border: '2px solid #1a1a1a',
    marginTop: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      {/* Hamburger Menu */}
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 2000,
          cursor: 'pointer',
          width: '30px',
          height: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <span style={{
          width: '100%',
          height: '2px',
          background: currentPage === 'home' ? 'white' : '#1a1a1a',
          transform: menuOpen ? 'rotate(45deg) translate(8px, 8px)' : 'none',
          transition: 'all 0.3s ease'
        }} />
        <span style={{
          width: '100%',
          height: '2px',
          background: currentPage === 'home' ? 'white' : '#1a1a1a',
          opacity: menuOpen ? 0 : 1,
          transition: 'all 0.3s ease'
        }} />
        <span style={{
          width: '100%',
          height: '2px',
          background: currentPage === 'home' ? 'white' : '#1a1a1a',
          transform: menuOpen ? 'rotate(-45deg) translate(8px, -8px)' : 'none',
          transition: 'all 0.3s ease'
        }} />
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.98)',
          zIndex: 1500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '2rem 0' }}>
              <a onClick={() => navigateToPage('healing')} style={{ ...linkStyle, color: '#1a1a1a', fontSize: '3rem' }}>Healing Sessions</a>
            </div>
            <div style={{ margin: '2rem 0' }}>
              <a onClick={() => navigateToPage('gong')} style={{ ...linkStyle, color: '#1a1a1a', fontSize: '3rem' }}>Gong Bath</a>
            </div>
            <div style={{ margin: '2rem 0' }}>
              <a onClick={() => navigateToPage('about')} style={{ ...linkStyle, color: '#1a1a1a', fontSize: '3rem' }}>About Us</a>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {currentPage !== 'home' && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            <HeroPage />
          </div>
        )}

        {currentPage !== 'home' && scrollProgress === 0 && (
          <div style={{ position: 'relative', zIndex: 1, background: currentPage === 'healing' ? '#fafafa' : currentPage === 'gong' ? 'white' : '#f5f5f5' }}>
            {currentPage === 'healing' && <HealingPage />}
            {currentPage === 'gong' && <GongPage />}
            {currentPage === 'about' && <AboutPage />}
          </div>
        )}
        
        {currentPage !== 'home' && scrollProgress > 0 && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden', zIndex: 1, pointerEvents: 'none' }}>
            <div style={{ transform: `translateY(-${scrollProgress}vh)`, transition: 'none', background: currentPage === 'healing' ? '#fafafa' : currentPage === 'gong' ? 'white' : '#f5f5f5', minHeight: '100vh', width: '100%' }}>
              {currentPage === 'healing' && <HealingPage />}
              {currentPage === 'gong' && <GongPage />}
              {currentPage === 'about' && <AboutPage />}
            </div>
          </div>
        )}

        {currentPage === 'home' && <HeroPage />}
      </div>

      {currentPage === 'home' && (
        <footer style={{ background: '#0a0a0a', color: 'white', padding: '3rem 2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', opacity: 0.7, letterSpacing: '1px' }}>
            © 2025 Harmonics and Healing. All rights reserved.
          </p>
        </footer>
      )}
    </div>
  );
}
