export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-4">
          Prediction Markets for
          <span className="text-emerald-400"> DeFi</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Vote on strategies, fund winners, earn rewards
        </p>

        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg">
            Explore
          </button>
          <button className="px-8 py-3 border border-white/20 hover:bg-white/5 rounded-lg">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}