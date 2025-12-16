import React from 'react';
import { X, User, MapPin, Calendar, Clock, TrendingDown, DollarSign, FileText } from 'lucide-react';

const DetalleCredito = ({ cliente, onClose }) => {
  if (!cliente) return null;

  // --- DATOS SIMULADOS DEL HISTORIAL (MOCK) ---
  // En el futuro, esto vendrá de Supabase basado en el cliente.id
  const historialPagos = [
    { id: 1, fecha: '12/12/2023', hora: '10:30 AM', valor: 50.00, saldoRestante: 1150.00, cobrador: 'Juan' },
    { id: 2, fecha: '13/12/2023', hora: '09:15 AM', valor: 50.00, saldoRestante: 1100.00, cobrador: 'Juan' },
    { id: 3, fecha: '14/12/2023', hora: '11:00 AM', valor: 50.00, saldoRestante: 1050.00, cobrador: 'Pedro (Suplente)' },
    { id: 4, fecha: '15/12/2023', hora: '04:45 PM', valor: 40.00, saldoRestante: 1010.00, cobrador: 'Juan' }, // Pago incompleto
  ];

  // Cálculos generales
  const totalPagado = historialPagos.reduce((acc, pago) => acc + pago.valor, 0);
  const porcentajePagado = (totalPagado / (cliente.debt + totalPagado)) * 100; // Estimado

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        
        {/* HEADER */}
        <div className="bg-slate-50 dark:bg-zinc-950 p-4 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-emerald-500" />
              Expediente de Crédito
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">ID Crédito: #CR-{cliente.id}009</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white dark:bg-zinc-800 rounded-full text-slate-500 hover:text-red-500 transition-colors border border-slate-200 dark:border-zinc-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className="overflow-y-auto p-4 space-y-6">

          {/* 1. DATOS DEL CLIENTE */}
          <section className="space-y-3">
            <div className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800">
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                {cliente.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{cliente.name}</h3>
                <div className="flex items-center gap-1 text-slate-500 dark:text-zinc-400 text-sm mt-1">
                  <MapPin size={14} />
                  <span className="truncate">{cliente.address}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-slate-200 dark:bg-zinc-700 px-2 py-0.5 rounded text-slate-600 dark:text-zinc-300">
                    DNI: 1234****
                  </span>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
                    Activo
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. RESUMEN FINANCIERO */}
          <section className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-center">
              <p className="text-xs text-slate-500 uppercase font-bold">Saldo Pendiente</p>
              <p className="text-2xl font-bold text-red-500">S/ {cliente.debt}</p>
            </div>
            <div className="p-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-center">
              <p className="text-xs text-slate-500 uppercase font-bold">Cuota Diaria</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">S/ {cliente.dailyQuota}</p>
            </div>
          </section>

          {/* 3. HISTORIAL (TABLA) */}
          <section>
            <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
              <Clock size={16} /> Historial de Pagos
            </h4>
            
            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase text-xs">
                  <tr>
                    <th className="p-3">Fecha/Hora</th>
                    <th className="p-3 text-right">Pago</th>
                    <th className="p-3 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {historialPagos.map((pago) => (
                    <tr key={pago.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-700 dark:text-zinc-200">{pago.fecha}</div>
                        <div className="text-xs text-slate-400">{pago.hora}</div>
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        + S/ {pago.valor.toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-slate-500 dark:text-zinc-400">
                        {pago.saldoRestante.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  
                  {/* FILA DE RESUMEN FINAL */}
                  <tr className="bg-slate-50 dark:bg-zinc-800/30 font-bold">
                    <td className="p-3 text-slate-500">TOTAL PAGADO</td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-500">S/ {totalPagado.toFixed(2)}</td>
                    <td className="p-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-center text-slate-400 mt-2">
              Mostrando últimos {historialPagos.length} movimientos
            </p>
          </section>

        </div>

        {/* FOOTER ACCIONES */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl active:scale-95 transition-all"
          >
            Cerrar Expediente
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetalleCredito;