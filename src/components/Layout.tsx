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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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