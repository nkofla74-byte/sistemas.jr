import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin } from 'lucide-react';
import ClientCard from '../components/ClientCard';
import PaymentModal from '../components/PaymentModal';
import DetalleCredito from '../components/DetalleCredito';

const Ruta = () => {
  const navigate = useNavigate();
  const [selectedClientForPayment, setSelectedClientForPayment] = useState(null);
  const [selectedClientForDetail, setSelectedClientForDetail] = useState(null);
  const [modalMode, setModalMode] = useState('normal'); 
  const [busqueda, setBusqueda] = useState('');
  
  // ESTADO DE CLIENTES (Ahora inicia vacío y se llena del localStorage)
  const [clients, setClients] = useState([]);

  // --- CARGAR RUTA PLANIFICADA ---
  useEffect(() => {
    const cargarRuta = () => {
      // Intentamos leer la ruta guardada
      const rutaGuardada = localStorage.getItem('ruta_actual_data');
      
      if (rutaGuardada) {
        setClients(JSON.parse(rutaGuardada));
      } else {
        // Si no hay ruta, podríamos mostrar un mensaje o cargar datos por defecto
        // Por ahora, lo dejamos vacío para obligar a usar el planificador
        setClients([]);
      }
    };

    cargarRuta();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // MANEJADORES
  const handleCobrar = (client) => {
    setModalMode('normal');
    setSelectedClientForPayment(client);
  };

  const handleEditar = (client) => {
    setModalMode('edit');
    setSelectedClientForPayment(client);
  };

  return (
    <div className="pb-24 px-4 pt-4 bg-slate-50 dark:bg-black min-h-screen transition-colors space-y-4">
      
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-slate-50 dark:bg-black pb-2 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Ruta de Hoy</h1>
            <p className="text-slate-500 text-xs">
              {new Date().toLocaleDateString()} • {filteredClients.length} Clientes
            </p>
          </div>
          <button className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm text-slate-600 dark:text-zinc-400">
            <Filter size={20} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" placeholder="Buscar en ruta..." 
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 focus:border-emerald-500 outline-none transition-all shadow-sm text-slate-800 dark:text-white"
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="space-y-4">
        {clients.length === 0 ? (
          // --- ESTADO VACÍO (SIN RUTA) ---
          <div className="text-center py-20 opacity-60">
            <div className="w-20 h-20 bg-slate-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={40} className="text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-zinc-300 text-lg">Tu ruta está vacía</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-[200px] mx-auto">Selecciona los clientes que vas a visitar hoy.</p>
            <button 
              onClick={() => navigate('/enrutar')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30"
            >
              Planificar Ruta Ahora
            </button>
          </div>
        ) : (
          // --- LISTA NORMAL ---
          filteredClients.map((client) => (
            <ClientCard 
              key={client.id}
              client={client} 
              onViewDetails={(c) => setSelectedClientForDetail(c)}
              onEdit={(c) => handleEditar(c)}
              onPay={(c) => handleCobrar(c)}
            />
          ))
        )}
      </div>

      {/* MODALES */}
      {selectedClientForPayment && (
        <PaymentModal 
          client={selectedClientForPayment} 
          initialMode={modalMode}
          onClose={() => setSelectedClientForPayment(null)} 
        />
      )}

      {selectedClientForDetail && (
        <DetalleCredito 
          cliente={selectedClientForDetail} 
          onClose={() => setSelectedClientForDetail(null)} 
        />
      )}
    </div>
  );
};

export default Ruta;