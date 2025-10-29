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
  const touchStartYRef = useRef(0);
  const lastTouchYRef = useRef(0);
  const touchVelocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startModalScrollRef = useRef(0);
  const wheelAccumulatorRef = useRef(0);
  const cumulativeScrollRef = useRef(0); // Track cumulative scroll for multiple swipes
  const lastSwipeTimeRef = useRef(0);
  const isTouchDevice = useRef('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Prevent pull-to-refresh on mobile only
  useEffect(() => {
    if (!isTouchDevice.current) return;

    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
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

      const atBottom = scrollY >= maxScroll - 5;
      setIsAtBottom(atBottom);

      if (!atBottom && !isDraggingRef.current) {
        setModalScroll(0);
        wheelAccumulatorRef.current = 0;
        cumulativeScrollRef.current = 0; // Reset cumulative scroll when scrolling back up
      }
    };

    const modal = modalRef.current;
    modal.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => {
      if (modal) {
        modal.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeModal]);

  // Wheel events for Mac/Desktop
  useEffect(() => {
    if (!activeModal || isTouchDevice.current) return;

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
        wheelAccumulatorRef.current += e.deltaY;

        animationFrame = requestAnimationFrame(() => {
          const newParallax = modalScroll + wheelAccumulatorRef.current * 0.5;
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
          
          wheelAccumulatorRef.current = 0;
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

  // Touch events for mobile - with cumulative scroll support
  useEffect(() => {
    if (!activeModal || !modalRef.current || !isTouchDevice.current) return;

    let startY = 0;
    let currentY = 0;
    let startTime = 0;

    const handleTouchStart = (e) => {
      if (menuOpen) return;

      const modal = modalRef.current;
      if (!modal) return;

      const scrollHeight = modal.scrollHeight;
      const clientHeight = modal.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const atMaxScroll = modal.scrollTop >= maxScroll - 5;

      const now = Date.now();
      // Reset cumulative scroll if it's been more than 500ms since last swipe
      if (now - lastSwipeTimeRef.current > 500) {
        cumulativeScrollRef.current = 0;
      }

      // Only start drag if at bottom
      if (atMaxScroll) {
        startY = e.touches[0].clientY;
        currentY = startY;
        touchStartYRef.current = startY;
        lastTouchYRef.current = startY;
        startModalScrollRef.current = cumulativeScrollRef.current;
        startTime = now;
        isDraggingRef.current = false;
      }
    };

    const handleTouchMove = (e) => {
      if (menuOpen) return;

      const modal = modalRef.current;
      if (!modal) return;

      currentY = e.touches[0].clientY;
      const deltaY = lastTouchYRef.current - currentY;
      const totalDelta = touchStartYRef.current - currentY;
      
      touchVelocityRef.current = deltaY;
      lastTouchYRef.current = currentY;

      const scrollHeight = modal.scrollHeight;
      const clientHeight = modal.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const atMaxScroll = modal.scrollTop >= maxScroll - 5;

      // Start parallax when at bottom and swiping up
      if (atMaxScroll && totalDelta > 0) {
        e.preventDefault();
        isDraggingRef.current = true;
        lastSwipeTimeRef.current = Date.now();
        
        const swipeDistance = totalDelta;
        const resistance = 0.7; // Slightly more responsive
        // Add to cumulative scroll from previous swipes
        const newParallax = Math.max(0, startModalScrollRef.current + (swipeDistance * resistance));
        cumulativeScrollRef.current = newParallax;
        setModalScroll(Math.min(newParallax, clientHeight * 1.2));

        // Visual feedback - starts earlier for better UX
        if (newParallax > clientHeight * 0.15) {
          const fadeProgress = (newParallax - clientHeight * 0.15) / (clientHeight * 0.25);
          setFadeOverlay(Math.min(fadeProgress * 0.4, 0.4));
        } else {
          setFadeOverlay(0);
        }
      }
      // Allow pulling back down
      else if (cumulativeScrollRef.current > 0 && totalDelta < 0) {
        e.preventDefault();
        lastSwipeTimeRef.current = Date.now();
        const swipeDistance = totalDelta;
        const newParallax = Math.max(0, startModalScrollRef.current + swipeDistance * 0.7);
        cumulativeScrollRef.current = newParallax;
        setModalScroll(newParallax);
        
        if (newParallax < clientHeight * 0.15) {
          setFadeOverlay(0);
        }
      }
    };

    const handleTouchEnd = () => {
      if (menuOpen || !isDraggingRef.current) {
        isDraggingRef.current = false;
        return;
      }

      const modal = modalRef.current;
      if (!modal) return;

      const clientHeight = modal.clientHeight;
      const endTime = Date.now();
      const duration = endTime - startTime;
      const distance = touchStartYRef.current - currentY;
      const velocity = duration > 0 ? distance / duration : 0;

      // Close if:
      // 1. Dragged far enough (30% of screen - reduced threshold)
      // 2. Quick swipe up (high velocity)
      const shouldClose = 
        cumulativeScrollRef.current > clientHeight * 0.3 || 
        (cumulativeScrollRef.current > clientHeight * 0.2 && velocity > 0.5);

      if (shouldClose) {
        closeModal();
        cumulativeScrollRef.current = 0;
      } else if (cumulativeScrollRef.current > 0) {
        // Keep cumulative scroll for next swipe - don't reset!
        // This allows multiple small swipes to add up
      }
      
      isDraggingRef.current = false;
    };

    const modal = modalRef.current;
    modal.addEventListener('touchstart', handleTouchStart, { passive: true });
    modal.addEventListener('touchmove', handleTouchMove, { passive: false });
    modal.addEventListener('touchend', handleTouchEnd, { passive: true });
    modal.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    
    return () => {
      if (modal) {
        modal.removeEventListener('touchstart', handleTouchStart);
        modal.removeEventListener('touchmove', handleTouchMove);
        modal.removeEventListener('touchend', handleTouchEnd);
        modal.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, [activeModal, modalScroll, menuOpen]);

  const animateScrollBack = () => {
    const startTime = performance.now();
    const startScroll = modalScroll;
    const duration = 250;

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
        wheelAccumulatorRef.current = 0;
      }
    };

    requestAnimationFrame(animate);
  };

  const closeModal = () => {
    if (isClosing) return;
    setIsClosing(true);
    
    const modal = modalRef.current;
    if (!modal) return;

    const clientHeight = modal.clientHeight;
    const start = cumulativeScrollRef.current || modalScroll;
    const startTime = performance.now();
    const duration = 350;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeInOut = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentScroll = start + (clientHeight - start) * easeInOut;
      setModalScroll(currentScroll);
      setFadeOverlay(progress * 0.5);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setActiveModal(null);
          setModalScroll(0);
          setIsAtBottom(false);
          setIsClosing(false);
          setFadeOverlay(0);
          isDraggingRef.current = false;
          wheelAccumulatorRef.current = 0;
          cumulativeScrollRef.current = 0; // Reset cumulative scroll
        }, 50);
      }
    };

    requestAnimationFrame(animate);
  };

  const openModal = (section) => {
    setMenuOpen(false);
    setFadeOverlay(0.5);
    
    setTimeout(() => {
      setActiveModal(section);
      setBgImage(backgroundImages[section]);
      setModalScroll(0);
      wheelAccumulatorRef.current = 0;
      cumulativeScrollRef.current = 0; // Reset cumulative scroll
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
      setTimeout(() => setFadeOverlay(0), 100);
    }, 250);
  };

  const handleImageChange = (newImage) => {
    if (newImage === bgImage || isTouchDevice.current) return;
    setBgOpacity(0);
    setTimeout(() => {
      setBgImage(newImage);
      setTimeout(() => setBgOpacity(1), 50);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice.current) return;
    setBgImage(healingBg);
  };

  return (
    <div style={{ 
      backgroundColor: '#000', 
      minHeight: '100vh',
      width: '100%',
      position: isTouchDevice.current ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      overflow: 'hidden',
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'none'
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
        padding: isTouchDevice.current ? '1.5rem' : '2rem',
        zIndex: 2000,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)'
      }}>
        {/* Logo */}
        <div 
          style={{
            width: isTouchDevice.current ? '45px' : '50px',
            height: isTouchDevice.current ? '45px' : '50px',
            backgroundImage: `url(${logo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.95,
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent'
          }}
          onMouseEnter={(e) => !isTouchDevice.current && (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => !isTouchDevice.current && (e.currentTarget.style.transform = 'scale(1)')}
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
          pointerEvents: 'none',
          display: window.innerWidth < 768 ? 'none' : 'block'
        }}>
          <p style={{
            fontSize: '0.7rem',
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
            fontSize: '0.7rem',
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
            WebkitTapHighlightColor: 'transparent'
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
               opacity: 0.8,
               WebkitTapHighlightColor: 'transparent'
             }}
             onMouseEnter={(e) => !isTouchDevice.current && (e.target.style.opacity = '1')}
             onMouseLeave={(e) => !isTouchDevice.current && (e.target.style.opacity = '0.8')}
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
               opacity: 0.8,
               WebkitTapHighlightColor: 'transparent'
             }}
             onMouseEnter={(e) => !isTouchDevice.current && (e.target.style.opacity = '1')}
             onMouseLeave={(e) => !isTouchDevice.current && (e.target.style.opacity = '0.8')}
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
               opacity: 0.8,
               WebkitTapHighlightColor: 'transparent'
             }}
             onMouseEnter={(e) => !isTouchDevice.current && (e.target.style.opacity = '1')}
             onMouseLeave={(e) => !isTouchDevice.current && (e.target.style.opacity = '0.8')}
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
               fontFamily: 'inherit',
               WebkitTapHighlightColor: 'transparent'
             }}
             onMouseEnter={(e) => !isTouchDevice.current && (e.target.style.opacity = '1')}
             onMouseLeave={(e) => !isTouchDevice.current && (e.target.style.opacity = '0.8')}
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
          zIndex: 10,
          padding: '0 1rem'
        }}>
          {/* Main Title */}
          <div style={{
            textAlign: 'center',
            animation: 'fadeInUp 1.2s ease-out',
            marginBottom: '3rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 10vw, 5rem)',
              color: 'white',
              fontWeight: '200',
              letterSpacing: 'clamp(5px, 2vw, 10px)',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              opacity: 0.95,
              fontFamily: "'Cormorant Garamond', serif"
            }}>Harmonics</h1>
            <div style={{
              width: 'clamp(60px, 15vw, 100px)',
              height: '1px',
              backgroundColor: 'white',
              margin: '0 auto',
              opacity: 0.4
            }}></div>
            <h2 style={{
              fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
              color: 'white',
              fontWeight: '300',
              letterSpacing: 'clamp(3px, 1vw, 5px)',
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
            alignItems: 'center',
            width: '100%',
            maxWidth: '600px'
          }} onMouseLeave={handleMouseLeave}>
            <button 
              onClick={() => openModal('healing')}
              onMouseEnter={() => handleImageChange(backgroundImages.healing)}
              style={{ 
                fontSize: 'clamp(1.3rem, 5vw, 2.2rem)',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: 'clamp(2px, 0.5vw, 3px)',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0.5rem 1rem',
                fontWeight: '300',
                position: 'relative',
                opacity: 0.85,
                fontFamily: 'inherit',
                WebkitTapHighlightColor: 'transparent',
                width: isTouchDevice.current ? '100%' : 'auto',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                if (!isTouchDevice.current) {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.letterSpacing = '5px';
                }
              }}
              onMouseOut={(e) => {
                if (!isTouchDevice.current) {
                  e.currentTarget.style.opacity = '0.85';
                  e.currentTarget.style.letterSpacing = '3px';
                }
              }}
            >
              Healing Sessions
            </button>
            <button 
              onClick={() => openModal('gong')}
              onMouseEnter={() => handleImageChange(backgroundImages.gong)}
              style={{ 
                fontSize: 'clamp(1.3rem, 5vw, 2.2rem)',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: 'clamp(2px, 0.5vw, 3px)',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0.5rem 1rem',
                fontWeight: '300',
                position: 'relative',
                opacity: 0.85,
                fontFamily: 'inherit',
                WebkitTapHighlightColor: 'transparent',
                width: isTouchDevice.current ? '100%' : 'auto',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                if (!isTouchDevice.current) {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.letterSpacing = '5px';
                }
              }}
              onMouseOut={(e) => {
                if (!isTouchDevice.current) {
                  e.currentTarget.style.opacity = '0.85';
                  e.currentTarget.style.letterSpacing = '3px';
                }
              }}
            >
              Gong Bath
            </button>
            <button 
              onClick={() => openModal('about')}
              onMouseEnter={() => handleImageChange(backgroundImages.about)}
              style={{ 
                fontSize: 'clamp(1.3rem, 5vw, 2.2rem)',
                color: 'white',
                background: 'none',
                border: 'none',
                letterSpacing: 'clamp(2px, 0.5vw, 3px)',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0.5rem 1rem',
                fontWeight: '300',
                position: 'relative',
                opacity: 0.85,
                fontFamily: 'inherit',
                WebkitTapHighlightColor: 'transparent',
                width: isTouchDevice.current ? '100%' : 'auto',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                if (!isTouchDevice.current) {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.letterSpacing = '5px';
                }
              }}
              onMouseOut={(e) => {
                if (!isTouchDevice.current) {
                  e.currentTarget.style.opacity = '0.85';
                  e.currentTarget.style.letterSpacing = '3px';
                }
              }}
            >
              About
            </button>
          </div>
        </div>
      )}

      {/* Modal with Universal Close Gesture */}
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
            touchAction: isTouchDevice.current ? 'pan-y' : 'auto'
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
            padding: '100px 1.5rem 3rem', 
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
                  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '2.5rem',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    height: window.innerWidth < 768 ? '300px' : '450px',
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
                      fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
                      marginBottom: '2rem', 
                      letterSpacing: '1px',
                      fontWeight: '300',
                      color: '#111',
                      fontFamily: "'Cormorant Garamond', serif"
                    }}>Healing Sessions</h2>
                    <p style={{ 
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
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
                        fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
                        marginBottom: '1rem',
                        fontWeight: '400',
                        letterSpacing: '0.5px',
                        color: '#111'
                      }}>Aura Tuning</h3>
                      <p style={{ 
                        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', 
                        lineHeight: 1.7, 
                        marginBottom: '2rem',
                        color: '#555'
                      }}>
                        Working with the subtle field that surrounds and connects us, using the resonance of tuning forks to identify and clear energetic imprints from the past.
                      </p>
                      
                      <h3 style={{ 
                        fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
                        marginBottom: '1rem',
                        fontWeight: '400',
                        letterSpacing: '0.5px',
                        color: '#111'
                      }}>Reiki</h3>
                      <p style={{ 
                        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', 
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
                        fontWeight: '300',
                        WebkitTapHighlightColor: 'transparent',
                        width: isTouchDevice.current ? '100%' : 'auto',
                        maxWidth: isTouchDevice.current ? '100%' : '250px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isTouchDevice.current) {
                          e.target.style.backgroundColor = '#111';
                          e.target.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isTouchDevice.current) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#111';
                        }
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
                  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '2.5rem',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    color: '#111',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both',
                    padding: '1rem',
                    order: window.innerWidth < 768 ? 2 : 1
                  }}>
                    <h2 style={{ 
                      fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
                      marginBottom: '2rem', 
                      letterSpacing: '1px',
                      fontWeight: '300',
                      color: '#111',
                      fontFamily: "'Cormorant Garamond', serif"
                    }}>Gong Bath</h2>
                    <p style={{ 
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
                      lineHeight: 1.8, 
                      marginBottom: '2rem',
                      color: '#444'
                    }}>
                      Immerse yourself in a sacred Gong Bath, where the resonant vibrations of the gong wash over the body, mind, and spirit, creating a profound meditative experience.
                    </p>
                    <blockquote style={{ 
                      fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', 
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
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
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
                        fontWeight: '300',
                        WebkitTapHighlightColor: 'transparent',
                        width: isTouchDevice.current ? '100%' : 'auto',
                        maxWidth: isTouchDevice.current ? '100%' : '250px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isTouchDevice.current) {
                          e.target.style.backgroundColor = '#111';
                          e.target.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isTouchDevice.current) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#111';
                        }
                      }}
                    >
                      Inquire
                    </button>
                  </div>
                  <div style={{ 
                    height: window.innerWidth < 768 ? '300px' : '450px',
                    backgroundImage: `url(${gongBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '2px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    animation: 'fadeInUp 0.8s ease-out 0.3s both',
                    order: window.innerWidth < 768 ? 1 : 2
                  }}></div>
                </div>
              )}

              {/* About Modal */}
              {activeModal === 'about' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '2.5rem',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    height: window.innerWidth < 768 ? '300px' : '450px',
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
                      fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
                      marginBottom: '2rem', 
                      letterSpacing: '1px',
                      fontWeight: '300',
                      color: '#111',
                      fontFamily: "'Cormorant Garamond', serif"
                    }}>About</h2>
                    <p style={{ 
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
                      lineHeight: 1.8, 
                      marginBottom: '1.5rem',
                      color: '#444'
                    }}>
                      Harmonics and Healing was founded on the belief that sound and energy are powerful tools for transformation. Our practitioners are dedicated to creating sacred spaces where healing can occur naturally and deeply.
                    </p>
                    <p style={{ 
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
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
                        fontWeight: '300',
                        WebkitTapHighlightColor: 'transparent',
                        width: isTouchDevice.current ? '100%' : 'auto',
                        maxWidth: isTouchDevice.current ? '100%' : '250px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isTouchDevice.current) {
                          e.target.style.backgroundColor = '#111';
                          e.target.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isTouchDevice.current) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#111';
                        }
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
                paddingBottom: '3rem',
                opacity: isAtBottom ? 0.8 : 0.3,
                transition: 'opacity 0.5s ease',
                animation: 'fadeInUp 0.8s ease-out 0.5s both'
              }}>
                <p style={{
                  fontSize: '0.7rem',
                  color: '#888',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase'
                }}>
                  {isAtBottom ? (isTouchDevice.current ? 'Swipe up to close' : 'Scroll down to close') : 'Scroll for more'}
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