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
  const modalRef = useRef(null);

  const backgroundImages = {
    healing: healingBg,
    gong: gongBg,
    about: aboutBg
  };

  const [isAtBottom, setIsAtBottom] = useState(false);

  // Handle modal scroll to detect swipe up and create smooth parallax
  useEffect(() => {
    if (!modalRef.current || !activeModal) return;

    const handleScroll = () => {
      const modal = modalRef.current;
      const scrollY = modal.scrollTop;
      const scrollHeight = modal.scrollHeight;
      const clientHeight = modal.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      // Check if at bottom
      const atBottom = scrollY >= maxScroll - 10;
      setIsAtBottom(atBottom);

      // If at bottom, allow the scroll value to keep increasing for parallax effect
      if (atBottom) {
        setModalScroll(scrollY - (maxScroll - 10));

        // Close when slid up enough
        if (scrollY - (maxScroll - 10) > clientHeight) {
          setFadeOverlay(1);
          setTimeout(() => {
            setActiveModal(null);
            setModalScroll(0);
            setIsAtBottom(false);
            setTimeout(() => setFadeOverlay(0), 50);
          }, 250);
        }
      } else {
        setModalScroll(0);
      }
    };

    const modal = modalRef.current;
    modal.addEventListener('scroll', handleScroll, { passive: true });
    return () => modal.removeEventListener('scroll', handleScroll);
  }, [activeModal]);

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
    setBgImage(healingBg);
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

      {/* Hero Background (always visible, fixed) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        opacity: bgOpacity,
        transition: 'opacity 0.3s ease',
        zIndex: 0
      }}></div>

      {/* Dark overlay on background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1,
        pointerEvents: 'none'
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      }}>
        {/* Logo */}
        <div style={{ opacity: 0.8, cursor: 'pointer' }}>
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
          Tuned to Harmony, Healed by Sound...
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
            <button onClick={() => { setMenuOpen(false); openModal('about'); }} style={{ fontSize: '0.75rem', color: 'white', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '1.5px' }}>About</button>
          </div>
        </div>
      )}

      {/* Hero Content - Center buttons */}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }} onMouseLeave={handleMouseLeave}>
            <button 
              onClick={() => openModal('healing')}
              onMouseEnter={() => handleImageChange(backgroundImages.healing)}
              style={{ 
                fontSize: '2.5rem',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0
              }}
            >
              Healing Sessions
            </button>
            <button 
              onClick={() => openModal('gong')}
              onMouseEnter={() => handleImageChange(backgroundImages.gong)}
              style={{ 
                fontSize: '2.5rem',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0
              }}
            >
              Gong Bath
            </button>
            <button 
              onClick={() => openModal('about')}
              onMouseEnter={() => handleImageChange(backgroundImages.about)}
              style={{ 
                fontSize: '2.5rem',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0
              }}
            >
              About
            </button>
          </div>
        </div>
      )}

      {/* Modal Overlay - Fades in, slides up on close */}
      {activeModal && (
        <div 
          ref={modalRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: '#fff',
            overflowY: 'auto',
            zIndex: 100,
            opacity: 1,
            animation: 'fadeIn 0.4s ease-out forwards',
            transform: `translateY(-${modalScroll * 1}px)`,
            transition: 'transform 0.05s linear'
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
          `}</style>

          <div style={{ padding: '80px 2rem 2rem', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
              
              {/* Healing Modal */}
              {activeModal === 'healing' && (
                <>
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
                </>
              )}

              {/* Gong Modal */}
              {activeModal === 'gong' && (
                <>
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
                </>
              )}

              {/* About Modal */}
              {activeModal === 'about' && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HarmonicsHealing;