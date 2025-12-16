import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  UserPlus, 
  Banknote, 
  MapPin, 
  ChevronRight,
  Sun,
  Moon,
  Map
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Componente de Tarjeta Híbrida (Día/Noche) para métricas pequeñas
const StatCardHybrid = ({ title, amount, type, icon: Icon }) => (
  <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between transition-colors duration-300">
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">{title}</span>
      <Icon size={18} className={type === 'success' ? 'text-emerald-500' : 'text-slate-400 dark:text-zinc-600'} />
    </div>
    <div className="text-2xl font-bold text-slate-800 dark:text-white">
      S/ {amount.toFixed(2)}
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Hook del tema oscuro/claro

  // Datos simulados del resumen de caja
  const [resumen] = useState({
    baseInicial: 200.00,
    cobradoHoy: 450.00,
    prestadoHoy: 100.00,
    gastosHoy: 15.50
  });

  const dineroEnMano = resumen.baseInicial + resumen.cobradoHoy - resumen.prestadoHoy - resumen.gastosHoy;

  return (
    <div className="space-y-6 pb-24 pt-4 px-4 bg-slate-50 dark:bg-black min-h-screen transition-colors">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center">
        {/* Lado Izquierdo: Saludo */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">Hola, Juan</h1>
          <div className="flex items-center text-slate-500 dark:text-zinc-400 text-xs gap-1">
            <MapPin size={12} className="text-emerald-600 dark:text-emerald-500" />
            <span>Zona Centro - En Rutas</span>
          </div>
        </div>

        {/* Lado Derecho: Botón Tema + Logo */}
        <div className="flex items-center gap-3">
          
          {/* BOTÓN DE TEMA (Sol/Luna) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-emerald-100 dark:hover:bg-zinc-700 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Logo de la Empresa (JR) */}
          <div className="h-10 w-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-zinc-700 font-bold text-emerald-600 dark:text-emerald-500 shadow-sm transition-colors">
            JR
          </div>
        </div>
      </div>

      {/* --- TARJETA PRINCIPAL (CAJA) --- */}
      <div className="bg-emerald-600 dark:bg-emerald-700 p-5 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none text-white relative overflow-hidden transition-colors">
        <Wallet className="absolute -right-4 -top-4 text-emerald-500/40" size={120} />
        <div className="relative z-10">
          <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider mb-1">Dinero en Mano</p>
          <h2 className="text-4xl font-bold mb-4">S/ {dineroEnMano.toFixed(2)}</h2>
          <div className="flex justify-between items-end border-t border-emerald-500/30 pt-3">
            <div>
              <p className="text-[10px] text-emerald-100 uppercase">Base Inicial</p>
              <p className="font-semibold text-sm">S/ {resumen.baseInicial.toFixed(2)}</p>
            </div>
            <div className="bg-black/10 px-3 py-1 rounded-lg backdrop-blur-sm">
              <p className="text-[10px] text-emerald-100 uppercase">Gastos Hoy</p>
              <p className="font-bold text-sm text-white">- S/ {resumen.gastosHoy.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACCESOS RÁPIDOS --- */}
      <div className="space-y-3">
        <p className="text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase">Gestión Rápida</p>
        
        {/* NUEVO BOTÓN: PLANIFICAR RUTA (Destacado) */}
        <button 
          onClick={() => navigate('/enrutar')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition-all p-3 rounded-xl flex items-center justify-between group shadow-lg shadow-indigo-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg text-white">
              <Map size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-sm">Planificar Ruta de Hoy</h3>
              <p className="text-indigo-200 text-[10px]">Seleccionar clientes a visitar</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-indigo-200" />
        </button>

        {/* Botones Pequeños */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => navigate('/clientes/crear')}
            className="bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95 transition-all p-3 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-zinc-800 shadow-sm"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full text-blue-600 dark:text-blue-400">
              <UserPlus size={20} />
            </div>
            <span className="font-medium text-slate-600 dark:text-zinc-300 text-sm">Cliente Nuevo</span>
          </button>

          <button 
            onClick={() => navigate('/creditos/nuevo')}
            className="bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95 transition-all p-3 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-zinc-800 shadow-sm"
          >
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
              <Banknote size={20} />
            </div>
            <span className="font-medium text-slate-600 dark:text-zinc-300 text-sm">Crédito Nuevo</span>
          </button>
        </div>

        {/* Botón Listado General */}
        <button 
          onClick={() => navigate('/listado-general')}
          className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700 active:scale-95 transition-all p-3 rounded-xl flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-400">
              <Users size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-700 dark:text-zinc-200 text-sm">Cartera Total</h3>
              <p className="text-slate-400 dark:text-zinc-500 text-[10px]">Ver todos los clientes</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-300 dark:text-zinc-600" />
        </button>
      </div>

      {/* --- MÉTRICAS --- */}
      <div className="space-y-2 pt-2">
        <p className="text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase">Resumen Operativo</p>
        <div className="grid grid-cols-2 gap-3">
          <StatCardHybrid title="Cobrado Hoy" amount={resumen.cobradoHoy} type="success" icon={TrendingUp} />
          <StatCardHybrid title="Prestado Hoy" amount={resumen.prestadoHoy} type="neutral" icon={Wallet} />
        </div>
      </div>

      {/* --- AVANCE DE RUTA (Barra de progreso) --- */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl mt-2 shadow-sm transition-colors">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h4 className="font-bold text-slate-700 dark:text-zinc-200 text-sm">Tu Ruta de Hoy</h4>
            <p className="text-xs text-slate-400 dark:text-zinc-500">Progreso estimado</p>
          </div>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-500">26%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '26%' }}></div>
        </div>
      </div>

    </div>
  );
};

export default Home;