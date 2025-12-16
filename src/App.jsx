import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// --- LAYOUTS ---
import CobradorLayout from './layouts/CobradorLayout';
import AdminLayout from './layouts/AdminLayout';

// --- PAGES (Vistas Comunes) ---
import Login from './Login';
import Home from './pages/Home';
import Ruta from './pages/Ruta';
import Clientes from './pages/Clientes';
import Perfil from './pages/Perfil'; // Importación agregada

// --- PAGES (Funcionalidades del Cobrador) ---
import GestionarRuta from './pages/GestionarRuta'; // Importación agregada
import ListadoClientes from './pages/ListadoClientes'; // Importación agregada
import NuevoCliente from './pages/NuevoCliente'; // Importación agregada

// --- PAGES (Vistas Administrativas) ---
import CrearUsuario from './pages/admin/CrearUsuario';
import AdminDashboard from './pages/admin/Dashboard';

// --- COMPONENTE DE PROTECCIÓN DE RUTA ---
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
        <div className="font-sans text-slate-900 dark:text-white min-h-screen bg-slate-50 dark:bg-black transition-colors">
          
          <Routes>
            
            {/* 1. LOGIN (Público) */}
            <Route path="/login" element={<Login />} />

            {/* 2. ZONA ADMIN (Escritorio) */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout title="Panel de Control" role="Administrador" />
              </ProtectedRoute>
            }>
               <Route index element={<AdminDashboard />} />
               <Route path="crear-usuario" element={<CrearUsuario />} />
            </Route>

            {/* 3. ZONA COBRADOR (Móvil) */}
            <Route element={
              <ProtectedRoute>
                <CobradorLayout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/ruta" element={<Ruta />} />
              <Route path="/clientes" element={<Clientes />} />
              
              {/* --- RUTAS CORREGIDAS --- */}
              {/* Planificador de rutas */}
              <Route path="/enrutar" element={<GestionarRuta />} />
              
              {/* Cartera de Clientes */}
              <Route path="/listado-general" element={<ListadoClientes />} />
              
              {/* Creación de Clientes y Créditos (Usamos el mismo componente) */}
              <Route path="/clientes/crear" element={<NuevoCliente />} />
              <Route path="/creditos/nuevo" element={<NuevoCliente />} />
              
              {/* Perfil */}
              <Route path="/perfil" element={<Perfil />} />
            </Route>

            {/* 4. FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;