"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <span className="text-xl font-bold text-white">RemoteHub</span>
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

          {/* User Icons - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Camera Icon */}
            <button className="w-8 h-8 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            
            {/* Bell Icon with Notification */}
            <button className="w-8 h-8 text-gray-300 hover:text-white transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 9.5a6.5 6.5 0 0113 0v1.5a2.5 2.5 0 005 0V9.5a11.5 11.5 0 00-23 0v1.5a2.5 2.5 0 005 0V9.5z" />
              </svg>
              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                2
              </div>
            </button>
            
            {/* Document Icon */}
            <button className="w-8 h-8 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            
            {/* User Avatar */}
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              U
            </div>
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
              <button className="w-8 h-8 text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="w-8 h-8 text-gray-300 hover:text-white transition-colors relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 9.5a6.5 6.5 0 0113 0v1.5a2.5 2.5 0 005 0V9.5a11.5 11.5 0 00-23 0v1.5a2.5 2.5 0 005 0V9.5z" />
                </svg>
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  2
                </div>
              </button>
            </div>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
