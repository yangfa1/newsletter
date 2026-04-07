import SubscribeForm from '@/components/SubscribeForm'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-white py-20 px-4 border-b border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 text-sm font-medium text-brand-700 mb-6">
              <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></span>
              Your Path to Financial Freedom
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 leading-tight tracking-tight">
              Build Your<br />
              <span className="font-semibold text-brand-700">Financial Freedom</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
              Expert insights on markets, smart investing, tax strategies, and retirement planning —
              everything you need to build lasting financial security for you and your family.
            </p>
            <SubscribeForm />
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light text-center text-gray-900 mb-2 tracking-tight">What You'll Receive</h2>
            <p className="text-center text-gray-400 text-sm mb-10">Practical knowledge to grow and protect your wealth</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-shadow">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-base font-semibold text-brand-800 mb-2">Weekly Financial Report</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Comprehensive analysis of Canadian and global markets, economic indicators,
                  and sector performance — every Monday.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-shadow">
                <div className="text-3xl mb-3">🔮</div>
                <h3 className="text-base font-semibold text-brand-800 mb-2">Market Forecast</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Data-driven predictions for the week ahead — sectors to watch,
                  opportunities, and risk factors — every Friday.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-shadow">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-base font-semibold text-brand-800 mb-2">Financial Planning</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Monthly tax optimization tips, RRSP/TFSA strategies, retirement planning,
                  and investment insights for Canadian families.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-10 px-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-400 text-sm">
              Trusted by Canadian families building financial freedom · No spam, ever · Unsubscribe anytime in one click
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
