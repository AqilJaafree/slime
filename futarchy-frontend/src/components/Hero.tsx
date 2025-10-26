'use client';

import { TrendingUp, Users, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-black"></div>
      
      {/* Animated orb effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Stats Row */}
        <div className="flex flex-wrap justify-between items-center mb-16 text-sm">
          <div className="mb-4 sm:mb-0">
            <div className="text-3xl font-bold text-white">93m+</div>
            <div className="text-gray-400">Total Locked</div>
          </div>
          <div className="mb-4 sm:mb-0">
            <div className="text-3xl font-bold text-white">3.2b</div>
            <div className="text-gray-400">Market Size</div>
          </div>
          <div className="mb-4 sm:mb-0">
            <div className="text-3xl font-bold text-white">1k+</div>
            <div className="text-gray-400">Awards</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">221k</div>
            <div className="text-gray-400">Transactions</div>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="text-sm text-gray-400 mb-4">
            AI-powered system suggests personalized content based on user preferences
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Next level of{' '}
            <span className="text-emerald-400">⚡ crypto</span> and
            <br />
            <span className="text-emerald-400"># fintech</span> product
          </h1>

          {/* CTA Button */}
          <div className="flex justify-center mt-12">
            <button className="group relative px-8 py-4 bg-transparent border-2 border-emerald-500 rounded-full hover:bg-emerald-500 transition-all duration-300">
              <span className="flex items-center space-x-2 text-white font-semibold">
                <span>Get Started</span>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {/* Card 1 */}
          <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:bg-emerald-500/20 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <svg 
                className="w-5 h-5 text-emerald-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Prediction Markets</h3>
            <p className="text-gray-400 text-sm">
              Bet on strategy outcomes and earn rewards for correct predictions
            </p>
          </div>

          {/* Card 2 - Highlighted */}
          <div className="bg-emerald-500 rounded-2xl p-6 hover:bg-emerald-600 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black/50 rounded-full"></div>
                <div className="w-2 h-2 bg-black/30 rounded-full"></div>
              </div>
              <svg 
                className="w-5 h-5 text-black transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <p className="text-black font-semibold text-sm">
              The logo of the largest bubble company has become our flag in the fight against fees!
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:bg-gray-900 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <svg 
                className="w-5 h-5 text-emerald-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">AI Execution</h3>
            <p className="text-gray-400 text-sm">
              Vincent agents automatically execute winning strategies
            </p>
          </div>
        </div>

        {/* About Section Preview */}
        <div className="mt-32 max-w-4xl">
          <div className="inline-block mb-6">
            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <span className="text-sm text-gray-400">01</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white">About</span>
                <span className="text-emerald-400 text-sm">⚡ Futarchy</span>
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Our team <span className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-lg text-black">+</span> has been creating{' '}
            <span className="text-emerald-400">⚡</span> a unique and powerful crypto and fintech product for{' '}
            <span className="bg-emerald-500 text-black px-3 py-1 rounded-lg">⚡ Futarchy</span> 5 years.
          </h2>
        </div>
      </div>
    </div>
  );
}