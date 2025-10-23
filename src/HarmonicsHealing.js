import React, { useState, useEffect } from 'react';

// Import images
import healingBg from './assets/healing/tuning-fork-2.jpg';
import aboutBg from './assets/about/about.jpeg';
import gongBg from './assets/gong/gong_bath.jpg';
import logo from './assets/logo/logo.jpg';

function HarmonicsHealing() {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [targetScroll, setTargetScroll] = useState(0);
  const [bgImage, setBgImage] = useState(healingBg);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [fadeOverlay, setFadeOverlay] = useState(0);
  const [defaultBg, setDefaultBg] = useState(healingBg);

  const backgroundImages = {
    healing: healingBg,
    gong: gongBg,
    about: aboutBg
  };

  // Smooth scroll animation
  useEffect(() => {
    let animationFrame;
    
    const animate = () => {
      setScrollProgress(current => {
        const diff = targetScroll - current;
        if (Math.abs(diff) < 0.5) {
          return targetScroll;
        }
        return current + diff * 0.1;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetScroll]);

  // Touch and wheel handlers
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    const handleWheel = (e) => {
      if (currentPage !== 'home') {
        e.preventDefault();
        if (e.deltaY > 0) {
          setTargetScroll(prev => Math.min(prev + 10, 300));
        } else {
          setTargetScroll(prev => Math.max(prev - 10, 0));
        }
      }
    };

    const handleTouchStart = (e) => {
      if (currentPage !== 'home') {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (currentPage !== 'home') {
        e.preventDefault();
        touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        setTargetScroll(prev => Math.max(0, Math.min(300, prev + deltaY * 0.5)));
      }
    };

    const handleTouchEnd = () => {
      touchStartY = 0;
      touchEndY = 0;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPage]);

  // Check if scrolled all the way back to home
  useEffect(() => {
    if (currentPage !== 'home' && scrollProgress >= 300) {
      setCurrentPage('home');
      setScrollProgress(0);
      setTargetScroll(0);
    }
  }, [scrollProgress, currentPage]);

  const navigateToPage = (page) => {
    setMenuOpen(false);
    setFadeOverlay(1);

    setTimeout(() => {
      setScrollProgress(0);
      setTargetScroll(0);
      setCurrentPage(page);

      if (page === 'home') {
        setBgImage(backgroundImages.healing);
        setDefaultBg(backgroundImages.healing);
      } else if (page !== 'home') {
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
          alt="Harmonics and Healing Logo" 
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Hamburger Menu */}
      <div 
        className={`hamburger ${menuOpen ? 'open' : ''}`}
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
        <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s ease', transform: menuOpen ? 'rotate(45deg) translate(8px, 8px)' : 'none' }}></span>
        <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s ease', opacity: menuOpen ? 0 : 1 }}></span>
        <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s ease', transform: menuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none' }}></span>
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
            <a href="https://www.facebook.com/profile.php?id=61581215911617&ref=_xav_ig_profile_page_web_bt" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'white', textDecoration: 'none', letterSpacing: '1.5px' }}>Facebook</a>
            <a href="https://calendly.com/harmonicsandhealingny" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'white', textDecoration: 'none', letterSpacing: '1.5px' }}>Book Now</a>
            <button onClick={() => { setMenuOpen(false); navigateToPage('about'); }} style={{ fontSize: '0.75rem', color: 'white', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '1.5px' }}>About</button>
          </div>
        </div>
      )}

      {/* Background for sections */}
      {currentPage !== 'home' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <HeroPage 
            bgImage={bgImage} 
            bgOpacity={bgOpacity} 
            backgroundImages={backgroundImages} 
            handleImageChange={handleImageChange}
            handleMouseLeave={handleMouseLeave}
            navigateToPage={navigateToPage} 
          />
        </div>
      )}

      {/* Sections with parallax */}
      {currentPage !== 'home' && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 1,
          transform: `translateY(-${scrollProgress * 0.3}vh)`,
          transition: 'transform 0.05s linear'
        }}>
          {currentPage === 'healing' && <HealingPage />}
          {currentPage === 'gong' && <GongPage />}
          {currentPage === 'about' && <AboutPage />}
        </div>
      )}

      {/* Home page */}
      {currentPage === 'home' && (
        <HeroPage 
          bgImage={bgImage} 
          bgOpacity={bgOpacity} 
          backgroundImages={backgroundImages} 
          handleImageChange={handleImageChange}
          handleMouseLeave={handleMouseLeave}
          navigateToPage={navigateToPage} 
        />
      )}
    </div>
  );
}

function HeroPage({ bgImage, bgOpacity, backgroundImages, handleImageChange, handleMouseLeave, navigateToPage }) {
  const handleMouseEnter = (link) => {
    handleImageChange(backgroundImages[link]);
  };

  const getActiveLinkStyle = (linkBg) => {
    return bgImage === linkBg ? { borderBottom: '1px solid white' } : {};
  };

  return (
    <div className="hero" style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ 
        backgroundImage: `url(${bgImage})`,
        opacity: bgOpacity,
        transition: 'opacity 0.3s ease',
        backgroundColor: '#000',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}></div>
      
      <div style={{
        position: 'relative',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
        <div 
          onMouseLeave={handleMouseLeave}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigateToPage('healing'); }}
            onMouseEnter={() => handleMouseEnter('healing')}
            style={{ 
              fontSize: '2rem', 
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              borderBottom: '1px solid transparent',
              transition: 'all 0.3s ease',
              padding: '1rem 2rem',
              ...getActiveLinkStyle(backgroundImages.healing)
            }}
          >
            Healing Sessions
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigateToPage('gong'); }}
            onMouseEnter={() => handleMouseEnter('gong')}
            style={{ 
              fontSize: '2rem', 
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              borderBottom: '1px solid transparent',
              transition: 'all 0.3s ease',
              padding: '1rem 2rem',
              ...getActiveLinkStyle(backgroundImages.gong)
            }}
          >
            Gong Bath
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigateToPage('about'); }}
            onMouseEnter={() => handleMouseEnter('about')}
            style={{ 
              fontSize: '2rem', 
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              borderBottom: '1px solid transparent',
              transition: 'all 0.3s ease',
              padding: '1rem 2rem',
              ...getActiveLinkStyle(backgroundImages.about)
            }}
          >
            About
          </a>
        </div>
      </div>
    </div>
  );
}

function HealingPage() {
  const handleBookSession = () => {
    window.open('https://calendly.com/harmonicsandhealingny', '_blank');
  };

  return (
    <div className="section-page" style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '3rem', maxWidth: '1200px', width: '100%', alignItems: 'center' }}>
        <div style={{ flex: 1, height: '400px', backgroundImage: `url(${require('./assets/healing/tuning-fork-2.jpg').default})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px' }}></div>
        <div style={{ flex: 1, color: '#000' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', letterSpacing: '2px' }}>Healing Sessions</h2>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'justify' }}>Reiki and Aura Tuning are gentle yet profound pathways to restore energetic harmony and inner peace. Each works through vibration and intention—one through the flow of universal life force, the other through the resonance of sound within the energy field. Together, they help dissolve energetic blockages, awaken your natural healing capacity, and reconnect you with the calm, luminous presence of your true self.</p>
          <h3 style={{ fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Aura Tuning</h3>
          <p style={{ fontSize: '0.85rem', textAlign: 'justify', marginBottom: '1rem' }}>Aura Tuning works with the subtle field that surrounds and connects us, using the resonance of tuning forks to identify and clear energetic imprints from the past. The auric field, like a living memory, holds traces of experiences that shape our present reality. As the vibrations bring coherence to this field, tension and stagnation dissolve—awakening clarity, lightness, and a renewed connection to your higher self.</p>
          <h3 style={{ fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Reiki</h3>
          <p style={{ fontSize: '0.85rem', textAlign: 'justify', marginBottom: '1rem' }}>Reiki is a gentle yet powerful form of energy healing that channels universal life force to promote balance and well-being. Through light touch or intention, Reiki harmonizes the body, mind, and spirit, dissolving energetic blockages and restoring natural vitality. It invites deep relaxation, renewal, and a profound sense of peace that radiates from within.</p>
          <button style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', backgroundColor: '#000', color: 'white', border: 'none', cursor: 'pointer', letterSpacing: '1px' }} onClick={handleBookSession}>Book a Session</button>
        </div>
      </div>
    </div>
  );
}

function GongPage() {
  const [showContactIcons, setShowContactIcons] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const email = 'your-email@example.com';
  const whatsappNumber = '+1234567890';
  const phoneNumber = '+1234567890';

  const isMobile = () => /iPhone|iPad|Android/i.test(navigator.userAgent);

  const handleContactClick = () => {
    if (isMobile()) {
      setShowContactIcons(!showContactIcons);
    } else {
      setShowContactModal(true);
    }
  };

  return (
    <div className="section-page" style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {showContactModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ color: '#000', marginBottom: '1rem' }}>Get in Touch</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#000', display: 'block', marginBottom: '0.5rem' }}>Your Email:</label>
              <input type="email" placeholder="your@email.com" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', color: '#000' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#000', display: 'block', marginBottom: '0.5rem' }}>Message:</label>
              <textarea placeholder="Your message..." style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', color: '#000', minHeight: '100px' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowContactModal(false)} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#ccc', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
              <button onClick={() => window.location.href = `mailto:${email}`} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '3rem', maxWidth: '1200px', width: '100%', alignItems: 'center' }}>
        <div style={{ flex: 1, color: '#000' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', letterSpacing: '2px' }}>Gong Bath</h2>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'justify' }}>Immerse yourself in a sacred Gong Bath, where the resonant vibrations of the gong wash over the body, mind, and spirit. Each tone clears stagnant energy, dissolves tension, and invites a deep state of relaxation, guiding you to inner harmony and presence.</p>
          <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>"Concentrate on a tone, and in it you may discover the secret of 'being' and find 'the inner voice' of the Self." — Don Conreaux</p>
          <button style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', backgroundColor: '#000', color: 'white', border: 'none', cursor: 'pointer', letterSpacing: '1px' }} onClick={handleContactClick}>Contact Me</button>
          
          {showContactIcons && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', gap: '1.5rem', justifyContent: 'flex-start' }}>
              <button onClick={() => window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}>
                <div style={{ fontSize: '2.5rem' }}>💬</div>
                <span style={{ fontSize: '0.75rem' }}>WhatsApp</span>
              </button>
              <button onClick={() => window.location.href = `tel:${phoneNumber}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}>
                <div style={{ fontSize: '2.5rem' }}>☎️</div>
                <span style={{ fontSize: '0.75rem' }}>Phone</span>
              </button>
              <button onClick={() => window.location.href = `mailto:${email}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}>
                <div style={{ fontSize: '2.5rem' }}>✉️</div>
                <span style={{ fontSize: '0.75rem' }}>Email</span>
              </button>
            </div>
          )}
        </div>
        <div style={{ flex: 1, height: '400px', backgroundImage: `url(${require('./assets/gong/gong_bath.jpg').default})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px' }}></div>
      </div>
    </div>
  );
}

function AboutPage() {
  const [showContactModal, setShowContactModal] = useState(false);
  const email = 'your-email@example.com';

  return (
    <div className="section-page" style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {showContactModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ color: '#000', marginBottom: '1rem' }}>Get in Touch</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#000', display: 'block', marginBottom: '0.5rem' }}>Your Email:</label>
              <input type="email" placeholder="your@email.com" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', color: '#000' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#000', display: 'block', marginBottom: '0.5rem' }}>Message:</label>
              <textarea placeholder="Your message..." style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', color: '#000', minHeight: '100px' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowContactModal(false)} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#ccc', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
              <button onClick={() => window.location.href = `mailto:${email}`} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '3rem', maxWidth: '1200px', width: '100%', alignItems: 'center' }}>
        <div style={{ flex: 1, height: '400px', backgroundImage: `url(${require('./assets/about/about.jpeg').default})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px' }}></div>
        <div style={{ flex: 1, color: '#000' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', letterSpacing: '2px' }}>About</h2>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Harmonics and Healing was founded on the belief that sound and energy are powerful tools for transformation. Our practitioners are dedicated to creating sacred spaces where healing can occur naturally and deeply.</p>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>With years of training in sound therapy, energy healing, and meditation practices, we bring ancient wisdom together with modern understanding to support your journey toward wholeness and well-being.</p>
          <button style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', backgroundColor: '#000', color: 'white', border: 'none', cursor: 'pointer', letterSpacing: '1px' }} onClick={() => setShowContactModal(true)}>Contact Me</button>
        </div>
      </div>
    </div>
  );
}

export default HarmonicsHealing;