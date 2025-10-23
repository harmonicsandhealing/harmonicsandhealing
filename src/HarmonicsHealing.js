import React, { useState, useEffect } from 'react';
import healingBg from './assets/healing/tuning-fork-2.jpg';
import aboutBg from './assets/about/about.jpeg';
import gongBg from './assets/gong/gong_bath.jpg';
import logo from './assets/logo/logo.jpg';

function HarmonicsHealing() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bgImage, setBgImage] = useState(healingBg);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const backgroundImages = {
    healing: healingBg,
    gong: gongBg,
    about: aboutBg
  };

  // Native scroll event - passive for better performance
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate which section is in view
      const healingSection = document.querySelector('[data-section="healing"]');
      const gongSection = document.querySelector('[data-section="gong"]');
      const aboutSection = document.querySelector('[data-section="about"]');
      
      // Update parallax for visible sections
      if (healingSection) {
        const rect = healingSection.getBoundingClientRect();
        const progress = (windowHeight - rect.top) / (windowHeight + healingSection.offsetHeight);
        if (progress > -0.5 && progress < 1.5) {
          healingSection.style.transform = `translateY(${Math.max(0, (1 - progress) * 30)}px)`;
        }
      }
      
      if (gongSection) {
        const rect = gongSection.getBoundingClientRect();
        const progress = (windowHeight - rect.top) / (windowHeight + gongSection.offsetHeight);
        if (progress > -0.5 && progress < 1.5) {
          gongSection.style.transform = `translateY(${Math.max(0, (1 - progress) * 30)}px)`;
        }
      }
      
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        const progress = (windowHeight - rect.top) / (windowHeight + aboutSection.offsetHeight);
        if (progress > -0.5 && progress < 1.5) {
          aboutSection.style.transform = `translateY(${Math.max(0, (1 - progress) * 30)}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div style={{ overflow: 'auto', scrollBehavior: 'smooth' }}>
      {/* Fixed header */}
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
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
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
          fontSize: '1rem',
          fontWeight: 300,
          letterSpacing: '2px',
          textAlign: 'center',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
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
          <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s' }}></span>
          <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s' }}></span>
          <span style={{ width: '100%', height: '2px', backgroundColor: 'white', transition: 'all 0.3s' }}></span>
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          gap: '2rem'
        }}>
          <a href="https://www.instagram.com/harmonicsandhealing/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '1.5rem', textDecoration: 'none' }}>Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61581215911617" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '1.5rem', textDecoration: 'none' }}>Facebook</a>
          <a href="https://calendly.com/harmonicsandhealingny" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '1.5rem', textDecoration: 'none' }}>Book Now</a>
          <button onClick={() => setMenuOpen(false)} style={{ color: 'white', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
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
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }} onMouseLeave={handleMouseLeave}>
          <a 
            href="#healing"
            onClick={(e) => e.preventDefault()}
            onMouseEnter={() => handleImageChange(backgroundImages.healing)}
            style={{ 
              fontSize: '2.5rem',
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
          >
            Healing Sessions
          </a>
          <a 
            href="#gong"
            onClick={(e) => e.preventDefault()}
            onMouseEnter={() => handleImageChange(backgroundImages.gong)}
            style={{ 
              fontSize: '2.5rem',
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
          >
            Gong Bath
          </a>
          <a 
            href="#about"
            onClick={(e) => e.preventDefault()}
            onMouseEnter={() => handleImageChange(backgroundImages.about)}
            style={{ 
              fontSize: '2.5rem',
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
              cursor: 'pointer'
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
        <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '400px', backgroundImage: `url(${require('./assets/healing/tuning-fork-2.jpg').default})`, backgroundSize: 'cover', borderRadius: '10px' }}></div>
          <div style={{ flex: 1, color: '#000' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Healing Sessions</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>Reiki and Aura Tuning are gentle yet profound pathways to restore energetic harmony and inner peace. Each works through vibration and intention—one through the flow of universal life force, the other through the resonance of sound within the energy field.</p>
            <h3 style={{ fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Aura Tuning</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>Aura Tuning works with the subtle field that surrounds and connects us, using the resonance of tuning forks to identify and clear energetic imprints from the past.</p>
            <h3 style={{ fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Reiki</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>Reiki is a gentle yet powerful form of energy healing that channels universal life force to promote balance and well-being.</p>
            <button 
              onClick={() => window.open('https://calendly.com/harmonicsandhealingny', '_blank')}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#000', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
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
        <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: 1, color: '#000' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Gong Bath</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>Immerse yourself in a sacred Gong Bath, where the resonant vibrations of the gong wash over the body, mind, and spirit.</p>
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1rem' }}>"Concentrate on a tone, and in it you may discover the secret of 'being' and find 'the inner voice' of the Self." — Don Conreaux</p>
            <button 
              onClick={() => alert('Contact options: WhatsApp, Phone, Email')}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#000', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
            >
              Contact Me
            </button>
          </div>
          <div style={{ flex: 1, height: '400px', backgroundImage: `url(${require('./assets/gong/gong_bath.jpg').default})`, backgroundSize: 'cover', borderRadius: '10px' }}></div>
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
        <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '400px', backgroundImage: `url(${require('./assets/about/about.jpeg').default})`, backgroundSize: 'cover', borderRadius: '10px' }}></div>
          <div style={{ flex: 1, color: '#000' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>About</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>Harmonics and Healing was founded on the belief that sound and energy are powerful tools for transformation. Our practitioners are dedicated to creating sacred spaces where healing can occur naturally and deeply.</p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>With years of training in sound therapy, energy healing, and meditation practices, we bring ancient wisdom together with modern understanding to support your journey toward wholeness and well-being.</p>
            <button 
              onClick={() => alert('Contact: your-email@example.com')}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#000', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
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