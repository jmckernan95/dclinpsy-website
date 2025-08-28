/**
 * Professional Website Layout Wrapper
 * Provides consistent header, footer, and breadcrumb structure
 */

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';

const Layout = ({ 
  children, 
  showBreadcrumbs = true, 
  customBreadcrumbs = null,
  className = ''
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <Header />
      
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <Breadcrumb customBreadcrumbs={customBreadcrumbs} />
      )}
      
      {/* Main Content */}
      <main className={`flex-grow ${className}`}>
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;