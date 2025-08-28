/**
 * Breadcrumb Navigation Component
 * Professional breadcrumb navigation for content pages
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = ({ customBreadcrumbs }) => {
  const location = useLocation();

  // Breadcrumb mapping for different routes
  const routeMapping = {
    '/': { label: 'Home', parent: null },
    '/practice': { label: 'SJT Practice', parent: '/' },
    '/statistics': { label: 'Statistics', parent: '/' },
    '/statistics/theory': { label: 'Statistics Theory', parent: '/statistics' },
    '/statistics/test': { label: 'Statistics Quiz', parent: '/statistics' },
    '/blog': { label: 'Expert Resources', parent: '/' },
    '/news': { label: 'Psychology News', parent: '/' },
    '/events': { label: 'Events', parent: '/' },
    '/volunteer': { label: 'Volunteer', parent: '/' },
    '/about': { label: 'About', parent: '/' },
    '/contact': { label: 'Contact', parent: '/' },
    '/profile': { label: 'Profile', parent: '/' },
    '/dashboard': { label: 'Dashboard', parent: '/' },
    '/privacy': { label: 'Privacy Policy', parent: '/' },
    '/login': { label: 'Sign In', parent: '/' },
    '/register': { label: 'Create Account', parent: '/' }
  };

  // Generate breadcrumbs automatically or use custom ones
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const breadcrumbs = [];
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    // Always start with home
    breadcrumbs.push({ label: 'Home', href: '/' });

    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Get route info from mapping or generate from segment
      const routeInfo = routeMapping[currentPath];
      const label = routeInfo?.label || segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Don't add duplicate home breadcrumb
      if (currentPath !== '/') {
        breadcrumbs.push({
          label,
          href: currentPath,
          isActive: index === pathSegments.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/' && !customBreadcrumbs) {
    return null;
  }

  return (
    <nav className="bg-neutral-50 border-b border-neutral-200" aria-label="Breadcrumb">
      <div className="container mx-auto py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <li key={breadcrumb.href || index} className="flex items-center">
                {index > 0 && (
                  <svg 
                    className="flex-shrink-0 h-4 w-4 text-neutral-400 mx-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                
                {isLast || !breadcrumb.href ? (
                  <span 
                    className={`font-medium ${
                      isLast 
                        ? 'text-primary-600' 
                        : 'text-neutral-500'
                    }`}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {breadcrumb.label}
                  </span>
                ) : (
                  <Link
                    to={breadcrumb.href}
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    {breadcrumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;