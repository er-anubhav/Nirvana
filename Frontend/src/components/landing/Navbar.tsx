'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  isAuthenticated: boolean;
  user?: { name: string; avatarUrl?: string };
  onLogout?: () => void;
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  user,
  onLogout,
  title = 'Nirvana'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // const navigationItems = [
  //   // { name: 'Dashboard', href: '/dashboard' },
  //   // { name: 'Complaints', href: '/complaints' },
  //   // { name: 'Updates', href: '/updates' },
  //   // { name: 'Reports', href: '/reports' },
  //   // { name: 'Settings', href: '/settings' }
  // ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    onLogout?.();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  return (
    <nav className="top-0 z-50 w-full font-serif bg-transparent "
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl text-white focus:outline-none focus:ring-2 focus:ring-[#9b87f5] focus:ring-offset-2 focus:ring-offset-[#0a0613] rounded-md px-2 py-1"
              aria-label="Go to homepage"
            >
              <span>{title}</span>
            </Link>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            <ul className="flex space-x-1" role="menubar">
              {/* {navigationItems.map((item) => (
                <li key={item.name} role="none">
                  <Link
                    href={item.href}
                    role="menuitem"                    className={`px-4 py-2 rounded-md text-md text-white  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9b87f5] focus:ring-offset-2 focus:ring-offset-[#0a0613] ${
                      isActiveRoute(item.href)
                        ? 'text-[#9b87f5] bg-[#9b87f5]/10 border-b-2 border-[#9b87f5]'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    tabIndex={0}
                  >
                    {item.name}
                  </Link>
                </li>
              ))} */}
            </ul>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              /* Authenticated User Avatar & Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center p-1 space-x-2 rounded-full"
                  aria-expanded={isUserDropdownOpen}
                  aria-label="User menu"
                  aria-haspopup="true"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#7c3aed] flex items-center justify-center text-white text-sm  overflow-hidden">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={`${user.name}'s avatar`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      getUserInitials(user.name)
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm text-white">{user.name}</p>
                  </div>
                  <svg                    className={`w-4 h-4 text-white transition-transform duration-200 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute z-10 w-full py-1 mt-6 text-center transition-all duration-200 ease-out transform scale-100 bg-black border rounded-md shadow-lg opacity-100 border-black-400 dark:border-gray-700">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm transition-colors duration-150 dark:text-gray-300 focus:outline-none dark:focus:bg-gray-700"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm transition-colors duration-150 dark:text-gray-300 focus:outline-none dark:focus:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated - Login/Register Buttons */
              <div className="hidden sm:flex sm:items-center sm:space-x-3">                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-white border rounded-md border-white/20 "
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#9b87f5] focus:ring-offset-2 focus:ring-offset-[#0a0613] transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 bg-[#150d27] border-t border-[#9b87f5]/20">
          {/* {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}              className={`block px-3 py-2 rounded-md text-base  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#9b87f5] focus:ring-offset-2 focus:ring-offset-[#150d27] ${
                isActiveRoute(item.href)
                  ? 'text-[#9b87f5] bg-[#9b87f5]/10'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.name}
            </Link>
          ))} */}

          {/* Mobile Auth Buttons */}
          {!isAuthenticated && (            <div className="pt-4 border-t border-[#9b87f5]/20 space-y-2">
              <Link
                href="/login"
                className="block w-full px-3 py-2 text-center text-base  text-white/80 border border-white/20 rounded-md hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9b87f5] focus:ring-offset-2 focus:ring-offset-[#150d27] transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block w-full px-3 py-2 text-center text-base  bg-[#9b87f5] rounded-md hover:bg-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#9b87f5] focus:ring-offset-2 focus:ring-offset-[#150d27] transition-colors duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
