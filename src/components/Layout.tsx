import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthModal from './AuthModal';

const Layout = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleAuthModal = (e: CustomEvent) => {
      setAuthMode(e.detail.mode);
      setShowAuthModal(true);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('openAuthModal', handleAuthModal as EventListener);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('openAuthModal', handleAuthModal as EventListener);
    };
  }, []);

  const openLoginModal = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openSignupModal = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar 
        isScrolled={isScrolled} 
        onLoginClick={openLoginModal} 
        onSignupClick={openSignupModal} 
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal} 
        initialMode={authMode}
      />
    </div>
  );
};

export default Layout;