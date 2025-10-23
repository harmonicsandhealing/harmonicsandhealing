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
  const [showContactIcons, setShowContactIcons] = useState(false);
  const [bgImage, setBgImage] = useState(healingBg);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [fadeOverlay, setFadeOverlay] = useState(0);
  const [defaultBg, setDefaultBg] = useState(healingBg);

  const backgroundImages = {
    healing: healingBg,
    gong: gongBg,
    about: aboutBg
  };

  // Smooth scroll animation with requestAnimationFrame
  useEffect(() => {
    let animationFrame;
    
    const animate = () => {
      setScrollProgress(current => {
        const diff = targetScroll - current;
        if (Math.abs(diff) < 0.5) {
          return targetScroll;
        }
        return current + diff * 0.15;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [targetScroll]);

  // Wheel event handler for desktop and touch events for mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    let isScrolling = false;

    const handleWheel = (e) => {
      if (currentPage !== 'home') {
        e.preventDefault();
        
        if (e.deltaY > 0) {
          setTargetScroll(prev => Math.min(prev + 15, 120));
        } else {
          setTargetScroll(prev => Math.max(prev - 15, 0));
        }
      }
    };

    const handleTouchStart = (e) => {
      if (currentPage !== 'home') {
        touchStartY = e.touches[0].clientY;
        isScrolling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (currentPage !== 'home' && isScrolling) {
        e.preventDefault();
        touchEndY = e.touches[0].clientY;
        
        // Real-time scroll during touch drag for mobile responsiveness
        const deltaY = touchStartY - touchEndY;
        const scrollAmount = deltaY / 10; // Convert pixel movement to scroll progress
        
        setTargetScroll(prev => 
          Math.max(0, Math.min(120, prev + scrollAmount))
        );
      }
    };

    const handleTouchEnd = () => {
      isScrolling = false;
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
      {/* Fade Overlay for transitions */}
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

      {/* Catchphrase - Fixed at top center, same level as logo */}
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
        maxWidth: '70%',
        display: 'flex',
        alignItems: 'center',
        height: '50px'
      }}>
        Tuned to Harmony, Healed by Sound
      </div>

      {/* Logo in upper left corner */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        left: '2rem',
        zIndex: 2000,
        opacity: 0.5,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        height: '50px'
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
        className={`hamburger ${currentPage !== 'home' ? 'dark' : ''} ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="menu-overlay active" style={{
          background: 'transparent',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          paddingTop: '2rem',
          paddingRight: '4.5rem'
        }}>
          <div className="menu-links" style={{
            textAlign: 'right',
            width: 'auto'
          }}>
            <a href="https://www.instagram.com/harmonicsandhealing/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', margin: '0.6rem 0', letterSpacing: '1.5px' }}>Insta</a>
            <a href="https://www.facebook.com/profile.php?id=61581215911617&ref=_xav_ig_profile_page_web_bt" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', margin: '0.6rem 0', letterSpacing: '1.5px' }}>Facebook</a>
            <a href="https://calendly.com/harmonicsandhealingny" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', margin: '0.6rem 0', letterSpacing: '1.5px' }}>Book Now</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToPage('about'); }} style={{ fontSize: '0.75rem', margin: '0.6rem 0', letterSpacing: '1.5px' }}>About</a>
          </div>
        </div>
      )}

      {/* Home page background when on section pages */}
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

      {/* Section pages overlay - parallax with scale effect */}
      {currentPage !== 'home' && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 1,
          transform: `translateY(${scrollProgress * 1.5}vh) scale(${1 - scrollProgress * 0.002})`,
          transition: 'transform 0.08s linear',
          transformOrigin: 'center center'
        }}>
          {currentPage === 'healing' && <HealingPage />}
          {currentPage === 'gong' && <GongPage />}
          {currentPage === 'about' && <AboutPage />}
        </div>
      )}

      {/* Show home page directly when on home */}
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

// Hero/Home Page Component
function HeroPage({ bgImage, bgOpacity, backgroundImages, handleImageChange, handleMouseLeave, navigateToPage }) {
  const handleMouseEnter = (link) => {
    handleImageChange(backgroundImages[link]);
  };

  const getActiveLinkStyle = (linkBg) => {
    return bgImage === linkBg ? { borderBottom: '1px solid white' } : {};
  };

  return (
    <div className="hero">
      <div className="hero-bg" style={{ 
        backgroundImage: `url(${bgImage})`,
        opacity: bgOpacity,
        transition: 'opacity 0.3s ease',
        backgroundColor: '#000'
      }}></div>
      <div className="hero-bg" style={{ 
        backgroundImage: `url(${bgImage})`,
        opacity: 1 - bgOpacity,
        transition: 'opacity 0.3s ease',
        backgroundColor: '#000',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}></div>
      
      <div className="hero-content">
        <div 
          className="hero-links" 
          onMouseLeave={handleMouseLeave}
          style={{
            padding: '2rem 4rem',
            margin: '-2rem -4rem'
          }}
        >
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); navigateToPage('healing'); }}
            onMouseEnter={() => handleMouseEnter('healing')}
            style={{ 
              fontSize: '2rem', 
              whiteSpace: 'nowrap',
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
              whiteSpace: 'nowrap',
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
              whiteSpace: 'nowrap',
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

// Healing Sessions Page
function HealingPage() {
  const handleBookSession = () => {
    window.open('https://calendly.com/harmonicsandhealingny', '_blank');
  };

  return (
    <div className="section-page">
      <div className="section-content-wrapper">
        <div className="section-image" style={{ backgroundImage: `url(${healingBg})` }}></div>
        <div className="section-text">
          <h2 style={{ fontSize: '1.75rem' }}>Healing Sessions</h2>
          <p style={{ fontSize: '0.85rem', textAlign:'justify' }}>Reiki and Aura Tuning are gentle yet profound pathways to restore energetic harmony and inner peace. Each works through vibration and intentionâ€"one through the flow of universal life force, the other through the resonance of sound within the energy field. Together, they help dissolve energetic blockages, awaken your natural healing capacity, and reconnect you with the calm, luminous presence of your true self.</p>
          <h3 style={{ fontSize: '0.95rem' }}>Aura Tuning</h3>
          <p className="subtext" style={{ fontSize: '0.85rem', textAlign:'justify' }}>Aura Tuning works with the subtle field that surrounds and connects us, using the resonance of tuning forks to identify and clear energetic imprints from the past. The auric field, like a living memory, holds traces of experiences that shape our present reality. As the vibrations bring coherence to this field, tension and stagnation dissolveâ€"awakening clarity, lightness, and a renewed connection to your higher self.</p>
          <h3 style={{ fontSize: '0.95rem' }}>Reiki</h3>
          <p className="subtext" style={{ fontSize: '0.85rem', textAlign:'justify' }}>Reiki is a gentle yet powerful form of energy healing that channels universal life force to promote balance and well-being. Through light touch or intention, Reiki harmonizes the body, mind, and spirit, dissolving energetic blockages and restoring natural vitality. It invites deep relaxation, renewal, and a profound sense of peace that radiates from within.</p> 
          <button style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }} onClick={handleBookSession}>Book a Session</button>
        </div>
      </div>
    </div>
  );
}

// Gong Bath Page
function GongPage() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showContactIcons, setShowContactIcons] = useState(false);
  const email = 'your-email@example.com'; // Replace with your actual email
  const whatsappNumber = '+1234567890'; // Replace with your actual WhatsApp number
  const phoneNumber = '+1234567890'; // Replace with your actual phone number

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hi, I'm interested in your Gong Bath sessions`);
  };

  const handlePhone = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}?subject=Gong Bath Inquiry`;
  };

  const isMobile = () => /iPhone|iPad|Android/i.test(navigator.userAgent);

  const handleContactClick = () => {
    if (isMobile()) {
      setShowContactIcons(!showContactIcons);
    } else {
      setShowContactModal(true);
    }
  };

  return (
    <div className="section-page">
      {showContactModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#000', marginBottom: '1rem', fontSize: '1.5rem' }}>Get in Touch</h3>
            <p style={{ color: '#000', marginBottom: '1rem' }}>Send me a message and I'll get back to you soon!</p>
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
              <button onClick={() => window.location.href = `mailto:${email}?subject=Contact from Gong Bath Page`} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        </div>
      )}

      <div className="section-content-wrapper">
        <div className="section-text">
          <h2 style={{ fontSize: '1.75rem' }}>Gong Bath</h2>
          <p style={{ fontSize: '0.85rem', textAlign:'justify' }}>Immerse yourself in a sacred Gong Bath, where the resonant vibrations of the gong wash over the body, mind, and spirit. Each tone clears stagnant energy, dissolves tension, and invites a deep state of relaxation, guiding you to inner harmony and presence.</p>
          <p style={{ fontSize: '0.85rem', fontStyle:'italic' }}>"Concentrate on a tone, and in it you may discover the secret of 'being' and find 'the inner voice' of the Self." â€" Don Conreaux</p>
          <button style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }} onClick={handleContactClick}>Contact Me</button>
          
          {showContactIcons && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem'
            }}>
              <button onClick={handleWhatsApp} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#000'
              }}>
                <div style={{ fontSize: '2.5rem' }}>💬</div>
                <span style={{ fontSize: '0.75rem' }}>WhatsApp</span>
              </button>
              <button onClick={handlePhone} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#000'
              }}>
                <div style={{ fontSize: '2.5rem' }}>☎️</div>
                <span style={{ fontSize: '0.75rem' }}>Phone</span>
              </button>
              <button onClick={handleEmail} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#000'
              }}>
                <div style={{ fontSize: '2.5rem' }}>✉️</div>
                <span style={{ fontSize: '0.75rem' }}>Email</span>
              </button>
            </div>
          )}
        </div>
        <div className="section-image" style={{ backgroundImage: `url(${gongBg})` }}></div>
      </div>
    </div>
  );
}

// About Page
function AboutPage() {
  const [showContactModal, setShowContactModal] = useState(false);
  const email = 'your-email@example.com'; // Replace with your actual email

  const isMobile = () => /iPhone|iPad|Android/i.test(navigator.userAgent);

  const handleContactClick = () => {
    if (isMobile()) {
      window.location.href = `mailto:${email}?subject=Contact from About Page`;
    } else {
      setShowContactModal(true);
    }
  };

  return (
    <div className="section-page">
      {showContactModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#000', marginBottom: '1rem', fontSize: '1.5rem' }}>Get in Touch</h3>
            <p style={{ color: '#000', marginBottom: '1rem' }}>Send me a message and I'll get back to you soon!</p>
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
              <button onClick={() => window.location.href = `mailto:${email}?subject=Contact from About Page`} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        </div>
      )}

      <div className="section-content-wrapper">
        <div className="section-image" style={{ backgroundImage: `url(${aboutBg})` }}></div>
        <div className="section-text">
          <h2 style={{ fontSize: '1.75rem' }}>About</h2>
          <p style={{ fontSize: '0.85rem' }}>Harmonics and Healing was founded on the belief that sound and energy are powerful tools for transformation. Our practitioners are dedicated to creating sacred spaces where healing can occur naturally and deeply.</p>
          <p style={{ fontSize: '0.85rem' }}>With years of training in sound therapy, energy healing, and meditation practices, we bring ancient wisdom together with modern understanding to support your journey toward wholeness and well-being.</p>
          <button style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }} onClick={handleContactClick}>Contact Me</button>
        </div>
      </div>
    </div>
  );
}

export default HarmonicsHealing;