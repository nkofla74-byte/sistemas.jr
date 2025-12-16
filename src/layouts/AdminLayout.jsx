import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom'; // <--- OJO: Outlet es vital aquí
import { supabase } from '../supabase/client';

export default function AdminLayout({ title, role }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* --- NAVBAR SUPERIOR --- */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LOGO */}
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg font-bold text-lg">JR</div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 leading-none">Sistema JR</span>
                <span className="text-xs text-gray-500 font-medium">{role || 'Administrador'}</span>
              </div>
            </div>

            {/* MENÚ DE ESCRITORIO */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigate('/admin/crear-usuario')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
              >
                + Usuarios
              </button>

              <div className="h-6 w-px bg-gray-300"></div>

              <span className="text-sm text-gray-600 font-medium">{title}</span>
              
              <button 
                onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>

            {/* BOTÓN MENÚ MÓVIL */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? '✖' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* MENÚ DESPLEGABLE MÓVIL */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <button 
                onClick={() => { navigate('/admin/crear-usuario'); setIsMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-indigo-600 bg-indigo-50 rounded-md"
              >
                + Crear Nuevo Usuario
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      {/* AQUÍ ESTABA EL ERROR: Necesitamos Outlet para que se vean las rutas hijas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet /> 
      </main>

    </div>
  );
}