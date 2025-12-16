import React from 'react';
import { MapPin, DollarSign, AlertCircle, CheckCircle, FileText, TrendingUp, Hash, Edit3 } from 'lucide-react';

const ClientCard = ({ client, onPay, onViewDetails, onEdit }) => {
  
  // --- SEGURIDAD DE DATOS ---
  const safeNum = (val) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  if (!client) return null;

  const nombre = client.name || "Cliente";
  const direccion = client.address || "Sin dirección";
  const estado = client.status ? client.status.toLowerCase() : 'pending';
  
  const cuotaDiaria = safeNum(client.dailyQuota || client.cuota);
  const saldoPendiente = safeNum(client.debt);
  const cuotasPagadas = safeNum(client.paidInstallments);
  const cuotasTotales = safeNum(client.totalInstallments) || 1;
  const cuotasRestantes = cuotasTotales - cuotasPagadas;
  const progreso = Math.min(100, Math.round((cuotasPagadas / cuotasTotales) * 100));

  // --- CONFIGURACIÓN DE COLORES ---
  const getStatusConfig = (s) => {
    switch (s) {
      case 'mora': case 'late':
        return { border: 'border-l-red-500', bgIcon: 'bg-red-100 text-red-600', badge: 'bg-red-100 text-red-700', label: 'MORA', icon: <AlertCircle size={14} /> };
      case 'vencido':
        return { border: 'border-l-yellow-500', bgIcon: 'bg-yellow-100 text-yellow-600', badge: 'bg-yellow-100 text-yellow-700', label: 'VENCIDO', icon: <AlertCircle size={14} /> };
      case 'pagado': case 'paid':
        return { border: 'border-l-slate-400', bgIcon: 'bg-slate-100 text-slate-500', badge: 'bg-slate-100 text-slate-600', label: 'PAGADO', icon: <CheckCircle size={14} /> };
      default:
        return { border: 'border-l-emerald-500', bgIcon: 'bg-emerald-100 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', label: 'AL DÍA', icon: <TrendingUp size={14} /> };
    }
  };

  const config = getStatusConfig(estado);
  const isPaid = estado === 'pagado' || estado === 'paid';

  return (
    <div className={`relative bg-white dark:bg-zinc-900 rounded-xl shadow-sm mb-4 overflow-hidden border-l-[6px] ${config.border} border border-slate-200 dark:border-zinc-800`}>
      
      {/* CABECERA */}
      <div className="p-4 flex gap-3 items-start">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${config.bgIcon}`}>
          {nombre.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className={`font-bold text-base truncate ${isPaid ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>{nombre}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${config.badge}`}>
              {config.icon} {config.label}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
            <MapPin size={12} /> <span className="truncate">{direccion}</span>
          </div>
        </div>
      </div>

      {/* DATOS */}
      <div className="px-4 pb-3">
        <div className="bg-slate-50 dark:bg-zinc-950 rounded-lg p-3 border border-slate-100 dark:border-zinc-800 grid grid-cols-3 gap-2 text-center relative overflow-hidden">
          <div className="absolute bottom-0 left-0 h-1 bg-slate-200 w-full">
             <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progreso}%` }}></div>
          </div>
          <div className="flex flex-col items-center border-r border-slate-200 dark:border-zinc-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Saldo</span>
            <span className="text-sm font-bold text-slate-800 dark:text-white">{saldoPendiente > 0 ? `S/ ${saldoPendiente}` : 'S/ 0'}</span>
          </div>
          <div className="flex flex-col items-center border-r border-slate-200 dark:border-zinc-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Progreso</span>
            <div className="flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400"><Hash size={12} /> {cuotasPagadas}/{cuotasTotales}</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Faltan</span>
            <span className="text-sm font-bold text-slate-600 dark:text-zinc-400">{cuotasRestantes}</span>
          </div>
        </div>
      </div>

      {/* --- AQUÍ ESTÁN LOS 3 BOTONES --- */}
      {!isPaid ? (
        <div className="grid grid-cols-3 border-t border-slate-100 dark:border-zinc-800 divide-x divide-slate-100 dark:divide-zinc-800">
          
          {/* 1. DETALLES (Gris) */}
          <button 
            onClick={(e) => { e.stopPropagation(); onViewDetails && onViewDetails(client); }}
            className="py-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-bold text-[10px] flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <FileText size={16} />
            DETALLES
          </button>

          {/* 2. MODIFICAR (Amarillo - EN MEDIO) */}
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(client); }}
            className="py-3 bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-500 font-bold text-[10px] flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <Edit3 size={16} />
            MODIFICAR
          </button>

          {/* 3. COBRAR (Verde) */}
          <button 
            onClick={(e) => { e.stopPropagation(); onPay && onPay(client); }}
            className="py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-[10px] flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <DollarSign size={16} strokeWidth={3} />
            COBRAR
          </button>
        </div>
      ) : (
        // Estado Completado
        <div className="py-3 bg-slate-50 dark:bg-zinc-900 text-slate-400 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-center gap-2 font-bold text-xs">
          <CheckCircle size={16} /> COBRO COMPLETADO
        </div>
      )}

    </div>
  );
};

export default ClientCard;