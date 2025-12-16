import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Layout from './Layout' // Importamos el nuevo Layout unificador

// --- VISTAS UNIFICADAS ---

const SuperAdminDashboard = () => (
  <Layout title="Panel General" role="Dueño SaaS">
    <div className="space-y-6">
      <div className="card-base bg-gradient-to-r from-slate-800 to-slate-900 text-white border-none">
        <h2 className="text-xl font-bold">Resumen Global</h2>
        <p className="opacity-80">Bienvenido al panel maestro.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-base text-center py-8">
          <p className="text-gray-500 text-sm">Oficinas Activas</p>
          <p className="text-3xl font-bold text-indigo-600">12</p>
        </div>
        <div className="card-base text-center py-8">
          <p className="text-gray-500 text-sm">Total Recaudo (Mes)</p>
          <p className="text-3xl font-bold text-emerald-600">$45M</p>
        </div>
      </div>
    </div>
  </Layout>
);

const OfficeAdminDashboard = () => (
  <Layout title="Mi Oficina" role="Administrador">
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Rutas Asignadas</h2>
        <button className="btn-primary py-2 px-4 text-sm">Nueva Ruta</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Ruta Norte - Juan', 'Ruta Centro - Pedro', 'Ruta Sur - Maria'].map((ruta, i) => (
          <div key={i} className="card-base flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {i + 1}
              </div>
              <span className="font-medium text-gray-700">{ruta}</span>
            </div>
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">Activa</span>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

const CollectorDashboard = () => (
  <Layout title="Mi Ruta de Hoy" role="Cobrador">
    {/* Interfaz Móvil para el Cobrador: ESTILO UNIFICADO */}
    <div className="space-y-4">
      
      {/* Barra de progreso rápida */}
      <div className="bg-indigo-600 rounded-xl p-4 text-white shadow-lg">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Meta del día</span>
          <span className="font-bold">45%</span>
        </div>
        <div className="w-full bg-indigo-800 rounded-full h-2.5">
          <div className="bg-emerald-400 h-2.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <div className="mt-3 flex justify-between text-xs opacity-80">
          <span>Recaudado: $450k</span>
          <span>Faltante: $550k</span>
        </div>
      </div>

      <h3 className="font-bold text-gray-700 px-1 mt-6">Clientes Pendientes (5)</h3>

      {/* Lista de cobros: Usando card-base para mantener consistencia */}
      <div className="space-y-3">
        {[
          { name: 'Carlos Ruiz', address: 'Calle 10 # 5-20', debt: '$50.000' },
          { name: 'Ana María Polo', address: 'Cra 4 # 12-85', debt: '$30.000' },
          { name: 'Taller El Paisa', address: 'Av. Principal Local 3', debt: '$100.000' }
        ].map((cliente, i) => (
          <div key={i} className="card-base p-4 flex justify-between items-center active:bg-gray-50 transition-colors">
            <div>
              <p className="font-bold text-gray-900">{cliente.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {cliente.address}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-indigo-700">{cliente.debt}</p>
              <button className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 mt-1">
                Cobrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

function App() {
  return (
    <div className="min-h-screen w-full font-sans text-gray-900 bg-gray-50">
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rutas con el nuevo Layout aplicado */}
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin-oficina" element={<OfficeAdminDashboard />} />
        <Route path="/cobrador" element={<CollectorDashboard />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App