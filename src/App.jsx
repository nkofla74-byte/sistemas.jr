import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// --- LAYOUTS ---
import CobradorLayout from './layouts/CobradorLayout'; // Diseño Móvil (Barra abajo)
import AdminLayout from './layouts/AdminLayout';       // Diseño Escritorio (Barra arriba)

// --- PAGES (Vistas Comunes) ---
import Login from './Login';
import Home from './pages/Home';         // Panel Móvil Principal
import Ruta from './pages/Ruta';         // Vista de Ruta del Cobrador
import Clientes from './pages/Clientes'; // Vista de Clientes

// --- PAGES (Vistas Administrativas) ---
import CrearUsuario from './pages/admin/CrearUsuario'; // Formulario de registro
import AdminDashboard from './pages/admin/Dashboard';  // Nuevo Panel de Oficinas y Rutas

// --- COMPONENTE DE PROTECCIÓN DE RUTA ---
// Verifica si hay sesión activa. Si no, manda al Login.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Contenedor Base */}
        <div className="font-sans text-slate-900 dark:text-white min-h-screen bg-slate-50 dark:bg-black transition-colors">
          
          <Routes>
            
            {/* 1. LOGIN (Público) */}
            <Route path="/login" element={<Login />} />


            {/* 2. ZONA ADMIN (Escritorio - Dueño y Encargados) */}
            {/* Usa AdminLayout y contiene las herramientas de gestión */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout title="Panel de Control" role="Administrador" />
              </ProtectedRoute>
            }>
               {/* Dashboard: Gestión de Oficinas y Rutas */}
               <Route index element={<AdminDashboard />} />
               
               {/* Gestión de Personal: Crear nuevos usuarios */}
               <Route path="crear-usuario" element={<CrearUsuario />} />
            </Route>


            {/* 3. ZONA COBRADOR (Móvil - Trabajo de Campo) */}
            {/* Usa CobradorLayout (Nav inferior) */}
            <Route element={
              <ProtectedRoute>
                <CobradorLayout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/ruta" element={<Ruta />} />
              <Route path="/clientes" element={<Clientes />} />
              
              {/* Placeholders para rutas futuras (evitan errores 404) */}
              <Route path="/listado-general" element={<div className="p-4">Listado General (Próximamente)</div>} />
              <Route path="/perfil" element={<div className="p-4">Mi Perfil</div>} />
            </Route>


            {/* 4. FALLBACK (Rutas desconocidas) */}
            {/* Si alguien escribe una ruta rara, lo mandamos al inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;