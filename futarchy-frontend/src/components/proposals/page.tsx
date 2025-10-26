import Header from '@/src/components/layout/Header';

export default function ProposalsPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Active Proposals
        </h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <p className="text-gray-400">
            Proposals page coming soon...
          </p>
        </div>
      </div>
    </main>
  );
}