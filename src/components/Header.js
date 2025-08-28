/**
 * Professional Website Header Navigation
 * Persistent navigation header with dropdown menus and user authentication
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for mobile menu and dropdowns
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Refs for dropdown management
  const dropdownRefs = useRef({});
  const mobileMenuRef = useRef(null);

  // Navigation structure
  const navigation = [
    {
      name: 'Practice',
      dropdown: true,
      items: [
        { name: 'SJT Practice Test', href: '/practice', description: 'Clinical scenario practice tests' },
        { name: 'Statistics Quiz', href: '/statistics/test', description: 'Interactive statistics testing' }
      ]
    },
    {
      name: 'Learn',
      dropdown: true,
      items: [
        { name: 'Statistics Theory', href: '/statistics/theory', description: 'Comprehensive statistics learning' },
        { name: 'Expert Resources', href: '/blog', description: 'Articles and guides' }
      ]
    },
    {
      name: 'Resources',
      dropdown: true,
      items: [
        { name: 'Application Guides', href: '/blog?category=applications', description: 'DClinPsy application advice' },
        { name: 'Psychology News', href: '/news', description: 'Latest industry updates' },
        { name: 'Events', href: '/events', description: 'Psychology events near you' }
      ]
    },
    {
      name: 'About',
      href: '/about',
      dropdown: false
    }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown
      const clickedOutsideDropdowns = Object.values(dropdownRefs.current).every(ref => 
        ref && !ref.contains(event.target)
      );
      
      // Check if click is outside mobile menu
      const clickedOutsideMobileMenu = mobileMenuRef.current && !mobileMenuRef.current.contains(event.target);
      
      if (clickedOutsideDropdowns) {
        setActiveDropdown(null);
      }
      
      if (clickedOutsideMobileMenu) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Handle dropdown toggle
  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if current path matches nav item
  const isActivePath = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-xl font-bold text-primary-600 hover:text-primary-700 transition"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DC</span>
              </div>
              <span className="hidden sm:block">DClinPsy Prep Hub</span>
              <span className="sm:hidden">DClinPsy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                ref={el => dropdownRefs.current[item.name] = el}
              >
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.name)}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition ${
                        activeDropdown === item.name || item.items?.some(subItem => isActivePath(subItem.href))
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                      }`}
                    >
                      {item.name}
                      <svg 
                        className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 py-2">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`block px-4 py-3 hover:bg-neutral-50 transition ${
                              isActivePath(subItem.href) ? 'bg-primary-50 text-primary-600' : 'text-neutral-700'
                            }`}
                          >
                            <div className="font-medium text-sm">{subItem.name}</div>
                            <div className="text-xs text-neutral-500 mt-1">{subItem.description}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      isActivePath(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="relative" ref={el => dropdownRefs.current['user'] = el}>
                <button
                  onClick={() => handleDropdownToggle('user')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 rounded-lg hover:bg-neutral-50 transition"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:block">{user?.username}</span>
                  <svg className={`h-4 w-4 transition-transform ${activeDropdown === 'user' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User Dropdown */}
                {activeDropdown === 'user' && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition">
                      Profile Settings
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition">
                      Progress Dashboard
                    </Link>
                    <hr className="my-2 border-neutral-200" />
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 rounded-lg hover:bg-neutral-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 transition"
            >
              <svg 
                className={`h-6 w-6 transition-transform ${isMobileMenuOpen ? 'rotate-45' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200" ref={mobileMenuRef}>
          <div className="container mx-auto py-4">
            {/* Mobile Navigation Items */}
            <div className="space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => handleDropdownToggle(`mobile-${item.name}`)}
                        className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition"
                      >
                        {item.name}
                        <svg 
                          className={`h-5 w-5 transition-transform ${activeDropdown === `mobile-${item.name}` ? 'rotate-180' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Mobile Dropdown Items */}
                      {activeDropdown === `mobile-${item.name}` && (
                        <div className="ml-4 space-y-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`block px-3 py-2 text-sm rounded-lg transition ${
                                isActivePath(subItem.href) 
                                  ? 'text-primary-600 bg-primary-50' 
                                  : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block px-3 py-2 text-base font-medium rounded-lg transition ${
                        isActivePath(item.href)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile User Actions */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm font-medium text-neutral-600">
                    Signed in as {user?.username}
                  </div>
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition"
                  >
                    Profile Settings
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition"
                  >
                    Progress Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center btn btn-primary"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;