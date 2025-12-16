import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronRight, User } from 'lucide-react';
import { supabase } from '../supabase/client'; // Importar cliente Supabase

const ListadoClientes = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // EFECTO: Cargar datos REALES de Supabase
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        // Obtenemos clientes y sus créditos relacionados
        const { data, error } = await supabase
          .from('clientes')
          .select('*, creditos(saldo_pendiente, estado)');
        
        if (error) throw error;
        
        // Formateamos los datos para la vista
        const clientesFormateados = data.map(c => {
          // Tomamos el primer crédito activo o el último registrado
          const creditoActivo = c.creditos && c.creditos.length > 0 ? c.creditos[0] : null;
          return {
            id: c.id,
            nombre: c.nombre,
            estado: creditoActivo ? creditoActivo.estado : 'active', // Estado por defecto
            deuda: creditoActivo ? creditoActivo.saldo_pendiente : 0,
            ultimoPago: 'N/A' // Esto se podría mejorar consultando pagos
          };
        });

        setClientes(clientesFormateados);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-24 bg-slate-50 dark:bg-black min-h-screen transition-colors">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 pt-4 px-4">
        <button onClick={() => navigate('/')} className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full text-slate-700 dark:text-zinc-200 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Cartera Total</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs">
            {clientes.length} clientes registrados
          </p>
        </div>
      </div>
      
      {/* BARRA DE BÚSQUEDA */}
      <div className="px-4 sticky top-0 z-10 bg-slate-50 dark:bg-black py-2 transition-colors">
        <div className="relative shadow-sm">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:border-emerald-500 outline-none text-slate-800 dark:text-white transition-all"
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="px-4 space-y-3">
        {loading ? (
           <div className="text-center py-10 text-slate-400">Cargando cartera...</div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            No se encontraron clientes.
          </div>
        ) : (
          clientesFiltrados.map((cliente) => (
            <div 
              key={cliente.id}
              className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-xl flex justify-between items-center active:bg-slate-50 dark:active:bg-zinc-800 transition-colors shadow-sm group"
            >
              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm uppercase">
                  {cliente.nombre.charAt(0)}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                    {cliente.nombre}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      S/ {Number(cliente.deuda).toFixed(2)}
                    </span>
                    <span className="text-slate-300 dark:text-zinc-600">•</span>
                    <span className="text-slate-500 dark:text-zinc-400">Deuda actual</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="text-slate-300 dark:text-zinc-600 group-hover:text-emerald-500 transition-colors" size={18} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListadoClientes;