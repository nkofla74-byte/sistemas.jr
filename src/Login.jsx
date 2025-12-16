import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase/client';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. AUTENTICACIÓN REAL CON SUPABASE
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 2. LÓGICA DE REDIRECCIÓN (ROLES)
      // En el futuro esto vendrá de la base de datos (tabla 'perfiles').
      // Por ahora, lo hacemos verificando el correo:
      
      const userEmail = data.user.email;

      if (userEmail === 'admin@sistema.com') {
        // El dueño va al panel administrativo
        navigate('/admin');
      } else if (userEmail === 'oficina@sistema.com') {
        // El encargado también usa panel de escritorio (podríamos crear /admin/oficina luego)
        navigate('/admin'); 
      } else {
        // Los cobradores (y otros) van a la App Móvil
        navigate('/');
      }
      
    } catch (err) {
      setError('Error de acceso: Credenciales inválidas');
      console.error(err);
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
            Ingresa tus credenciales
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md space-y-4">
            <div>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-900">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* AYUDA VISUAL (Opcional, bórralo cuando termines de probar) */}
        <div className="text-xs text-center text-gray-400 mt-4">
          <p>Usuarios sugeridos (Crear en Supabase):</p>
          <p>admin@sistema.com / oficina@sistema.com / cobrador@sistema.com</p>
        </div>
      </div>
    </div>
  );
}