'use client';

import ProposalCard from './ProposalCard';

// Mock data - removed Meteora
const PROPOSALS = [
  {
    id: 1,
    name: 'HBARX Liquid Staking - 6.5% APR',
    apr: 650,
    goal: '100',
    funded: '75.5',
    yesVotes: '45.2',
    noVotes: '12.8',
    deadline: Date.now() + 5 * 24 * 60 * 60 * 1000,
    status: 'Active',
    creator: '0xd649...9494',
  },
  {
    id: 2,
    name: 'SaucerSwap PYUSD/HBAR LP - 12% APR',
    apr: 1200,
    goal: '200',
    funded: '189.3',
    yesVotes: '98.5',
    noVotes: '34.2',
    deadline: Date.now() + 3 * 24 * 60 * 60 * 1000,
    status: 'Active',
    creator: '0xabc1...5678',
  },
  {
    id: 3,
    name: 'Hedera Lending Protocol - 8% APR',
    apr: 800,
    goal: '150',
    funded: '45.8',
    yesVotes: '23.1',
    noVotes: '8.9',
    deadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
    status: 'Active',
    creator: '0xdef2...9abc',
  },
  {
    id: 4,
    name: 'Pangolin PYUSD Pool - 15% APR',
    apr: 1500,
    goal: '100',
    funded: '100',
    yesVotes: '67.3',
    noVotes: '15.2',
    deadline: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: 'Resolved',
    creator: '0x1234...abcd',
    outcome: 'Yes',
  },
];

export default function ProposalsList() {
  return (
    <section className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-white/10 rounded-full text-xs text-gray-400">
              <span className="font-mono">01</span>
              <span>About</span>
              <span className="text-emerald-500">⚡ Futarchy</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Active Proposals
            </h2>
            <p className="text-gray-400 text-sm">
              Vote on strategy outcomes and fund winning predictions
            </p>
          </div>
          
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-all hover:scale-105 flex items-center gap-2 text-sm">
            <span className="text-base">+</span>
            Create Proposal
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button className="px-4 py-1.5 bg-emerald-500 text-black font-medium rounded-lg text-xs">
            All ({PROPOSALS.length})
          </button>
          <button className="px-4 py-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg text-xs transition-all">
            Active (3)
          </button>
          <button className="px-4 py-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg text-xs transition-all">
            Resolved (1)
          </button>
          <button className="px-4 py-1.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg text-xs transition-all">
            My Positions (0)
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
            <div className="text-xs text-gray-400 mb-1">Total Volume</div>
            <div className="text-xl font-bold text-white">410.6 PYUSD</div>
            <div className="text-emerald-500 text-xs mt-1">+12.5%</div>
          </div>

          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
            <div className="text-xs text-gray-400 mb-1">Active Markets</div>
            <div className="text-xl font-bold text-white">3</div>
            <div className="text-gray-400 text-xs mt-1">Markets open</div>
          </div>

          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
            <div className="text-xs text-gray-400 mb-1">Total Predictors</div>
            <div className="text-xl font-bold text-white">247</div>
            <div className="text-emerald-500 text-xs mt-1">+18 today</div>
          </div>

          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
            <div className="text-xs text-gray-400 mb-1">Success Rate</div>
            <div className="text-xl font-bold text-white">68%</div>
            <div className="text-gray-400 text-xs mt-1">Strategies succeed</div>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PROPOSALS.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <button className="px-6 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 rounded-lg transition-all text-sm">
            Load More Proposals
          </button>
        </div>
      </div>
    </section>
  );
}