import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Map, Users, UserCircle } from 'lucide-react';

const CobradorLayout = () => {
  const location = useLocation();

  // Función para saber qué botón está activo y pintarlo de azul
  const isActive = (path) => {
    return location.pathname === path ? "text-blue-600 scale-110" : "text-gray-400 hover:text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* AQUÍ SE MUESTRA EL CONTENIDO DE CADA PÁGINA */}
      <main className="flex-1 pb-24 safe-area-inset-bottom">
        <Outlet />
      </main>

      {/* BARRA DE NAVEGACIÓN INFERIOR (Fija) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto pb-1">
          
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${isActive('/')}`}>
            <Home size={24} strokeWidth={2.5} />
            <span className="text-[10px] mt-1 font-semibold">Inicio</span>
          </Link>

          <Link to="/ruta" className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${isActive('/ruta')}`}>
            <Map size={24} strokeWidth={2.5} />
            <span className="text-[10px] mt-1 font-semibold">Ruta</span>
          </Link>

          <Link to="/clientes" className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${isActive('/clientes')}`}>
            <Users size={24} strokeWidth={2.5} />
            <span className="text-[10px] mt-1 font-semibold">Clientes</span>
          </Link>

          <Link to="/perfil" className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${isActive('/perfil')}`}>
            <UserCircle size={24} strokeWidth={2.5} />
            <span className="text-[10px] mt-1 font-semibold">Perfil</span>
          </Link>

        </div>
      </nav>
    </div>
  );
};

export default CobradorLayout;