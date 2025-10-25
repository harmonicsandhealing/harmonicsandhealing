import React, { useState, useEffect, useRef } from 'react';
import healingBg from './assets/healing/tuning-fork-2.jpg';
import aboutBg from './assets/about/about.jpeg';
import gongBg from './assets/gong/gong_bath.jpg';
import logo from './assets/logo/logo.jpg';

function HarmonicsHealing() {
  const [activeModal, setActiveModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bgImage, setBgImage] = useState(healingBg);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [fadeOverlay, setFadeOverlay] = useState(0);
  const [modalScroll, setModalScroll] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const modalRef = useRef(null);

  const backgroundImages = {
    healing: healingBg,
    gong: gongBg,
    about: aboutBg
  };

  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastScrollRef = useRef(0);
  const velocityRef = useRef(0);

  // Add scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle modal scroll to detect when at bottom
  useEffect(() => {
    if (!modalRef.current || !activeModal) return;

    const handleScroll = () => {
      const modal = modalRef.current;
      const scrollY = modal.scrollTop;
      const scrollHeight = modal.scrollHeight;
      const clientHeight = modal.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      const atBottom = scrollY >= maxScroll - 10;
      setIsAtBottom(atBottom);

      if (!atBottom) {
        setModalScroll(0);
      }

      lastScrollRef.current = scrollY;
    };

    const modal = modalRef.current;
    modal.addEventListener('scroll', handleScroll, { passive: true });
    return () => modal.removeEventListener('scroll', handleScroll);
  }, [activeModal]);

  // Enhanced parallax effect
  useEffect(() => {
    if (!activeModal || !isAtBottom) return;

    const handleWindowWheel = (e) => {
      const modal = modalRef.current;
      if (!modal) return;

      const scrollHeight = modal.scrollHeight;
      const clientHeight = modal.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const atMaxScroll = modal.scrollTop >= maxScroll - 10;

      if (atMaxScroll && e.deltaY > 0) {
        e.preventDefault();
        const newParallax = modalScroll + e.deltaY * 0.5;
        setModalScroll(newParallax);
        velocityRef.current = e.deltaY;

        if (newParallax > clientHeight * 0.3) {
          setFadeOverlay(1);
          setTimeout(() => {
            setActiveModal(null);
            setModalScroll(0);
            setIsAtBottom(false);
            setTimeout(() => setFadeOverlay(0), 50);
          }, 300);
        }
      }
    };

    window.addEventListener('wheel', handleWindowWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWindowWheel);
  }, [activeModal, isAtBottom, modalScroll]);

  // Touch events for mobile
  useEffect(() => {
    if (!modalRef.current || !activeModal) return;

    let touchStartY = 0;
    let lastTouchY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      lastTouchY = currentY;

      if (!isAtBottom) return;

      const modal = modalRef.current;
      const scrollHeight = modal.scrollHeight;
      const clientHeight = modal.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const atMaxScroll = modal.scrollTop >= maxScroll - 10;

      if (atMaxScroll && deltaY > 0) {
        e.preventDefault();
        const newParallax = modalScroll + deltaY * 1.5;
        setModalScroll(newParallax);
        velocityRef.current = deltaY;

        if (newParallax > clientHeight * 0.3) {
          setFadeOverlay(1);
          setTimeout(() => {
            setActiveModal(null);
            setModalScroll(0);
            setIsAtBottom(false);
            setTimeout(() => setFadeOverlay(0), 50);
          }, 300);
        }
      }
    };

    const modal = modalRef.current;
    modal.addEventListener('touchstart', handleTouchStart, { passive: true });
    modal.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      modal.removeEventListener('touchstart', handleTouchStart);
      modal.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeModal, isAtBottom, modalScroll]);

  const openModal = (section) => {
    setMenuOpen(false);
    setFadeOverlay(1);
    
    setTimeout(() => {
      setActiveModal(section);
      setBgImage(backgroundImages[section]);
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
      setTimeout(() => setFadeOverlay(0), 50);
    }, 300);
  };

  const handleImageChange = (newImage) => {
    if (newImage === bgImage) return;
    setBgOpacity(0);
    setTimeout(() => {
      setBgImage(newImage);
      setTimeout(() => setBgOpacity(1), 50);
    }, 200);
  };

  const handleMouseLeave = () => {
    setBgImage(healingBg);
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
      {/* Scroll Progress Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '2px',
        background: 'linear-gradient(90deg, #fff 0%, #888 100%)',
        zIndex: 3001,
        transition: 'width 0.2s ease'
      }}></div>

      {/* Fade Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        opacity: fadeOverlay,
        transition: 'opacity 0.3s ease',
        zIndex: 3000,
        pointerEvents: fadeOverlay > 0 ? 'all' : 'none'
      }}></div>

      {/* Hero Background with Enhanced Parallax */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '120%',
          height: '120%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: bgOpacity * 0.7,
          transition: 'opacity 0.6s ease, transform 0.8s ease',
          transform: `scale(1.1) translateY(${scrollProgress * 0.2}px)`,
          filter: 'contrast(1.1) brightness(0.9)'
        }}></div>
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none'
        }}></div>
      </div>

      {/* Refined Logo */}
      <div style={{
        position: 'fixed',
        top: '2rem',
        left: '2rem',
        width: '60px',
        height: '60px',
        backgroundImage: `url(${logo})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: 2000,
        opacity: 0.95,
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
        mixBlendMode: 'difference'
      }}
      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      onClick={() => setActiveModal(null)}
      ></div>

      {/* Enhanced Hamburger Menu */}
      <div style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        zIndex: 2000
      }}>
        <div 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '6px',
            padding: '10px',
            transition: 'all 0.3s'
          }}>
          <span style={{ 
            width: '28px', 
            height: '1.5px', 
            backgroundColor: 'white', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            transform: menuOpen ? 'rotate(45deg) translate(7px, 7px)' : 'none',
            opacity: 0.9
          }}></span>
          <span style={{ 
            width: '28px', 
            height: '1.5px', 
            backgroundColor: 'white', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            opacity: menuOpen ? 0 : 0.9
          }}></span>
          <span style={{ 
            width: '28px', 
            height: '1.5px', 
            backgroundColor: 'white', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            transform: menuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none',
            opacity: 0.9
          }}></span>
        </div>
      </div>

      {/* Refined Menu Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: menuOpen ? '100%' : '0',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.98)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1999,
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '3rem', 
          textAlign: 'center',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
        }}>
          <a href="https://www.instagram.com/harmonicsandhealing/" 
             target="_blank" 
             rel="noopener noreferrer" 
             style={{ 
               fontSize: '1.2rem', 
               color: 'white', 
               textDecoration: 'none', 
               letterSpacing: '3px',
               fontWeight: '300',
               textTransform: 'uppercase',
               transition: 'all 0.3s',
               opacity: 0.8
             }}
             onMouseEnter={(e) => e.target.style.opacity = '1'}
             onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          >Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61581215911617" 
             target="_blank" 
             rel="noopener noreferrer" 
             style={{ 
               fontSize: '1.2rem', 
               color: 'white', 
               textDecoration: 'none', 
               letterSpacing: '3px',
               fontWeight: '300',
               textTransform: 'uppercase',
               transition: 'all 0.3s',
               opacity: 0.8
             }}
             onMouseEnter={(e) => e.target.style.opacity = '1'}
             onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          >Facebook</a>
          <a href="https://calendly.com/harmonicsandhealingny" 
             target="_blank" 
             rel="noopener noreferrer" 
             style={{ 
               fontSize: '1.2rem', 
               color: 'white', 
               textDecoration: 'none', 
               letterSpacing: '3px',
               fontWeight: '300',
               textTransform: 'uppercase',
               transition: 'all 0.3s',
               opacity: 0.8
             }}
             onMouseEnter={(e) => e.target.style.opacity = '1'}
             onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          >Reservations</a>
          <button 
             onClick={() => { setMenuOpen(false); openModal('about'); }} 
             style={{ 
               fontSize: '1.2rem', 
               color: 'white', 
               background: 'none', 
               border: 'none', 
               cursor: 'pointer', 
               letterSpacing: '3px',
               fontWeight: '300',
               textTransform: 'uppercase',
               transition: 'all 0.3s',
               opacity: 0.8,
               padding: 0,
               fontFamily: 'inherit'
             }}
             onMouseEnter={(e) => e.target.style.opacity = '1'}
             onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          >About</button>
        </div>
      </div>

      {/* Hero Content - Refined Typography */}
      {!activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10
        }}>
          {/* Main Title */}
          <div style={{
            position: 'absolute',
            top: '25%',
            textAlign: 'center',
            animation: 'fadeInUp 1.2s ease-out'
          }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              color: 'white',
              fontWeight: '200',
              letterSpacing: '8px',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              opacity: 0.9
            }}>Harmonics</h1>
            <div style={{
              width: '80px',
              height: '1px',
              backgroundColor: 'white',
              margin: '0 auto',
              opacity: 0.5
            }}></div>
            <h2 style={{
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              color: 'white',
              fontWeight: '300',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginTop: '0.5rem',
              opacity: 0.7
            }}>& Healing</h2>
          </div>

          {/* Navigation Links - Refined */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2.5rem', 
            alignItems: 'center',
            marginTop: '8rem'
          }} onMouseLeave={handleMouseLeave}>
            <button 
              onClick={() => openModal('healing')}
              onMouseEnter={() => handleImageChange(backgroundImages.healing)}
              style={{ 
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0.5rem 1rem',
                fontWeight: '200',
                position: 'relative',
                opacity: 0.85,
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => {
                e.target.style.opacity = '1';
                e.target.style.letterSpacing = '6px';
              }}
              onMouseOut={(e) => {
                e.target.style.opacity = '0.85';
                e.target.style.letterSpacing = '4px';
              }}
            >
              <span style={{ position: 'relative' }}>
                Healing Sessions
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '1px',
                  backgroundColor: 'white',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: 0.6
                }} className="underline"></div>
              </span>
            </button>
            <button 
              onClick={() => openModal('gong')}
              onMouseEnter={() => handleImageChange(backgroundImages.gong)}
              style={{ 
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0.5rem 1rem',
                fontWeight: '200',
                position: 'relative',
                opacity: 0.85,
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => {
                e.target.style.opacity = '1';
                e.target.style.letterSpacing = '6px';
              }}
              onMouseOut={(e) => {
                e.target.style.opacity = '0.85';
                e.target.style.letterSpacing = '4px';
              }}
            >
              <span style={{ position: 'relative' }}>
                Gong Bath
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '1px',
                  backgroundColor: 'white',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: 0.6
                }} className="underline"></div>
              </span>
            </button>
            <button 
              onClick={() => openModal('about')}
              onMouseEnter={() => handleImageChange(backgroundImages.about)}
              style={{ 
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0.5rem 1rem',
                fontWeight: '200',
                position: 'relative',
                opacity: 0.85,
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => {
                e.target.style.opacity = '1';
                e.target.style.letterSpacing = '6px';
              }}
              onMouseOut={(e) => {
                e.target.style.opacity = '0.85';
                e.target.style.letterSpacing = '4px';
              }}
            >
              <span style={{ position: 'relative' }}>
                About
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '1px',
                  backgroundColor: 'white',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: 0.6
                }} className="underline"></div>
              </span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 0.5,
            animation: 'bounce 2s infinite'
          }}>
            <span style={{
              fontSize: '0.7rem',
              color: 'white',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>Scroll</span>
            <div style={{
              width: '1px',
              height: '30px',
              backgroundColor: 'white',
              opacity: 0.5
            }}></div>
          </div>
        </div>
      )}

      {/* Enhanced Modal with Refined Design */}
      {activeModal && (
        <div 
          ref={modalRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: '#fafafa',
            overflowY: 'auto',
            zIndex: 100,
            opacity: 1,
            animation: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            transform: `translateY(${modalScroll}px)`,
            transition: 'transform 0.1s linear'
          }}
        >
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes slideUp {
              from {
                transform: translateY(100vh);
              }
              to {
                transform: translateY(0);
              }
            }
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% {
                transform: translateY(0) translateX(-50%);
              }
              40% {
                transform: translateY(-10px) translateX(-50%);
              }
              60% {
                transform: translateY(-5px) translateX(-50%);
              }
            }
            button:hover .underline {
              width: 100% !important;
            }
          `}</style>

          <div style={{ 
            padding: '120px 2rem 3rem', 
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)'
          }}>
            <div style={{ 
              maxWidth: '1400px', 
              margin: '0 auto', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '4rem', 
              alignItems: 'center'
            }}>
              
              {/* Healing Modal - Refined Layout */}
              {activeModal === 'healing' && (
                <>
                  <div style={{ 
                    height: '500px', 
                    backgroundImage: `url(${healingBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '2px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both'
                  }}></div>
                  <div style={{ 
                    color: '#111',
                    animation: 'fadeInUp 0.8s ease-out 0.4s both'
                  }}>
                    <h2 style={{ 
                      fontSize: '2.5rem', 
                      marginBottom: '2rem', 
                      letterSpacing: '1px',
                      fontWeight: '300',
                      color: '#111'
                    }}>Healing Sessions</h2>
                    <p style={{ 
                      fontSize: '1rem', 
                      lineHeight: 1.8, 
                      marginBottom: '1.5rem',
                      color: '#444'
                    }}>
                      Reiki and Aura Tuning are gentle yet profound pathways to restore energetic harmony and inner peace. Each works through vibration and intention—one through the flow of universal life force, the other through the resonance of sound within the energy field.
                    </p>
                    
                    <div style={{ 
                      marginTop: '3rem',
                      paddingTop: '2rem',
                      borderTop: '1px solid #e0e0e0'
                    }}>
                      <h3 style={{ 
                        fontSize: '1.1rem', 
                        marginBottom: '1rem',
                        fontWeight: '400',
                        letterSpacing: '0.5px',
                        color: '#111'
                      }}>Aura Tuning</h3>
                      <p style={{ 
                        fontSize: '0.95rem', 
                        lineHeight: 1.7, 
                        marginBottom: '2rem',
                        color: '#555'
                      }}>
                        Working with the subtle field that surrounds and connects us, using the resonance of tuning forks to identify and clear energetic imprints from the past.
                      </p>
                      
                      <h3 style={{ 
                        fontSize: '1.1rem', 
                        marginBottom: '1rem',
                        fontWeight: '400',
                        letterSpacing: '0.5px',
                        color: '#111'
                      }}>Reiki</h3>
                      <p style={{ 
                        fontSize: '0.95rem', 
                        lineHeight: 1.7, 
                        marginBottom: '2rem',
                        color: '#555'
                      }}>
                        A gentle yet powerful form of energy healing that channels universal life force to promote balance and well-being throughout your entire system.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => window.open('https://calendly.com/harmonicsandhealingny', '_blank')}
                      style={{ 
                        marginTop: '2rem',
                        padding: '1rem 2.5rem', 
                        backgroundColor: 'transparent', 
                        color: '#111', 
                        border: '1px solid #111', 
                        cursor: 'pointer', 
                        fontSize: '0.9rem', 
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontWeight: '300'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#111';
                        e.target.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#111';
                      }}
                    >
                      Reserve Session
                    </button>
                  </div>
                </>
              )}

              {/* Gong Modal - Refined */}
              {activeModal === 'gong' && (
                <>
                  <div style={{ 
                    color: '#111',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both'
                  }}>
                    <h2 style={{ 
                      fontSize: '2.5rem', 
                      marginBottom: '2rem', 
                      letterSpacing: '1px',
                      fontWeight: '300',
                      color: '#111'
                    }}>Gong Bath</h2>
                    <p style={{ 
                      fontSize: '1rem', 
                      lineHeight: 1.8, 
                      marginBottom: '2rem',
                      color: '#444'
                    }}>
                      Immerse yourself in a sacred Gong Bath, where the resonant vibrations of the gong wash over the body, mind, and spirit, creating a profound meditative experience.
                    </p>
                    <blockquote style={{ 
                      fontSize: '1.1rem', 
                      fontStyle: 'italic', 
                      marginBottom: '2rem',
                      paddingLeft: '2rem',
                      borderLeft: '2px solid #ddd',
                      color: '#666'
                    }}>
                      "Concentrate on a tone, and in it you may discover the secret of 'being' and find 'the inner voice' of the Self."
                      <cite style={{ 
                        display: 'block', 
                        marginTop: '1rem',
                        fontSize: '0.9rem',
                        fontStyle: 'normal',
                        color: '#888'
                      }}>— Don Conreaux</cite>
                    </blockquote>
                    <button 
                      onClick={() => window.location.href = 'mailto:harmonicsandhealing@example.com'}
                      style={{ 
                        marginTop: '2rem',
                        padding: '1rem 2.5rem', 
                        backgroundColor: 'transparent', 
                        color: '#111', 
                        border: '1px solid #111', 
                        cursor: 'pointer', 
                        fontSize: '0.9rem', 
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontWeight: '300'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#111';
                        e.target.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#111';
                      }}
                    >
                      Inquire
                    </button>
                  </div>
                  <div style={{ 
                    height: '500px', 
                    backgroundImage: `url(${gongBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '2px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    animation: 'fadeInUp 0.8s ease-out 0.4s both'
                  }}></div>
                </>
              )}

              {/* About Modal - Refined */}
              {activeModal === 'about' && (
                <>
                  <div style={{ 
                    height: '500px', 
                    backgroundImage: `url(${aboutBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '2px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both'
                  }}></div>
                  <div style={{ 
                    color: '#111',
                    animation: 'fadeInUp 0.8s ease-out 0.4s both'
                  }}>
                    <h2 style={{ 
                      fontSize: '2.5rem', 
                      marginBottom: '2rem', 
                      letterSpacing: '1px',
                      fontWeight: '300',
                      color: '#111'
                    }}>About</h2>
                    <p style={{ 
                      fontSize: '1rem', 
                      lineHeight: 1.8, 
                      marginBottom: '1.5rem',
                      color: '#444'
                    }}>
                      Harmonics and Healing was founded on the belief that sound and energy are powerful tools for transformation. Our practitioners are dedicated to creating sacred spaces where healing can occur naturally and deeply.
                    </p>
                    <p style={{ 
                      fontSize: '1rem', 
                      lineHeight: 1.8, 
                      marginBottom: '2rem',
                      color: '#444'
                    }}>
                      With years of training in sound therapy, energy healing, and meditation practices, we bring ancient wisdom together with modern understanding to support your journey toward wholeness and well-being.
                    </p>
                    <button 
                      onClick={() => window.location.href = 'mailto:harmonicsandhealing@example.com'}
                      style={{ 
                        marginTop: '2rem',
                        padding: '1rem 2.5rem', 
                        backgroundColor: 'transparent', 
                        color: '#111', 
                        border: '1px solid #111', 
                        cursor: 'pointer', 
                        fontSize: '0.9rem', 
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontWeight: '300'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#111';
                        e.target.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#111';
                      }}
                    >
                      Contact
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Close hint at bottom */}
            <div style={{
              textAlign: 'center',
              marginTop: '4rem',
              paddingBottom: '2rem',
              opacity: isAtBottom ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}>
              <p style={{
                fontSize: '0.8rem',
                color: '#888',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>Scroll to close</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HarmonicsHealing;
