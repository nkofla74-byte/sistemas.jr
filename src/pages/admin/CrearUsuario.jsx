import { useState } from 'react';
import { supabase } from '../../supabase/client';

export default function CrearUsuario() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'cobrador' // Default
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Crear el usuario en Supabase Auth
      // NOTA: Usualmente esto requiere una Edge Function para seguridad total,
      // pero para este MVP usaremos signUp. El 'nuevo' usuario recibirá un correo de confirmación
      // o quedará activo si desactivas "Confirm Email" en Supabase.
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role // Guardamos el rol en la metadata del usuario también
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Crear el registro en la tabla 'profiles' para búsquedas rápidas
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: formData.email,
              role: formData.role,
              full_name: formData.fullName
            }
          ]);

        if (profileError) {
          // Si falla el perfil, es bueno avisar (aunque el usuario Auth se creó)
          console.error('Error creando perfil:', profileError);
        }

        setMessage({ type: 'success', text: `Usuario ${formData.role} creado con éxito.` });
        setFormData({ email: '', password: '', fullName: '', role: 'cobrador' }); // Limpiar form
      }

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Registrar Nuevo Personal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Nombre Completo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input
            type="text"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>

        {/* Correo y Rol (En la misma línea en PC) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol Asignado</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="cobrador">Cobrador (Ruta)</option>
              <option value="admin-oficina">Admin de Oficina</option>
              <option value="super-admin">Socio / Dueño</option>
            </select>
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña Inicial
            <span className="text-xs text-gray-400 ml-2">(Mínimo 6 caracteres)</span>
          </label>
          <input
            type="text" // Tipo text para verla y copiarla al enviarla al empleado
            required
            minLength={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-gray-600 bg-gray-50"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Ej: Cobrador2025*"
          />
        </div>

        {/* Mensajes de Feedback */}
        {message.text && (
          <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-indigo-500/30"
        >
          {loading ? 'Creando Usuario...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );
}