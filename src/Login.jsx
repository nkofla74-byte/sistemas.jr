import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase/client';
import { useAuth } from './context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user, profile } = useAuth(); // Usamos el contexto para verificar si ya está logueado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si el usuario ya está logueado y tiene perfil, redirigir automáticamente
  useEffect(() => {
    if (user && profile) {
      redirectBasedOnRole(profile.role);
    }
  }, [user, profile]);

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'super-admin':
      case 'admin-oficina':
        navigate('/admin');
        break;
      case 'cobrador':
      default:
        navigate('/');
        break;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Iniciar sesión
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Obtener rol manualmente una vez para redirección inmediata
      // (AuthContext también lo hará, pero esto acelera la UX)
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw new Error("Error verificando permisos.");
      
      if (!userProfile) {
        throw new Error("Usuario sin perfil asignado. Contacte al administrador.");
      }

      // 3. Redirigir
      redirectBasedOnRole(userProfile.role);
      
    } catch (err) {
      setError('Error de acceso: ' + (err.message || 'Credenciales inválidas'));
      // Si falló algo después del login (ej. perfil), hacemos logout para limpiar
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 dark:bg-zinc-900 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700">
        
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
            JR
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Sistema JR
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ingreso Seguro
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md space-y-4">
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}