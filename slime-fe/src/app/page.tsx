import Header from '@/src/app/components/Header';
import Hero from '@/src/app/components/Hero';
import BuyShares from '@/src/app/components/BuyShares';

import ProposalsList from '@/src/app/components/ProposalsList';
import CreateProposal from '@/src/app/components/CreateProposal';
import FundStrategy from '@/src/app/components/FundStrategy';
import ClaimWinnings from '@/src/app/components/ClaimWinnings';
import MyPositions from '@/src/app/components/MyPositions';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Hero />
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreateProposal />
          <BuyShares />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FundStrategy />
          <ClaimWinnings />
        </div>

        <MyPositions />

        <ProposalsList />
      </div>
    </main>
  );
}