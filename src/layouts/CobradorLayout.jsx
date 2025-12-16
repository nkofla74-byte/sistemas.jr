import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Users, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CobradorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;
  
  const navBtnClass = (active) => `
    flex flex-col items-center justify-center w-full h-full gap-1
    ${active 
      ? 'text-emerald-600 dark:text-emerald-500' 
      : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'}
    transition-colors duration-200
  `;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans transition-colors duration-300 relative">
      
      {/* --- NUEVO BOTÓN FLOTANTE SUPERIOR DERECHO --- */}
      {/* Se mantiene fijo (fixed) para que siempre esté visible al hacer scroll */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-slate-200 dark:border-zinc-700 shadow-lg active:scale-90 transition-all duration-200"
        aria-label="Cambiar modo oscuro"
      >
        {theme === 'dark' ? (
          <Sun size={20} className="text-yellow-400 fill-yellow-400/20" />
        ) : (
          <Moon size={20} className="text-slate-600 fill-slate-600/20" />
        )}
      </button>

      {/* CONTENIDO DE LA PÁGINA */}
      <div className="w-full max-w-md mx-auto">
        <Outlet />
      </div>

      {/* BARRA DE NAVEGACIÓN INFERIOR (Limpia, sin el botón de tema) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 h-16 z-40 transition-colors duration-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <div className="max-w-md mx-auto h-full flex justify-between items-center px-6"> {/* Aumenté padding px-6 para mejor distribución */}
          
          <button onClick={() => navigate('/')} className={navBtnClass(isActive('/'))}>
            <Home size={22} strokeWidth={isActive('/') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Inicio</span>
          </button>

          <button onClick={() => navigate('/ruta')} className={navBtnClass(isActive('/ruta'))}>
            <Map size={22} strokeWidth={isActive('/ruta') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Ruta</span>
          </button>

          <button onClick={() => navigate('/listado-general')} className={navBtnClass(isActive('/listado-general'))}>
             <Users size={22} strokeWidth={isActive('/listado-general') ? 2.5 : 2} />
             <span className="text-[10px] font-medium">Cartera</span>
          </button>

          <button onClick={() => navigate('/perfil')} className={navBtnClass(isActive('/perfil'))}>
            <User size={22} strokeWidth={isActive('/perfil') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>

        </div>
      </nav>
    </div>
  );
};

export default CobradorLayout;