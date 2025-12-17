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
import Perfil from './pages/Perfil';

// --- PAGES (Funcionalidades del Cobrador) ---
import GestionarRuta from './pages/GestionarRuta';
import ListadoClientes from './pages/ListadoClientes';
import NuevoCliente from './pages/NuevoCliente';

// --- PAGES (Vistas Administrativas) ---
import CrearUsuario from './pages/admin/CrearUsuario';
import AdminDashboard from './pages/admin/Dashboard';

// --- COMPONENTE DE PROTECCIÓN DE RUTA MEJORADO ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // 1. Si no está logueado, mandar al login
  if (!user) return <Navigate to="/login" replace />;

  // 2. Si la ruta requiere roles específicos y el usuario no tiene el rol adecuado
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirigir a la home de su rol correspondiente para evitar bucles
    if (profile.role === 'cobrador') {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }
  
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

            {/* 2. ZONA ADMIN (Escritorio) - Protegida por Rol */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin-oficina']}>
                <AdminLayout title="Panel de Control" role="Administrador" />
              </ProtectedRoute>
            }>
               <Route index element={<AdminDashboard />} />
               <Route path="crear-usuario" element={<CrearUsuario />} />
            </Route>

            {/* 3. ZONA COBRADOR (Móvil) - Protegida por Rol */}
            <Route element={
              <ProtectedRoute allowedRoles={['cobrador', 'super-admin', 'admin-oficina']}>
                <CobradorLayout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/ruta" element={<Ruta />} />
              <Route path="/clientes" element={<Clientes />} />
              
              {/* Funcionalidades */}
              <Route path="/enrutar" element={<GestionarRuta />} />
              <Route path="/listado-general" element={<ListadoClientes />} />
              <Route path="/clientes/crear" element={<NuevoCliente />} />
              <Route path="/creditos/nuevo" element={<NuevoCliente />} />
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