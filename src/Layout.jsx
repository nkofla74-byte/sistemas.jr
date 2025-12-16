import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children, title, role }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí luego limpiaremos tokens de sesión real
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* --- NAVBAR / ENCABEZADO (Igual para todos) --- */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo y Título */}
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg font-bold text-lg">JR</div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 leading-none">Sistema JR</span>
                <span className="text-xs text-gray-500 font-medium">{role || 'Usuario'}</span>
              </div>
            </div>

            {/* Menú Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-medium">{title}</span>
              <button 
                onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>

            {/* Botón Menú Móvil */}
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

        {/* Menú Desplegable Móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 animate-fade-in-down">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <p className="block px-3 py-2 text-base font-medium text-indigo-600 border-l-4 border-indigo-600 bg-indigo-50">
                {title}
              </p>
              <button 
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </header>

      {/* --- CONTENIDO PRINCIPAL (Aquí se inyectan las vistas) --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

    </div>
  );
}