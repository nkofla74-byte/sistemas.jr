import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { Building2, Map, Plus, Trash2, LayoutGrid } from 'lucide-react';

export default function Dashboard() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOfficeName, setNewOfficeName] = useState('');

  // --- CARGAR DATOS REALES ---
  const fetchOffices = async () => {
    try {
      // Pedimos las oficinas y contamos cuántas rutas tiene cada una
      const { data, error } = await supabase
        .from('offices')
        .select('*, routes(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffices(data);
    } catch (error) {
      console.error('Error cargando datos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  // --- CREAR OFICINA ---
  const handleCreateOffice = async (e) => {
    e.preventDefault();
    if (!newOfficeName.trim()) return;

    const { error } = await supabase.from('offices').insert([{ name: newOfficeName }]);
    
    if (!error) {
      setNewOfficeName('');
      setShowModal(false);
      fetchOffices(); // Recargamos la lista automáticamente
    } else {
      alert('Error creando oficina: ' + error.message);
    }
  };

  // --- ELIMINAR OFICINA ---
  const handleDeleteOffice = async (id) => {
    if (!confirm('⚠️ ¿Estás seguro? Se borrarán también todas las rutas de esta oficina.')) return;
    
    const { error } = await supabase.from('offices').delete().eq('id', id);
    if (!error) fetchOffices();
  };

  // --- AGREGAR RUTA A UNA OFICINA ---
  const handleAddRoute = async (officeId) => {
    // Creamos una ruta genérica. Luego el encargado podrá cambiarle el nombre.
    const { error } = await supabase
      .from('routes')
      .insert([{ 
        name: `Ruta ${Math.floor(Math.random() * 1000)}`, // Nombre temporal
        office_id: officeId 
      }]);
    
    if (!error) {
      fetchOffices();
      alert('✅ Ruta agregada exitosamente');
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Cargando tu imperio...</div>;

  return (
    <div className="space-y-8">
      
      {/* HEADER: Título y Botón Principal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutGrid className="text-indigo-600" /> Panel de Control
          </h1>
          <p className="text-gray-500 mt-1">Administra tus sedes y rutas operativas desde aquí.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
        >
          <Plus size={20} /> Crear Nueva Oficina
        </button>
      </div>

      {/* LISTA DE OFICINAS */}
      {offices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No hay oficinas registradas</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primera sede para asignar rutas.</p>
          <button onClick={() => setShowModal(true)} className="text-indigo-600 font-medium hover:underline">
            Crear mi primera oficina ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offices.map((office) => (
            <div key={office.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
              
              {/* Encabezado de la Tarjeta */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{office.name}</h3>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
                      Operativa
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteOffice(office.id)}
                  className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar Oficina"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Estadísticas y Acciones */}
              <div className="p-5 bg-gray-50/50 rounded-b-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Map size={16} /> Rutas Asignadas
                  </span>
                  <span className="text-2xl font-bold text-gray-800">
                    {office.routes[0]?.count || 0}
                  </span>
                </div>

                <button 
                  onClick={() => handleAddRoute(office.id)}
                  className="w-full py-2.5 border border-gray-300 bg-white rounded-lg text-sm text-gray-600 font-medium hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex justify-center items-center gap-2 shadow-sm"
                >
                  <Plus size={16} /> Agregar Cupo de Ruta
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL (Ventana emergente para crear oficina) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
            <h2 className="text-xl font-bold mb-1 text-gray-900">Nueva Sede</h2>
            <p className="text-sm text-gray-500 mb-6">Ingresa el nombre para identificar esta oficina.</p>
            
            <form onSubmit={handleCreateOffice}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Oficina</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Ej: Sucursal Centro, Sede Bogotá..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newOfficeName}
                    onChange={(e) => setNewOfficeName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Crear Oficina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}