import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, BrainCircuit, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar = ({ isScrolled }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAuthClick = (mode: 'login' | 'signup') => {
    navigate(`/auth?mode=${mode}`);
    closeMenu();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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
                className="text-gray-700 hover:text-accent-600 transition-colors font-medium"
              >
                Dashboard
              </Link>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={displayName} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {initials}
                      </span>
                    </div>
                  )}
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => handleAuthClick('login')}
                className="text-gray-700 hover:text-accent-600 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => handleAuthClick('signup')}
                className="bg-accent-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-700 transition-colors"
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
                  className="text-gray-700 hover:text-accent-600 transition-colors font-medium"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-accent-600 transition-colors"
                  onClick={closeMenu}
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={displayName} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-accent-600">
                        {initials}
                      </span>
                    </div>
                  )}
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-left text-error-600 hover:text-error-700 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-4 flex flex-col space-y-3">
                <button 
                  onClick={() => handleAuthClick('login')}
                  className="text-center py-2 text-gray-700 hover:text-accent-600 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleAuthClick('signup')}
                  className="bg-accent-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-accent-700 transition-colors w-full"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Overlay for profile dropdown */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;