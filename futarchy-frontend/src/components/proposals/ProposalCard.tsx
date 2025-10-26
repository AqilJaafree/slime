'use client';

import { Clock, TrendingUp } from 'lucide-react';

interface Proposal {
  id: number;
  name: string;
  apr: number;
  goal: string;
  funded: string;
  yesVotes: string;
  noVotes: string;
  deadline: number;
  status: string;
  creator: string;
  outcome?: string;
}

export default function ProposalCard({ proposal }: { proposal: Proposal }) {
  const daysLeft = Math.ceil((proposal.deadline - Date.now()) / (1000 * 60 * 60 * 24));
  const progress = (parseFloat(proposal.funded) / parseFloat(proposal.goal)) * 100;
  const totalVotes = parseFloat(proposal.yesVotes) + parseFloat(proposal.noVotes);
  const yesPercent = totalVotes > 0 ? (parseFloat(proposal.yesVotes) / totalVotes) * 100 : 0;

  const isActive = proposal.status === 'Active';
  const isResolved = proposal.status === 'Resolved';

  return (
    <div className={`
      group p-5 border rounded-xl transition-all cursor-pointer
      ${isActive 
        ? 'border-white/10 hover:border-emerald-500/50 bg-black/40' 
        : 'border-emerald-500/30 bg-emerald-500/5'
      }
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`
              px-2.5 py-0.5 rounded-full text-xs font-medium
              ${isActive 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-white/10 text-gray-400'
              }
            `}>
              {proposal.status}
            </span>
            {isResolved && proposal.outcome && (
              <span className="px-2.5 py-0.5 bg-emerald-500 text-black rounded-full text-xs font-semibold">
                ✓ {proposal.outcome}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-1.5">
            {proposal.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-500">Target:</span>
            <span className="text-emerald-400 font-semibold">{proposal.apr / 100}% APR</span>
          </div>
        </div>
      </div>

      {/* Funding Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-500">Funding</span>
          <span className="text-white font-medium">
            {proposal.funded} / {proposal.goal} PYUSD
          </span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Market Prediction */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-500">Market</span>
          <span className="text-white font-medium">
            {yesPercent.toFixed(0)}% YES
          </span>
        </div>
        <div className="flex w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${yesPercent}%` }}
          />
          <div 
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${100 - yesPercent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Ended'}</span>
          </div>
          <span className="text-gray-600">
            by {proposal.creator}
          </span>
        </div>
        
        {isActive && (
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium rounded-md transition-all text-xs border border-emerald-500/20 hover:border-emerald-500/40">
              YES
            </button>
            <button className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-md transition-all text-xs border border-red-500/20 hover:border-red-500/40">
              NO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}