import React from 'react';

interface PriceCardProps {
  title: string;
  price: string;
  icon: React.ReactNode;
  colorClass: string;
  loading?: boolean;
}

export const PriceCard: React.FC<PriceCardProps> = ({ title, price, icon, colorClass, loading }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-800 p-6 shadow-lg border border-slate-700 transition-all hover:scale-105 hover:shadow-xl hover:border-slate-600`}>
      <div className={`absolute top-0 left-0 w-2 h-full ${colorClass}`}></div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 font-medium text-sm md:text-base">{title}</h3>
        <div className={`p-2 rounded-full bg-slate-700/50 ${colorClass.replace('bg-', 'text-')}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        {loading ? (
          <div className="h-10 w-32 bg-slate-700 animate-pulse rounded"></div>
        ) : (
          <div className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
            {price}
          </div>
        )}
      </div>
    </div>
  );
};
