"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Determine navigation destination based on company ID
  const getProfileDestination = () => {
    return user?.company ? '/settings' : '/job-marketplace';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      {/* Darker top bar */}
      <div className="bg-gray-950 h-1"></div>
      
      {/* Main navbar content */}
      <div className="bg-gray-950 text-white px-6 py-4 flex justify-between items-center">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo with "Link" text */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center">
              <span className="text-white text-sm font-semibold">Link</span>
            </div>
            <span className="text-xl font-bold text-white">Remortify</span>
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/teams" className="text-white hover:text-gray-300 transition-colors">Teams</Link>
            <Link href="/projects" className="text-white hover:text-gray-300 transition-colors">Projects</Link>
            <Link href="/chat" className="text-white hover:text-gray-300 transition-colors">Chat</Link>
            <Link href="/meetings" className="text-white hover:text-gray-300 transition-colors">Meetings</Link>
          </nav>
        </div>

        {/* Right side - Search and User Icons */}
        <div className="flex items-center space-x-4">
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-800 text-white placeholder-gray-300 rounded-l-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="bg-purple-600 w-10 h-10 rounded-r-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* User Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              // Show profile avatar when authenticated
              <Link href={getProfileDestination()} className="hover:opacity-80 transition-opacity">
                <Avatar 
                  src={user?.avatarUrl}
                  alt="Profile"
                  fallback={user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  size="sm"
                  className="hover:ring-2 hover:ring-blue-500 transition-all"
                />
              </Link>
            ) : (
              // Default: show Sign In / Sign Up links
              <>
                <Link href="/sign-in" className="px-4 py-2 text-sm rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 transition-colors">
                  Sign In
                </Link>
                <Link href="/sign-up" className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={toggleMenu}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center space-y-1"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden bg-gray-950 border-t border-gray-800 transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 py-4 space-y-4">
          {/* Mobile Navigation Links */}
          <nav className="space-y-3">
            <Link 
              href="/teams" 
              className="block text-white hover:text-gray-300 transition-colors py-2 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Teams
            </Link>
            <Link 
              href="/projects" 
              className="block text-white hover:text-gray-300 transition-colors py-2 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href="/chat" 
              className="block text-white hover:text-gray-300 transition-colors py-2 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat
            </Link>
            <Link 
              href="/meetings" 
              className="block text-white hover:text-gray-300 transition-colors py-2 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Meetings
            </Link>
          </nav>

          {/* Mobile Search Bar */}
          <div className="pt-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-gray-800 text-white placeholder-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="bg-purple-600 w-10 h-10 rounded-r-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile User Actions */}
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Placeholder icons kept for layout symmetry */}
              <div className="w-8 h-8 text-gray-300" />
              <div className="w-8 h-8 text-gray-300" />
            </div>
            {isAuthenticated ? (
              <Link href={getProfileDestination()} className="hover:opacity-80 transition-opacity" onClick={() => setIsMenuOpen(false)}>
                <Avatar 
                  src={user?.avatarUrl}
                  alt="Profile"
                  fallback={user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  size="sm"
                  className="hover:ring-2 hover:ring-blue-500 transition-all"
                />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/sign-in" className="px-3 py-2 text-sm rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/sign-up" className="px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
