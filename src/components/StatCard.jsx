import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export const StatCard = ({ title, amount, type = 'neutral', icon: Icon }) => {
  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'danger': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${getColors()} flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium uppercase tracking-wider opacity-80">{title}</span>
        {Icon && <Icon size={18} />}
      </div>
      <div className="text-2xl font-bold text-white">
        S/ {amount.toFixed(2)}
      </div>
    </div>
  );
};