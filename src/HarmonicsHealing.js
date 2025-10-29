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
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);

  const backgroundImages = {
    healing: healingBg,
    gong: gongBg,
    about: aboutBg
  };

  const [isAtBottom, setIsAtBottom] = useState(false);
  const touchStartY = useRef(0);
  const lastTouchY = useRef(0);
  const touchVelocity = useRef(0);
  const wheelAccumulator = useRef(0);

  // Prevent pull-to-refresh on mobile
  useEffect(() => {
    let lastY = 0;

    const preventPullToRefresh = (e) => {
      const currentY = e.touches[0].clientY;
      const scrollingUp = currentY > lastY;
      const atTop = window.pageYOffset === 0;
      
      if (scrollingUp && atTop) {
        e.preventDefault();
      }
      
      lastY = currentY;
    };

    const handleTouchStart = (e) => {
      lastY = e.touches[0].clientY;
    };

    document.body.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.body.addEventListener('touchmove', preventPullToRefresh, { passive: false });
    
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    return () => {
      document.body.removeEventListener('touchstart', handleTouchStart);
      document.body.removeEventListener('touchmove', preventPullToRefresh);
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, []);

  // Handle modal scroll to detect when at bottom
  useEffect(() => {
    if (!modalRef.current || !activeModal) return;

    const handleScroll = () => {
      const modal = modalRef.current;
      if (!modal) return;
      
      const scrollY = modal.scrollTop;
      const scrollHeight = modal.scrollHeight;
      const clientHeight = modal.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      const atBottom = scrollY >= maxScroll - 10;
      setIsAtBottom(atBottom);

      if (!atBottom) {
        setModalScroll(0);
        wheelAccumulator.current = 0;
      }
    };

    const modal = modalRef.current;
    modal.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      // Store modal ref in variable to use in cleanup
      const modalElement = modal;
      if (modalElement) {
        modalElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeModal]);

  // Handle wheel events for Mac trackpad
  useEffect(() => {
    if (!activeModal) return;

    let animationFrame = null;

    const handleWheel = (e) => {
      if (menuOpen) return;
      
      const modal = modalRef.current;
      if (!modal) return;

      const scrollHeight = modal.scrollHeight;
      const clientHeight = modal.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const currentScroll = modal.scrollTop;
      const atBottom = currentScroll >= maxScroll - 10;

      // Only trigger parallax when at bottom and scrolling down
      if (atBottom && e.deltaY > 0) {
        e.preventDefault();
        
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }

        // Accumulate wheel delta for smoother animation
        wheelAccumulator.current += e.deltaY;

        animationFrame = requestAnimationFrame(() => {
          const newParallax = modalScroll + wheelAccumulator.current * 0.5;
          setModalScroll(Math.min(newParallax, clientHeight));
          
          // Visual feedback
          if (newParallax > clientHeight * 0.3) {
            const fadeProgress = (newParallax - clientHeight * 0.3) / (clientHeight * 0.2);
            setFadeOverlay(Math.min(fadeProgress * 0.5, 0.5));
          }
          
          // Close when scrolled enough
          if (newParallax > clientHeight * 0.4) {
            closeModal();
          }
          
          wheelAccumulator.current = 0;
        });
      } else if (modalScroll > 0 && e.deltaY < 0) {
        // Allow scrolling back to reduce parallax
        e.preventDefault();
        const newParallax = Math.max(0, modalScroll + e.deltaY * 0.5);
        setModalScroll(newParallax);
        if (newParallax < clientHeight * 0.3) {
          setFadeOverlay(0);
        }
      }
    };

    // Add wheel listener to window for global handling
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeModal, modalScroll, menuOpen]);

  // Touch events for mobile
  useEffect(() => {
    if (!activeModal) return;

    let startY = 0;
    let currentY = 0;
    let startModalScroll = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      if (menuOpen) return;
      
      startY = e.touches[0].clientY;
      currentY = startY;
      touchStartY.current = startY;
      lastTouchY.current = startY;
      startModalScroll = modalScroll;
      isDragging = false;
      touchVelocity.current = 0;
    };

    const handleTouchMove = (e) => {
      if (menuOpen) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;
      touchVelocity.current = deltaY;
      lastTouchY.current = currentY;

      const modal = modalRef.current;
      if (!modal) return;

      const scrollHeight = modal.scrollHeight;
      const clientHeight = modal.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const currentScroll = modal.scrollTop;
      const atMaxScroll = currentScroll >= maxScroll - 10;

      // If at bottom of modal, start parallax
      if (atMaxScroll && deltaY > 0) {
        e.preventDefault();
        isDragging = true;
        const swipeDistance = startY - currentY;
        const newParallax = Math.max(0, swipeDistance * 0.8);
        setModalScroll(Math.min(newParallax, clientHeight));

        // Visual feedback
        if (newParallax > clientHeight * 0.3) {
          const fadeProgress = (newParallax - clientHeight * 0.3) / (clientHeight * 0.2);
          setFadeOverlay(Math.min(fadeProgress * 0.5, 0.5));
        }
      } 
      // Allow pulling back down if parallax is active
      else if (modalScroll > 0) {
        e.preventDefault();
        isDragging = true;
        const swipeDistance = startY - currentY;
        const newParallax = Math.max(0, startModalScroll + swipeDistance * 0.8);
        setModalScroll(Math.min(newParallax, clientHeight));
        
        if (newParallax < clientHeight * 0.3) {
          setFadeOverlay(0);
        }
      }
    };

    const handleTouchEnd = () => {
      if (menuOpen) return;
      
      const modal = modalRef.current;
      if (!modal) return;

      const clientHeight = modal.clientHeight;
      
      // Check if we should close
      const shouldClose = (modalScroll > clientHeight * 0.35) || 
                         (modalScroll > clientHeight * 0.2 && touchVelocity.current > 10);

      if (shouldClose && isDragging) {
        closeModal();
      } else if (modalScroll > 0) {
        animateScrollBack();
      }
      
      isDragging = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeModal, modalScroll, menuOpen]);

  const animateScrollBack = () => {
    const startTime = performance.now();
    const startScroll = modalScroll;
    const duration = 300;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScroll = startScroll * (1 - easeOut);
      
      setModalScroll(currentScroll);
      setFadeOverlay(0);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        wheelAccumulator.current = 0;
      }
    };

    requestAnimationFrame(animate);
  };

  const closeModal = () => {
    if (isClosing) return;
    setIsClosing(true);
    
    const modal = modalRef.current;
    if (modal) {
      const clientHeight = modal.clientHeight;
      const start = modalScroll;
      const startTime = performance.now();
      const duration = 400;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentScroll = start + (clientHeight - start) * easeOut;
        
        setModalScroll(currentScroll);
        setFadeOverlay(progress * 0.5);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setActiveModal(null);
          setModalScroll(0);
          setIsAtBottom(false);
          setIsClosing(false);
          setFadeOverlay(0);
          wheelAccumulator.current = 0;
        }
      };

      requestAnimationFrame(animate);
    }
  };

  const openModal = (section) => {
    setMenuOpen(false);
    setFadeOverlay(0.5);
    
    setTimeout(() => {
      setActiveModal(section);
      setBgImage(backgroundImages[section]);
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
      setModalScroll(0);
      wheelAccumulator.current = 0;
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
    <div style={{ 
      backgroundColor: '#000', 
      minHeight: '100vh', 
      position: 'relative',
      overscrollBehavior: 'none',
      WebkitOverflowScrolling: 'touch'
    }}>
      {/* Fade Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        opacity: fadeOverlay,
        transition: isClosing ? 'none' : 'opacity 0.3s ease',
        zIndex: 90,
        pointerEvents: fadeOverlay > 0 ? 'all' : 'none'
      }}></div>

      {/* Hero Background */}
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
          top: '-5%',
          left: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: bgOpacity * 0.7,
          transition: 'opacity 0.6s ease',
          filter: 'contrast(1.1) brightness(0.8)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none'
        }}></div>
      </div>

      {/* Header with Logo, Catchphrase, and Hamburger */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2rem',
        zIndex: 2000,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)'
      }}>
        {/* Logo */}
        <div 
          style={{
            width: '50px',
            height: '50px',
            backgroundImage: `url(${logo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.95,
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onClick={() => {
            if (activeModal) closeModal();
          }}
        ></div>

        {/* Catchphrase */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: activeModal ? 0 : 1,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: 'white',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '300',
            opacity: 0.8,
            margin: 0
          }}>Tuned to Harmony</p>
          <div style={{
            width: '30px',
            height: '1px',
            backgroundColor: 'white',
            margin: '0.3rem auto',
            opacity: 0.4
          }}></div>
          <p style={{
            fontSize: '0.75rem',
            color: 'white',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '300',
            opacity: 0.8,
            margin: 0
          }}>Healed by Sound</p>
        </div>

        {/* Hamburger Menu */}
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
            width: '25px', 
            height: '1.5px', 
            backgroundColor: 'white', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            transform: menuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none',
            opacity: 0.9
          }}></span>
          <span style={{ 
            width: '25px', 
            height: '1.5px', 
            backgroundColor: 'white', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            opacity: menuOpen ? 0 : 0.9
          }}></span>
          <span style={{ 
            width: '25px', 
            height: '1.5px', 
            backgroundColor: 'white', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            transform: menuOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none',
            opacity: 0.9
          }}></span>
        </div>
      </div>

      {/* Menu Overlay */}
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
          gap: '2.5rem', 
          textAlign: 'center',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
        }}>
          <a href="https://www.instagram.com/harmonicsandhealing/" 
             target="_blank" 
             rel="noopener noreferrer" 
             style={{ 
               fontSize: '1.1rem', 
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
               fontSize: '1.1rem', 
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
               fontSize: '1.1rem', 
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
          >Book Session</a>
          <button 
             onClick={() => { setMenuOpen(false); openModal('about'); }} 
             style={{ 
               fontSize: '1.1rem', 
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

      {/* Hero Content */}
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
            textAlign: 'center',
            animation: 'fadeInUp 1.2s ease-out',
            marginBottom: '3rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(3rem, 7vw, 5rem)',
              color: 'white',
              fontWeight: '200',
              letterSpacing: '10px',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              opacity: 0.95,
              fontFamily: "'Cormorant Garamond', serif"
            }}>Harmonics</h1>
            <div style={{
              width: '100px',
              height: '1px',
              backgroundColor: 'white',
              margin: '0 auto',
              opacity: 0.4
            }}></div>
            <h2 style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'white',
              fontWeight: '300',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              marginTop: '1rem',
              opacity: 0.8
            }}>& Healing</h2>
          </div>

          {/* Navigation Links */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2rem', 
            alignItems: 'center'
          }} onMouseLeave={handleMouseLeave}>
            <button 
              onClick={() => openModal('healing')}
              onMouseEnter={() => handleImageChange(backgroundImages.healing)}
              style={{ 
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0.5rem 1rem',
                fontWeight: '300',
                position: 'relative',
                opacity: 0.85,
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.letterSpacing = '5px';
                const underline = e.currentTarget.querySelector('.underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '0.85';
                e.currentTarget.style.letterSpacing = '3px';
                const underline = e.currentTarget.querySelector('.underline');
                if (underline) underline.style.width = '0';
              }}
            >
              Healing Sessions
              <div className="underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '1px',
                backgroundColor: 'white',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0.6
              }}></div>
            </button>
            <button 
              onClick={() => openModal('gong')}
              onMouseEnter={() => handleImageChange(backgroundImages.gong)}
              style={{ 
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0.5rem 1rem',
                fontWeight: '300',
                position: 'relative',
                opacity: 0.85,
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.letterSpacing = '5px';
                const underline = e.currentTarget.querySelector('.underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '0.85';
                e.currentTarget.style.letterSpacing = '3px';
                const underline = e.currentTarget.querySelector('.underline');
                if (underline) underline.style.width = '0';
              }}
            >
              Gong Bath
              <div className="underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '1px',
                backgroundColor: 'white',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0.6
              }}></div>
            </button>
            <button 
              onClick={() => openModal('about')}
              onMouseEnter={() => handleImageChange(backgroundImages.about)}
              style={{ 
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0.5rem 1rem',
                fontWeight: '300',
                position: 'relative',
                opacity: 0.85,
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.letterSpacing = '5px';
                const underline = e.currentTarget.querySelector('.underline');
                if (underline) underline.style.width = '100%';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '0.85';
                e.currentTarget.style.letterSpacing = '3px';
                const underline = e.currentTarget.querySelector('.underline');
                if (underline) underline.style.width = '0';
              }}
            >
              About
              <div className="underline" style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '1px',
                backgroundColor: 'white',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0.6
              }}></div>
            </button>
          </div>
        </div>
      )}

      {/* Modal with Fade In and Parallax Close */}
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
            overflowX: 'hidden',
            zIndex: 100,
            opacity: isClosing ? 1 - (modalScroll / (modalRef.current?.clientHeight || 1000)) : 1,
            animation: !isClosing ? 'fadeIn 0.5s ease-out forwards' : 'none',
            transform: `translateY(-${modalScroll}px)`,
            transition: isClosing ? 'none' : 'opacity 0.5s ease',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: modalScroll > 0 ? 'none' : 'auto'
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
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
          `}</style>

          <div style={{ 
            padding: '120px 2rem 3rem', 
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)'
          }}>
            <div style={{ 
              maxWidth: '1200px', 
              margin: '0 auto'
            }}>
              
              {/* Healing Modal */}
              {activeModal === 'healing' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '3rem',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    height: '450px', 
                    backgroundImage: `url(${healingBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '2px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both'
                  }}></div>
                  <div style={{ 
                    color: '#111',
                    animation: 'fadeInUp 0.8s ease-out 0.3s both',
                    padding: '1rem'
                  }}>
                    <h2 style={{ 
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
                      marginBottom: '2rem', 
                      letterSpacing: '1px',
                      fontWeight: '300',
                      color: '#111',
                      fontFamily: "'Cormorant Garamond', serif"
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
                      marginTop: '2.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid #ddd'
                    }}>
                      <h3 style={{ 
                        fontSize: '1.2rem', 
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
                        fontSize: '1.2rem', 
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
                        marginTop: '1.5rem',
                        padding: '0.9rem 2rem', 
                        backgroundColor: 'transparent', 
                        color: '#111', 
                        border: '1px solid #111', 
                        cursor: 'pointer', 
                        fontSize: '0.85rem', 
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
                      Book Session
                    </button>
                  </div>
                </div>
              )}

              {/* Gong Modal */}
              {activeModal === 'gong' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '3rem',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    color: '#111',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both',
                    padding: '1rem',
                    order: 1
                  }}>
                    <h2 style={{ 
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
                      marginBottom: '2rem', 
                      letterSpacing: '1px',
                      fontWeight: '300',
                      color: '#111',
                      fontFamily: "'Cormorant Garamond', serif"
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
                      paddingLeft: '1.5rem',
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
                        marginTop: '1.5rem',
                        padding: '0.9rem 2rem', 
                        backgroundColor: 'transparent', 
                        color: '#111', 
                        border: '1px solid #111', 
                        cursor: 'pointer', 
                        fontSize: '0.85rem', 
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
                    height: '450px', 
                    backgroundImage: `url(${gongBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '2px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    animation: 'fadeInUp 0.8s ease-out 0.3s both',
                    order: 2
                  }}></div>
                </div>
              )}

              {/* About Modal */}
              {activeModal === 'about' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '3rem',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    height: '450px', 
                    backgroundImage: `url(${aboutBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '2px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both'
                  }}></div>
                  <div style={{ 
                    color: '#111',
                    animation: 'fadeInUp 0.8s ease-out 0.3s both',
                    padding: '1rem'
                  }}>
                    <h2 style={{ 
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
                      marginBottom: '2rem', 
                      letterSpacing: '1px',
                      fontWeight: '300',
                      color: '#111',
                      fontFamily: "'Cormorant Garamond', serif"
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
                        marginTop: '1.5rem',
                        padding: '0.9rem 2rem', 
                        backgroundColor: 'transparent', 
                        color: '#111', 
                        border: '1px solid #111', 
                        cursor: 'pointer', 
                        fontSize: '0.85rem', 
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
                </div>
              )}
            </div>
            
            {/* Scroll indicator at bottom */}
            {modalScroll === 0 && (
              <div style={{
                textAlign: 'center',
                marginTop: '4rem',
                paddingBottom: '2rem',
                opacity: isAtBottom ? 0.8 : 0.3,
                transition: 'opacity 0.5s ease',
                animation: 'fadeInUp 0.8s ease-out 0.5s both'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase'
                }}>
                  {isAtBottom ? 'Scroll down or swipe up to close' : 'Scroll for more'}
                </p>
                <div style={{
                  width: '1px',
                  height: '20px',
                  backgroundColor: '#888',
                  margin: '0.5rem auto',
                  opacity: 0.5
                }}></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HarmonicsHealing;