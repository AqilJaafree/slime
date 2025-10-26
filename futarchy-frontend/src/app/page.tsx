import Header from '@/src/components/layout/Header';
import ProposalsList from '@/src/components/proposals/ProposalsList';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
   

      {/* Proposals Section */}
      <ProposalsList />
    </main>
  );
}