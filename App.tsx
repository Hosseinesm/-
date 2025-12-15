import React, { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, Coins, DollarSign, Euro, Droplets, TrendingUp, 
  ExternalLink, AlertCircle, ShoppingBasket, Wheat, Utensils, 
  Coffee, Egg, Bird 
} from 'lucide-react';
import { fetchLivePrices } from './services/geminiService';
import { DashboardData, FetchStatus } from './types';
import { PriceCard } from './components/PriceCard';

type Tab = 'market' | 'essentials';

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('market');

  const fetchData = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const result = await fetchLivePrices();
      setData(result);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError('خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6">
          <div className="text-center md:text-right">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-amber-500 mb-2">
              تابلو قیمت لحظه‌ای
            </h1>
            <p className="text-slate-400 text-sm">
              بروزرسانی زنده قیمت طلا، ارز و کالاهای اساسی
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={status === 'loading'}
            className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-95"
          >
            <RefreshCw className={`w-5 h-5 ${status === 'loading' ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span>{status === 'loading' ? 'در حال دریافت...' : 'بروزرسانی قیمت‌ها'}</span>
          </button>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center md:justify-start gap-2 bg-slate-800/50 p-1.5 rounded-xl w-fit mx-auto md:mx-0">
          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'market' 
                ? 'bg-slate-700 text-amber-400 shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            بازار مالی
          </button>
          <button
            onClick={() => setActiveTab('essentials')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'essentials' 
                ? 'bg-slate-700 text-emerald-400 shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShoppingBasket className="w-4 h-4" />
            کالاهای اساسی
          </button>
        </div>

        {/* Prices Grid - Market */}
        {activeTab === 'market' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in duration-300">
            <PriceCard
              title="طلا ۱۸ عیار (گرم)"
              price={data?.market.gold18k || "---"}
              icon={<Coins className="w-6 h-6" />}
              colorClass="bg-amber-500"
              loading={status === 'loading'}
            />
            <PriceCard
              title="دلار آمریکا (آزاد)"
              price={data?.market.usd || "---"}
              icon={<DollarSign className="w-6 h-6" />}
              colorClass="bg-emerald-500"
              loading={status === 'loading'}
            />
            <PriceCard
              title="یورو اروپا"
              price={data?.market.eur || "---"}
              icon={<Euro className="w-6 h-6" />}
              colorClass="bg-blue-500"
              loading={status === 'loading'}
            />
            <PriceCard
              title="انس جهانی طلا"
              price={data?.market.ounce || "---"}
              icon={<TrendingUp className="w-6 h-6" />}
              colorClass="bg-yellow-600"
              loading={status === 'loading'}
            />
            <PriceCard
              title="نفت ایران"
              price={data?.market.oil || "---"}
              icon={<Droplets className="w-6 h-6" />}
              colorClass="bg-rose-500"
              loading={status === 'loading'}
            />
          </div>
        )}

        {/* Prices Grid - Essentials */}
        {activeTab === 'essentials' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in duration-300">
            <PriceCard
              title="برنج ایرانی (کیلو)"
              price={data?.essentials.rice || "---"}
              icon={<Wheat className="w-6 h-6" />}
              colorClass="bg-amber-200"
              loading={status === 'loading'}
            />
            <PriceCard
              title="مرغ (کیلو)"
              price={data?.essentials.chicken || "---"}
              icon={<Bird className="w-6 h-6" />}
              colorClass="bg-orange-400"
              loading={status === 'loading'}
            />
            <PriceCard
              title="گوشت قرمز (کیلو)"
              price={data?.essentials.meat || "---"}
              icon={<Utensils className="w-6 h-6" />}
              colorClass="bg-red-500"
              loading={status === 'loading'}
            />
            <PriceCard
              title="شکر (کیلو)"
              price={data?.essentials.sugar || "---"}
              icon={<Coffee className="w-6 h-6" />}
              colorClass="bg-white"
              loading={status === 'loading'}
            />
            <PriceCard
              title="تخم مرغ (شانه)"
              price={data?.essentials.eggs || "---"}
              icon={<Egg className="w-6 h-6" />}
              colorClass="bg-yellow-200"
              loading={status === 'loading'}
            />
          </div>
        )}

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
           {/* Last Updated */}
           <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 flex flex-col justify-center">
              <span className="text-slate-400 text-sm mb-1">آخرین زمان بروزرسانی</span>
              <div className="text-xl font-mono text-slate-200">
                {status === 'loading' ? '...' : (data?.lastUpdated || '---')}
              </div>
           </div>

           {/* Sources */}
           <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                منابع جستجو شده
              </h4>
              {status === 'loading' ? (
                 <div className="space-y-2">
                   <div className="h-4 w-3/4 bg-slate-700/50 rounded animate-pulse"></div>
                   <div className="h-4 w-1/2 bg-slate-700/50 rounded animate-pulse"></div>
                 </div>
              ) : (
                <ul className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {data?.sources && data.sources.length > 0 ? (
                    data.sources.map((source, idx) => (
                      <li key={idx}>
                        <a 
                          href={source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline break-all block truncate"
                        >
                          {source}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-500">منبعی یافت نشد یا هنوز دریافت نشده است.</li>
                  )}
                </ul>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;
