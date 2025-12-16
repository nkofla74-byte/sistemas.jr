import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronRight } from 'lucide-react';

const ListadoClientes = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState([]); // Estado para la lista

  // DATOS BASE (Los antiguos simulados)
  const datosBase = [
    { id: 1, nombre: 'María Gómez', estado: 'active', deuda: 1200, ultimoPago: 'Ayer' },
    { id: 2, nombre: 'Juan Pérez', estado: 'active', deuda: 800, ultimoPago: 'Hoy' },
    { id: 3, nombre: 'Bodega El Chavo', estado: 'mora', deuda: 3000, ultimoPago: 'Hace 3 días' },
    { id: 4, nombre: 'Carlos Ruiz', estado: 'active', deuda: 500, ultimoPago: 'Hoy' },
    { id: 5, nombre: 'Ana Torres', estado: 'paid', deuda: 0, ultimoPago: 'Finalizado' },
  ];

  // EFECTO: Cargar datos al iniciar
  useEffect(() => {
    // 1. Leer los nuevos del navegador
    const nuevosClientes = JSON.parse(localStorage.getItem('nuevos_clientes') || '[]');
    
    // 2. Unir los base + los nuevos
    // Ponemos los nuevos primero para verlos arriba
    setClientes([...nuevosClientes, ...datosBase]);
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
        {clientesFiltrados.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            No se encontraron clientes.
          </div>
        ) : (
          clientesFiltrados.map((cliente) => (
            <div 
              key={cliente.id}
              onClick={() => console.log('Ir a detalle', cliente)}
              className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-xl flex justify-between items-center active:bg-slate-50 dark:active:bg-zinc-800 transition-colors shadow-sm group"
            >
              <div className="flex gap-3 items-center">
                {/* Avatar */}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm uppercase
                  ${cliente.estado === 'mora' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                    cliente.estado === 'paid' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 
                    'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'}`}
                >
                  {cliente.nombre.charAt(0)}
                </div>

                <div>
                  <h3 className={`font-bold text-sm ${cliente.estado === 'paid' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>
                    {cliente.nombre}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-medium ${cliente.estado === 'mora' ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      S/ {typeof cliente.deuda === 'number' ? cliente.deuda.toFixed(2) : cliente.deuda}
                    </span>
                    <span className="text-slate-300 dark:text-zinc-600">•</span>
                    <span className="text-slate-500 dark:text-zinc-400">{cliente.ultimoPago}</span>
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