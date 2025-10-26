'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-emerald-400 text-2xl font-bold">⚡</span>
              <span className="text-white text-xl font-bold">Futarchy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/proposals" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Proposals
            </Link>
            <Link 
              href="/create" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create
            </Link>
            <Link 
              href="/portfolio" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Portfolio
            </Link>
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-colors">
              Connect Wallet
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link 
              href="/proposals" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
            >
              Proposals
            </Link>
            <Link 
              href="/create" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
            >
              Create
            </Link>
            <Link 
              href="/portfolio" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
            >
              Portfolio
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
            >
              About
            </Link>
            <button className="w-full mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-colors">
              Connect Wallet
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}