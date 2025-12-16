import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, MapPin, Save, Zap, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabase/client';

const GestionarRuta = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Ubicación inicial (Simulada para referencia del algoritmo)
  const [miUbicacion] = useState({ lat: -12.046374, lng: -77.042793 }); 

  // 1. CARGAR CLIENTES REALES DESDE SUPABASE
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Pedimos Clientes + su Crédito activo
        const { data, error } = await supabase
          .from('clientes')
          .select('*, creditos(cuota_diaria, saldo_pendiente)');

        if (error) throw error;

        // Transformamos para que el algoritmo entienda los datos
        const clientesAdaptados = data.map(c => {
            const credito = c.creditos && c.creditos.length > 0 ? c.creditos[0] : {};
            return {
                id: c.id,
                name: c.nombre,
                address: c.direccion,
                dailyQuota: credito.cuota_diaria || 0,
                debt: credito.saldo_pendiente || 0,
                gps: c.gps, // Asumimos que c.gps ya es un objeto JSON {lat, lng}
                selected: false,
                tempOrder: 999
            };
        });

        // Recuperar selección previa si existe
        const idsGuardados = JSON.parse(localStorage.getItem('ruta_actual_ids') || '[]');
        const listaFinal = clientesAdaptados.map(c => 
            idsGuardados.includes(c.id) ? { ...c, selected: true } : c
        );

        setClientes(listaFinal);
      } catch (err) {
        console.error("Error fetch ruta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // --- LÓGICA DE ALGORITMO DE RUTAS (Mantenida igual) ---
  const getDistancia = (p1, p2) => {
    if (!p1 || !p2) return 99999999; 
    const R = 6371e3; 
    const lat1 = p1.lat * Math.PI/180;
    const lat2 = p2.lat * Math.PI/180;
    const dLat = (p2.lat - p1.lat) * Math.PI/180;
    const dLon = (p2.lng - p1.lng) * Math.PI/180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  const optimizarRutaAutomatica = () => {
    let pool = clientes.filter(c => c.selected);
    const noSeleccionados = clientes.filter(c => !c.selected);
    
    if (pool.length < 2) return alert("Selecciona al menos 2 clientes para optimizar.");

    let rutaOrdenada = [];
    let puntoActual = miUbicacion; 

    while (pool.length > 0) {
      pool.sort((a, b) => {
        const distA = getDistancia(puntoActual, a.gps);
        const distB = getDistancia(puntoActual, b.gps);
        return distA - distB;
      });
      const masCercano = pool[0];
      rutaOrdenada.push(masCercano);
      if (masCercano.gps) puntoActual = masCercano.gps;
      pool.shift(); 
    }

    const nuevaLista = [...rutaOrdenada, ...noSeleccionados];
    const listaConPrioridad = nuevaLista.map((c, index) => ({
        ...c,
        tempOrder: rutaOrdenada.find(r => r.id === c.id) ? index + 1 : 999
    }));

    setClientes(listaConPrioridad);
  };

  const toggleSeleccion = (id) => {
    setClientes(prev => prev.map(c => {
      if (c.id === id) {
        const nuevoEstado = !c.selected;
        const maxOrder = prev.filter(x => x.selected).length; 
        return { ...c, selected: nuevoEstado, tempOrder: nuevoEstado ? maxOrder + 1 : 999 };
      }
      return c;
    }));
  };

  const handlePriorityChange = (id, nuevoValor) => {
    const val = parseInt(nuevoValor) || 0;
    setClientes(prev => prev.map(c => c.id === id ? { ...c, tempOrder: val } : c));
  };

  const handleGuardarRuta = () => {
    const seleccionadosOrdenados = clientes
      .filter(c => c.selected)
      .sort((a, b) => a.tempOrder - b.tempOrder);

    const ids = seleccionadosOrdenados.map(c => c.id);

    localStorage.setItem('ruta_actual_ids', JSON.stringify(ids));
    localStorage.setItem('ruta_actual_data', JSON.stringify(seleccionadosOrdenados));
    navigate('/ruta');
  };

  const countSeleccionados = clientes.filter(c => c.selected).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pb-32 transition-colors">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur p-4 border-b border-slate-200 dark:border-zinc-800 flex flex-col gap-3 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-full hover:bg-slate-200 transition-colors">
              <ArrowLeft size={20} className="text-slate-700 dark:text-zinc-200" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Planificar Ruta</h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Ordena tus visitas de hoy</p>
            </div>
          </div>
          <div className="text-sm font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-lg">
            {countSeleccionados} Visitas
          </div>
        </div>
        {countSeleccionados > 1 && (
            <button 
                onClick={optimizarRutaAutomatica}
                className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
                <Zap size={18} className="fill-indigo-500 text-indigo-500" />
                OPTIMIZAR RUTA
            </button>
        )}
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="p-4 space-y-3">
        {loading && <div className="text-center text-slate-400">Cargando clientes...</div>}
        
        {clientes
            .sort((a, b) => {
                if (a.selected === b.selected) return a.tempOrder - b.tempOrder;
                return a.selected ? -1 : 1;
            })
            .map((cliente) => (
            <div 
              key={cliente.id}
              className={`
                relative p-3 rounded-xl border-2 transition-all flex items-center gap-3
                ${cliente.selected 
                  ? 'bg-white dark:bg-zinc-900 border-indigo-500 shadow-md' 
                  : 'bg-slate-50 dark:bg-zinc-950 border-transparent opacity-80 hover:opacity-100'}
              `}
            >
              <div onClick={() => toggleSeleccion(cliente.id)} className="cursor-pointer">
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors
                  ${cliente.selected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-400'}
                `}>
                  {cliente.selected ? <CheckCircle size={20} /> : <Circle size={20} />}
                </div>
              </div>

              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleSeleccion(cliente.id)}>
                <h3 className={`font-bold text-sm truncate ${cliente.selected ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-zinc-500'}`}>
                  {cliente.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                    {cliente.gps ? (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <MapPin size={10} /> GPS OK
                        </span>
                    ) : (
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <AlertTriangle size={10} /> Sin GPS
                        </span>
                    )}
                    <span className="text-xs text-slate-400">Cuota: S/{Number(cliente.dailyQuota).toFixed(2)}</span>
                </div>
              </div>

              {cliente.selected && (
                  <div className="flex flex-col items-center gap-1 border-l pl-3 border-slate-100 dark:border-zinc-800">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Orden</span>
                      <input 
                        type="number" 
                        value={cliente.tempOrder}
                        onChange={(e) => handlePriorityChange(cliente.id, e.target.value)}
                        className="w-10 h-10 text-center font-bold text-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                  </div>
              )}
            </div>
          ))}
      </div>

      <div className="fixed bottom-6 left-0 w-full px-4 z-30">
        <button 
          onClick={handleGuardarRuta}
          disabled={countSeleccionados === 0}
          className={`
            w-full py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all
            ${countSeleccionados > 0 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95' 
              : 'bg-slate-300 dark:bg-zinc-800 text-slate-500 cursor-not-allowed'}
          `}
        >
          <Save size={24} />
          {countSeleccionados > 0 ? `GUARDAR RUTA (${countSeleccionados})` : 'SELECCIONA CLIENTES'}
        </button>
      </div>
    </div>
  );
};

export default GestionarRuta;