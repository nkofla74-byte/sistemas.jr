import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client'; // Importamos supabase para el logout real

export default function AdminLayout({ children, title, role }) {
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
            
            {/* LOGO E IDENTIDAD */}
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg font-bold text-lg">JR</div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 leading-none">Sistema JR</span>
                <span className="text-xs text-gray-500 font-medium">{role || 'Administrador'}</span>
              </div>
            </div>

            {/* MENÚ DE ESCRITORIO */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Botón rápido para crear usuarios */}
              <button 
                onClick={() => navigate('/admin/crear-usuario')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
              >
                <span>+</span> Usuarios
              </button>

              <div className="h-6 w-px bg-gray-300"></div>

              <span className="text-sm text-gray-600 font-medium">{title}</span>
              
              <button 
                onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-200"
              >
                Cerrar Sesión
              </button>
            </div>

            {/* BOTÓN MENÚ MÓVIL (Hamburgesa) */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
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
              <p className="px-3 py-2 text-sm text-gray-500 border-t border-gray-100 mt-2">
                Vista: {title}
              </p>
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
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

    </div>
  );
}