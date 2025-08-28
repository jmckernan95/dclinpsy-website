/**
 * Professional Website Footer
 * Comprehensive site navigation, information, and legal links
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
  const { isLoggedIn } = useAuth();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Practice & Learn',
      links: [
        { name: 'SJT Practice Tests', href: '/sjt' },
        { name: 'Statistics Learning', href: '/statistics/theory' },
        { name: 'Statistics Quiz', href: '/statistics/test' },
        { name: 'Progress Dashboard', href: '/dashboard', requiresAuth: true }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Expert Articles', href: '/blog' },
        { name: 'Application Guides', href: '/blog/application-guide' },
        { name: 'Psychology News', href: '/news' },
        { name: 'Events', href: '/events' }
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Volunteer Opportunities', href: '/volunteer' },
        { name: 'Research Participation', href: '/research-prompt', requiresAuth: true },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Feedback', href: '/feedback' },
        { name: 'FAQ', href: '/faq' }
      ]
    },
    {
      title: 'Account',
      links: isLoggedIn ? [
        { name: 'Profile Settings', href: '/profile' },
        { name: 'Progress Analytics', href: '/dashboard' },
        { name: 'Privacy Settings', href: '/privacy' }
      ] : [
        { name: 'Create Account', href: '/register' },
        { name: 'Sign In', href: '/login' },
        { name: 'Why Create Account?', href: '/#benefits' }
      ]
    }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Data Protection', href: '/data-protection' }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/jmckernan95/dclinpsy-app',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/dclinpsy-prep-hub',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/dclinpsyprep',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main Footer Content */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">DC</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg">DClinPsy Prep Hub</div>
                <div className="text-neutral-400 text-sm">Professional Preparation Platform</div>
              </div>
            </Link>
            
            <p className="text-sm text-neutral-400 mb-6 max-w-sm">
              Complete preparation platform for UK Clinical Psychology Doctorate applications. 
              Practice, learn, and succeed with evidence-based resources.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-primary-400 transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links
                  .filter(link => !link.requiresAuth || (link.requiresAuth && isLoggedIn))
                  .map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-neutral-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-neutral-800">
        <div className="container mx-auto py-8">
          <div className="max-w-md">
            <h3 className="text-white font-semibold mb-2">Stay Updated</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Get notified about new practice questions, articles, and DClinPsy application updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-l-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-neutral-400 text-sm">
              © {currentYear} DClinPsy Prep Hub. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Version and Stats */}
          <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
            <div>
              Version 4.0 • Built with React & Tailwind CSS
            </div>
            <div className="mt-2 md:mt-0">
              <span className="inline-flex items-center space-x-4">
                <span>🎯 25+ SJT Scenarios</span>
                <span>📊 Interactive Statistics</span>
                <span>📚 Expert Resources</span>
                <span>🔒 GDPR Compliant</span>
              </span>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-4 pt-4 border-t border-neutral-800 text-xs text-neutral-500 text-center">
            <p>
              <strong>Educational Disclaimer:</strong> This practice platform supplements, but does not replace, 
              formal DClinPsy preparation programs. Always refer to official BPS and HCPC guidelines for 
              authoritative information on professional standards and application requirements.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;