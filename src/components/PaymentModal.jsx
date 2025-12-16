import React, { useState, useEffect, useRef } from 'react';
import { X, DollarSign, Send, CheckCircle, ArrowRight, Lock, Edit3 } from 'lucide-react';

// Recibimos 'initialMode'
const PaymentModal = ({ client, onClose, initialMode = 'normal' }) => {
  if (!client) return null;

  const nombre = client.name || "Cliente";
  const cuotaSugerida = Number(client.dailyQuota || client.cuota || 0);
  const saldoActual = Number(client.debt || 0);

  const [amount, setAmount] = useState(cuotaSugerida);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [sistemaAbierto, setSistemaAbierto] = useState(true);
  
  // Si initialMode es 'edit', arrancamos editando
  const [isEditable, setIsEditable] = useState(initialMode === 'edit');
  const inputRef = useRef(null);

  useEffect(() => {
    verificarHorario();
    const interval = setInterval(verificarHorario, 60000);
    
    // Si abrimos en modo edición, enfocar el input
    if (initialMode === 'edit' && inputRef.current) {
        setTimeout(() => inputRef.current.focus(), 100);
    }

    return () => clearInterval(interval);
  }, [initialMode]);

  const verificarHorario = () => {
    const ahora = new Date();
    const hora = ahora.getHours(); 
    const abierto = hora >= 5 && hora < 19; 
    setSistemaAbierto(abierto);
  };

  const handleActivarEdicion = () => {
    if (!sistemaAbierto) return alert("⛔ SISTEMA CERRADO");
    setIsEditable(true);
    setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 100);
  };

  const handleCobrar = () => {
    if (!sistemaAbierto) return alert("⛔ SISTEMA CERRADO");
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  const handleEnviarComprobante = () => {
    const montoPagado = Number(amount);
    const nuevoSaldo = saldoActual - montoPagado;
    const fecha = new Date().toLocaleDateString();
    const mensaje = `🧾 *COMPROBANTE PAGO*\n📅 ${fecha}\n👤 ${nombre}\n💰 *PAGO:* S/ ${montoPagado.toFixed(2)}\n📉 *SALDO:* S/ ${nuevoSaldo.toFixed(2)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 border border-zinc-800 animate-slide-up transition-all relative">
        
        {!sistemaAbierto && <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600 z-10 animate-pulse" />}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {paymentSuccess ? '¡Pago Registrado!' : 'Registrar Pago'}
              {!sistemaAbierto && <Lock size={16} className="text-red-500" />}
            </h2>
            <p className="text-sm text-zinc-400">Cliente: {nombre}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:bg-zinc-700">
            <X size={20} />
          </button>
        </div>

        {!paymentSuccess ? (
          <div className="animate-fade-in">
            <div className="mb-6 text-center">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">
                {isEditable ? 'Escribe el nuevo monto' : 'Monto a cobrar'}
              </label>
              
              <div className="relative inline-block w-full">
                <DollarSign className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isEditable ? 'text-emerald-500' : 'text-zinc-600'}`} size={28} />
                <input 
                  ref={inputRef}
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={!isEditable} 
                  className={`w-full border rounded-2xl py-5 pl-14 pr-4 text-5xl font-bold text-center outline-none transition-all
                    ${!sistemaAbierto ? 'bg-black border-red-900 text-zinc-600' : 
                      isEditable ? 'bg-black border-emerald-500 text-white ring-2 ring-emerald-500/30' : 
                      'bg-zinc-950 border-zinc-800 text-zinc-300'
                    }
                  `}
                />
              </div>

              <div className="mt-4 flex justify-center gap-3 text-xs">
                <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 px-3 py-1.5 rounded-lg font-bold">Cuota: S/ {cuotaSugerida.toFixed(2)}</span>
                <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 px-3 py-1.5 rounded-lg font-bold">Saldo: S/ {saldoActual.toFixed(2)}</span>
              </div>
            </div>

            <button 
                onClick={handleCobrar}
                disabled={isProcessing || !amount || !sistemaAbierto}
                className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all text-lg mb-3
                  ${!sistemaAbierto ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'}
                `}
            >
                {isProcessing ? 'Procesando...' : !sistemaAbierto ? 'BLOQUEADO' : <><CheckCircle size={24} /> CONFIRMAR COBRO</>}
            </button>

            {/* BOTÓN DE RESPALDO PARA MODIFICAR (Solo visible si no está editando) */}
            {!isEditable && sistemaAbierto && (
              <button 
                onClick={handleActivarEdicion}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-zinc-700"
              >
                <Edit3 size={18} />
                MODIFICAR MANUALMENTE
              </button>
            )}
            
            {isEditable && (
              <button onClick={() => { setIsEditable(false); setAmount(cuotaSugerida); }} className="w-full py-3 text-zinc-500 hover:text-white text-sm">Cancelar edición</button>
            )}
          </div>
        ) : (
          /* FASE ÉXITO */
          <div className="text-center animate-scale-in py-2">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-emerald-500/20">
              <CheckCircle size={40} strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">S/ {Number(amount).toFixed(2)}</h3>
            <div className="space-y-3">
              <button onClick={handleEnviarComprobante} className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95"><Send size={20} /> ENVIAR RECIBO</button>
              <button onClick={onClose} className="w-full py-3.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl flex items-center justify-center gap-2">TERMINAR <ArrowRight size={18} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;