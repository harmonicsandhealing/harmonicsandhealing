import React, { useState, useEffect } from 'react';

export default function HarmonicsHealing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [bgColor, setBgColor] = useState('linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

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
          // Just reached bottom, start transition smoothly
          isTransitioning = true;
          e.preventDefault();
        }
        
        if (isTransitioning || scrollProgress > 0) {
          // In transition mode
          e.preventDefault();
          
          if (e.deltaY > 0) {
            // Scrolling down
            setScrollProgress(prev => {
              const newProgress = Math.min(prev + 0.5, 100);
              if (newProgress === 100) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                  setCurrentPage('home');
                  setScrollProgress(0);
                  setIsAtBottom(false);
                  isTransitioning = false;
                  window.scrollTo(0, 0);
                }, 200);
              }
              return newProgress;
            });
          } else if (e.deltaY < 0) {
            // Scrolling up while in transition
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
    setIsAtBottom(false);
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
          >
            Healing Sessions
          </a>
          <a
            onClick={() => navigateToPage('gong')}
            onMouseEnter={() => setBgColor(backgrounds.gong)}
            onMouseLeave={() => setBgColor(backgrounds.default)}
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
          >
            Gong Bath
          </a>
          <a
            onClick={() => navigateToPage('about')}
            onMouseEnter={() => setBgColor(backgrounds.about)}
            onMouseLeave={() => setBgColor(backgrounds.default)}
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
          >
            About Us
          </a>
        </div>
      </div>
    </div>
  );

  const HealingPage = () => (
    <div style={{
      minHeight: '100vh',
      padding: '8rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa'
    }}>
      <h2 style={{
        fontSize: '4rem',
        fontWeight: 300,
        letterSpacing: '4px',
        marginBottom: '3rem',
        textTransform: 'uppercase'
      }}>
        Healing Sessions
      </h2>
      <div style={{ maxWidth: '900px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.3rem', lineHeight: 2, color: '#555', marginBottom: '2rem' }}>
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
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 300,
              letterSpacing: '2px',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              Sound Healing
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#666' }}>
              Immerse yourself in therapeutic vibrations that promote deep relaxation and cellular healing.
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 300,
              letterSpacing: '2px',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              Energy Work
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#666' }}>
              Release blockages and restore the natural flow of energy throughout your body.
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 300,
              letterSpacing: '2px',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              Private Sessions
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#666' }}>
              Personalized one-on-one healing experiences tailored to your unique needs.
            </p>
          </div>
        </div>
        <button style={{
          padding: '1.2rem 3rem',
          background: '#1a1a1a',
          color: 'white',
          fontSize: '0.95rem',
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
      <p style={{ marginTop: '3rem', color: '#999', fontSize: '0.9rem' }}>
        Scroll down to return home
      </p>
    </div>
  );

  const GongPage = () => (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      padding: '5rem 4rem 4rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      overflow: 'hidden'
    }}>
      <h2 style={{
        fontSize: '3.5rem',
        fontWeight: 300,
        letterSpacing: '4px',
        marginBottom: '1.5rem',
        textTransform: 'uppercase'
      }}>
        Gong Bath
      </h2>
      <div style={{ maxWidth: '800px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#555', marginBottom: '1.5rem' }}>
          Surrender to the profound waves of sound in our signature gong bath experience.
        </p>
        
        <div style={{
          width: '100%',
          maxWidth: '500px',
          height: '280px',
          margin: '1.5rem auto',
          backgroundImage: 'url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '2px'
        }} />
        
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#555', marginBottom: '1.5rem' }}>
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
      minHeight: '100vh',
      padding: '8rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <h2 style={{
        fontSize: '4rem',
        fontWeight: 300,
        letterSpacing: '4px',
        marginBottom: '3rem',
        textTransform: 'uppercase'
      }}>
        About Us
      </h2>
      <div style={{ maxWidth: '900px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.3rem', lineHeight: 2, color: '#555', marginBottom: '2rem' }}>
          Harmonics and Healing was founded on the belief that sound and energy are powerful tools for transformation. Our practitioners are dedicated to creating sacred spaces where healing can occur naturally and deeply.
        </p>
        <p style={{ fontSize: '1.3rem', lineHeight: 2, color: '#555', marginBottom: '2rem' }}>
          With years of training in sound therapy, energy healing, and meditation practices, we bring ancient wisdom together with modern understanding to support your journey toward wholeness and well-being.
        </p>
        <p style={{ fontSize: '1.3rem', lineHeight: 2, color: '#555', marginBottom: '2rem' }}>
          Whether you're seeking relief from stress, physical healing, or spiritual growth, we're here to guide and support you every step of the way.
        </p>
      </div>
      <p style={{ marginTop: '3rem', color: '#999', fontSize: '0.9rem' }}>
        Scroll down to return home
      </p>
    </div>
  );

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

      {/* Page Content with smooth transition */}
      <div style={{ position: 'relative' }}>
        {/* Home page always underneath when on section pages */}
        {currentPage !== 'home' && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 0
          }}>
            <HeroPage />
          </div>
        )}

        {/* Section page that slides up */}
        {currentPage !== 'home' && scrollProgress === 0 && (
          <div style={{ 
            position: 'relative',
            zIndex: 1,
            background: currentPage === 'healing' ? '#fafafa' : currentPage === 'gong' ? 'white' : '#f5f5f5'
          }}>
            {currentPage === 'healing' && <HealingPage />}
            {currentPage === 'gong' && <GongPage />}
            {currentPage === 'about' && <AboutPage />}
          </div>
        )}
        
        {currentPage !== 'home' && scrollProgress > 0 && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '100vh',
            overflow: 'hidden',
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            <div style={{
              transform: `translateY(-${scrollProgress}vh)`,
              transition: 'none',
              background: currentPage === 'healing' ? '#fafafa' : currentPage === 'gong' ? 'white' : '#f5f5f5',
              minHeight: '100vh',
              width: '100%'
            }}>
              {currentPage === 'healing' && <HealingPage />}
              {currentPage === 'gong' && <GongPage />}
              {currentPage === 'about' && <AboutPage />}
            </div>
          </div>
        )}

        {currentPage === 'home' && <HeroPage />}
      </div>

      {/* Footer - only on home */}
      {currentPage === 'home' && (
        <footer style={{
          background: '#0a0a0a',
          color: 'white',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.9rem', opacity: 0.7, letterSpacing: '1px' }}>
            © 2025 Harmonics and Healing. All rights reserved.
          </p>
        </footer>
      )}
    </div>
  );
}