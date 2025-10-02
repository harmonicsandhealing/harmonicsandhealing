import React, { useState, useEffect } from 'react';

export default function HarmonicsHealing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let scrollTimeout;
    
    const handleWheel = (e) => {
      if (currentPage !== 'home') {
        e.preventDefault();
        
        if (e.deltaY > 0) {
          setScrollProgress(prev => {
            const newProgress = Math.min(prev + 0.7, 100);
            if (newProgress === 100) {
              clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(() => {
                setCurrentPage('home');
                setScrollProgress(0);
              }, 200);
            }
            return newProgress;
          });
        } else if (e.deltaY < 0 && scrollProgress > 0) {
          setScrollProgress(prev => Math.max(prev - 0.7, 0));
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
  };

  const HeroPage = () => (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1545389336-cf090694435e?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.7)'
      }} />
      <div style={{ textAlign: 'center', color: 'white', zIndex: 2, position: 'relative' }}>
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
            style={{
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
            }}
            onMouseEnter={(e) => e.target.style.borderBottom = '1px solid white'}
            onMouseLeave={(e) => e.target.style.borderBottom = '1px solid transparent'}
          >
            Healing Sessions
          </a>
          <a
            onClick={() => navigateToPage('gong')}
            style={{
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
            }}
            onMouseEnter={(e) => e.target.style.borderBottom = '1px solid white'}
            onMouseLeave={(e) => e.target.style.borderBottom = '1px solid transparent'}
          >
            Gong Bath
          </a>
          <a
            onClick={() => navigateToPage('about')}
            style={{
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
            }}
            onMouseEnter={(e) => e.target.style.borderBottom = '1px solid white'}
            onMouseLeave={(e) => e.target.style.borderBottom = '1px solid transparent'}
          >
            About Us
          </a>
        </div>
      </div>
    </div>
  );

  const HealingPage = () => (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.9)'
      }} />
      <div style={{ 
        maxWidth: '850px', 
        textAlign: 'center', 
        zIndex: 2, 
        position: 'relative',
        background: 'rgba(250, 250, 250, 0.95)',
        padding: '3rem',
        borderRadius: '4px'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          fontWeight: 300,
          letterSpacing: '4px',
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
          color: '#1a1a1a'
        }}>
          Healing Sessions
        </h2>
        
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#555', marginBottom: '2rem' }}>
          Experience transformative healing through sound, energy work, and ancient practices.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center', flex: '1', minWidth: '150px', maxWidth: '200px' }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 300,
              letterSpacing: '2px',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              color: '#1a1a1a'
            }}>
              Sound
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#666' }}>
              Therapeutic vibrations
            </p>
          </div>
          <div style={{ textAlign: 'center', flex: '1', minWidth: '150px', maxWidth: '200px' }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 300,
              letterSpacing: '2px',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              color: '#1a1a1a'
            }}>
              Energy
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#666' }}>
              Restore natural flow
            </p>
          </div>
          <div style={{ textAlign: 'center', flex: '1', minWidth: '150px', maxWidth: '200px' }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 300,
              letterSpacing: '2px',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              color: '#1a1a1a'
            }}>
              Private
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#666' }}>
              Personalized sessions
            </p>
          </div>
        </div>
        <button style={{
          padding: '1rem 2.5rem',
          background: '#1a1a1a',
          color: 'white',
          fontSize: '0.9rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          border: '2px solid #1a1a1a',
          marginTop: '2rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Book a Session
        </button>
      </div>
    </div>
  );

  const GongPage = () => (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.8)'
      }} />
      <div style={{ 
        maxWidth: '800px', 
        textAlign: 'center', 
        zIndex: 2, 
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '3rem',
        borderRadius: '4px'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          fontWeight: 300,
          letterSpacing: '4px',
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
          color: '#1a1a1a'
        }}>
          Gong Bath
        </h2>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#555', marginBottom: '1.5rem' }}>
          Surrender to the profound waves of sound in our signature gong bath experience. The rich, harmonic tones create a deeply meditative state.
        </p>
        
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#555', marginBottom: '2rem' }}>
          Each session guides you through a journey of release, renewal, and restoration.
        </p>
        <button style={{
          padding: '1rem 2.5rem',
          background: '#1a1a1a',
          color: 'white',
          fontSize: '0.9rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          border: '2px solid #1a1a1a',
          marginTop: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Join a Gong Bath
        </button>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.85)'
      }} />
      <div style={{ 
        maxWidth: '900px', 
        textAlign: 'center', 
        zIndex: 2, 
        position: 'relative',
        background: 'rgba(245, 245, 245, 0.95)',
        padding: '3rem',
        borderRadius: '4px'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          fontWeight: 300,
          letterSpacing: '4px',
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
          color: '#1a1a1a'
        }}>
          About Us
        </h2>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#555', marginBottom: '1.5rem' }}>
          Harmonics and Healing was founded on the belief that sound and energy are powerful tools for transformation. Our practitioners are dedicated to creating sacred spaces where healing can occur naturally and deeply.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#555', marginBottom: '1.5rem' }}>
          With years of training in sound therapy, energy healing, and meditation practices, we bring ancient wisdom together with modern understanding to support your journey toward wholeness and well-being.
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", height: '100vh', width: '100vw', overflow: 'hidden' }}>
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
          background: 'white',
          transform: menuOpen ? 'rotate(45deg) translate(8px, 8px)' : 'none',
          transition: 'all 0.3s ease'
        }} />
        <span style={{
          width: '100%',
          height: '2px',
          background: 'white',
          opacity: menuOpen ? 0 : 1,
          transition: 'all 0.3s ease'
        }} />
        <span style={{
          width: '100%',
          height: '2px',
          background: 'white',
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
              <a
                onClick={() => navigateToPage('healing')}
                style={{
                  textDecoration: 'none',
                  color: '#1a1a1a',
                  fontSize: '3rem',
                  fontWeight: 300,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Healing Sessions
              </a>
            </div>
            <div style={{ margin: '2rem 0' }}>
              <a
                onClick={() => navigateToPage('gong')}
                style={{
                  textDecoration: 'none',
                  color: '#1a1a1a',
                  fontSize: '3rem',
                  fontWeight: 300,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Gong Bath
              </a>
            </div>
            <div style={{ margin: '2rem 0' }}>
              <a
                onClick={() => navigateToPage('about')}
                style={{
                  textDecoration: 'none',
                  color: '#1a1a1a',
                  fontSize: '3rem',
                  fontWeight: 300,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                About Us
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Always show home page as background when on section pages */}
      {currentPage !== 'home' && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%',
          height: '100%',
          zIndex: 0
        }}>
          <HeroPage />
        </div>
      )}

      {/* Section pages overlay */}
      {currentPage !== 'home' && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%',
          height: '100%',
          zIndex: 1,
          transform: `translateY(-${scrollProgress}vh)`,
          transition: 'none'
        }}>
          {currentPage === 'healing' && <HealingPage />}
          {currentPage === 'gong' && <GongPage />}
          {currentPage === 'about' && <AboutPage />}
        </div>
      )}

      {/* Show home page directly when on home */}
      {currentPage === 'home' && <HeroPage />}
    </div>
  );
}