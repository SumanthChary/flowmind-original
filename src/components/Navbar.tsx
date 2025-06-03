import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, BrainCircuit, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';

interface NavbarProps {
  isScrolled: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const Navbar = ({ isScrolled, onLoginClick, onSignupClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile } = useAuthStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        isScrolled
          ? 'bg-white shadow-soft py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BrainCircuit className="h-8 w-8 text-accent-600" />
          <span className="text-xl font-bold text-gray-900">FlowMind</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/features" 
            className={({ isActive }) => 
              isActive 
                ? 'text-accent-600 font-medium' 
                : 'text-gray-700 hover:text-accent-600 transition-colors'
            }
          >
            Features
          </NavLink>
          <NavLink 
            to="/pricing" 
            className={({ isActive }) => 
              isActive 
                ? 'text-accent-600 font-medium' 
                : 'text-gray-700 hover:text-accent-600 transition-colors'
            }
          >
            Pricing
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              isActive 
                ? 'text-accent-600 font-medium' 
                : 'text-gray-700 hover:text-accent-600 transition-colors'
            }
          >
            About
          </NavLink>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-accent-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 text-gray-700 hover:text-accent-600 transition-colors"
              >
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name || 'Profile'} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-accent-600" />
                  </div>
                )}
                <span>{profile?.full_name || 'Profile'}</span>
              </Link>
            </div>
          ) : (
            <>
              <button 
                onClick={onLoginClick}
                className="text-gray-700 hover:text-accent-600 font-medium transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={onSignupClick}
                className="btn-primary"
              >
                Get Started Free
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <NavLink 
              to="/features" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-accent-600 font-medium' 
                  : 'text-gray-700 hover:text-accent-600 transition-colors'
              }
              onClick={closeMenu}
            >
              Features
            </NavLink>
            <NavLink 
              to="/pricing" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-accent-600 font-medium' 
                  : 'text-gray-700 hover:text-accent-600 transition-colors'
              }
              onClick={closeMenu}
            >
              Pricing
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-accent-600 font-medium' 
                  : 'text-gray-700 hover:text-accent-600 transition-colors'
              }
              onClick={closeMenu}
            >
              About
            </NavLink>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-accent-600 transition-colors"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-accent-600 transition-colors"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
              </>
            ) : (
              <div className="pt-4 flex flex-col space-y-3">
                <button 
                  onClick={() => {
                    onLoginClick();
                    closeMenu();
                  }}
                  className="text-center py-2 text-gray-700 hover:text-accent-600 font-medium transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={() => {
                    onSignupClick();
                    closeMenu();
                  }}
                  className="btn-primary w-full"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;