import React, { useState, useEffect } from 'react';
import { X, DollarSign, Send, Zap, MessageCircle } from 'lucide-react';

const PaymentModal = ({ client, onClose, onPaymentConfirmed }) => {
  // Estado para simular el monto a pagar y el pago real
  const [paymentAmount, setPaymentAmount] = useState(client ? client.cuota : 0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Si el cliente cambia, actualiza el monto por defecto
    if (client) {
      setPaymentAmount(client.cuota);
      setSuccess(false);
    }
  }, [client]);

  if (!client) return null;

  const handleConfirmPayment = () => {
    setIsConfirming(true);
    // SIMULACIÓN DE PROCESO DE PAGO
    setTimeout(() => {
      setIsConfirming(false);
      setSuccess(true);
      // Llama a la función que actualiza la lista de ruta
      onPaymentConfirmed(client.id); 
    }, 1000); 
  };

  const handleWhatsApp = () => {
    const message = `Hola ${client.name}, acabo de registrar tu pago por $${paymentAmount.toFixed(2)}. Tu saldo actual pendiente es de $XXX. ¡Gracias por tu puntualidad!`;
    const whatsappUrl = `https://wa.me/51999999999?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp en una nueva pestaña (simulación de número)
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-end sm:items-center justify-center">
      
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl transform transition-all duration-300">
        
        {/* Encabezado y Botón de Cierre */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <DollarSign size={20} className="mr-2 text-green-600" /> 
            Registrar Cobro
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Detalles del Cliente */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Cliente:</p>
          <p className="font-extrabold text-lg text-blue-800">{client.name}</p>
          <p className="text-sm text-gray-500">Cuota del día: <span className="font-bold text-base text-green-700">$ {client.cuota.toFixed(2)}</span></p>
        </div>
        
        {/* Cuerpo del Pago */}
        {!success ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto Pagado ({client.currency || 'PEN'})</label>
              <div className="relative">
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full text-center text-3xl font-bold p-4 border-2 border-green-500 rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors"
                />
                <button 
                    onClick={() => setPaymentAmount(client.cuota)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm bg-gray-100 p-2 rounded-lg text-gray-600 font-semibold"
                >
                    Cuota Fija
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center"><Zap size={14} className="mr-1 text-yellow-600" /> Cambia el monto si el cliente paga extra o menos.</p>
            </div>
          
            {/* Botón de Confirmación */}
            <button
              onClick={handleConfirmPayment}
              disabled={isConfirming || paymentAmount <= 0}
              className={`w-full py-4 rounded-xl text-white font-extrabold text-lg transition-colors shadow-lg
                ${paymentAmount > 0 ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30' : 'bg-gray-400 cursor-not-allowed'}
              `}
            >
              {isConfirming ? 'Procesando...' : 'CONFIRMAR PAGO'}
            </button>
          </>
        ) : (
          /* Vista de Éxito (Recibo) */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">¡Pago Registrado!</h3>
            <p className="text-gray-500 mb-6">Se cobraron $ {paymentAmount.toFixed(2)}</p>
            
            <button
                onClick={handleWhatsApp}
                className="w-full py-3 rounded-xl text-white font-bold text-lg transition-colors bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/30"
            >
                <MessageCircle size={20} className="mr-2" />
                Enviar Recibo por WhatsApp
            </button>
            <button
                onClick={onClose}
                className="w-full py-3 mt-3 rounded-xl text-gray-600 font-bold text-lg hover:bg-gray-100 transition-colors"
            >
                Volver a la Ruta
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default PaymentModal;