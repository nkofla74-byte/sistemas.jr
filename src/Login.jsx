import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // SIMULACIÓN DE BACKEND (Para que pruebes las 3 interfaces)
    // En el futuro, esto se validará con Supabase real.
    setTimeout(() => {
      setLoading(false);
      
      if (email === 'admin@sistema.com') {
        // Rol 1: Dueño del SaaS
        navigate('/super-admin');
      } else if (email === 'oficina@sistema.com') {
        // Rol 2: Administrador de Oficina
        navigate('/admin-oficina');
      } else if (email === 'cobrador@sistema.com') {
        // Rol 3: Cobrador / Ruta
        navigate('/cobrador');
      } else {
        setError('Credenciales de prueba no reconocidas. Intenta con: admin@sistema.com');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* CARD PRINCIPAL: Ancho completo en móvil, restringido en PC */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* CABECERA */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Sistema JR
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa a tu cuenta para gestionar créditos
          </p>
        </div>

        {/* FORMULARIO */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            
            {/* Input Email */}
            <div>
              <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-base" // Usamos la clase global que creamos
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Input Password */}
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-base"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Botón de Acción */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full flex justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ingresando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          {/* Ayuda visual para desarrollo (puedes borrar esto después) */}
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-xs text-indigo-800">
            <p className="font-bold mb-1">Usuarios de prueba:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li onClick={() => setEmail('admin@sistema.com')} className="cursor-pointer hover:underline">Dueño: admin@sistema.com</li>
              <li onClick={() => setEmail('oficina@sistema.com')} className="cursor-pointer hover:underline">Oficina: oficina@sistema.com</li>
              <li onClick={() => setEmail('cobrador@sistema.com')} className="cursor-pointer hover:underline">Cobrador: cobrador@sistema.com</li>
            </ul>
          </div>

        </form>
      </div>
    </div>
  );
}