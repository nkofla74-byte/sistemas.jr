import React from 'react';
import { DollarSign, Send, TrendingDown, BookOpen } from 'lucide-react';
import ActionButton from '../components/ActionButton'; // Importamos el componente de botón

const Home = () => {
  // --- DATOS DE EJEMPLO (Se reemplazarán con datos de Supabase) ---
  const cajaActual = 540.00;
  const baseInicial = 200.00;
  const moneda = "PEN";
  
  // Usaremos useNavigate de React Router para movernos a otras pantallas
  const handleActionClick = (path) => {
    console.log(`Navegando a: ${path}`);
    // Aquí, en el futuro, usaríamos useNavigate()
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel Operativo</h1>
      
      {/* 1. WIDGET DE CAJA / BILLETERA */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/30 mb-8">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Dinero en Caja (Debe tener)</p>
                <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight">$ {cajaActual.toFixed(2)}</span>
                <span className="text-lg opacity-80 font-semibold">{moneda}</span>
                </div>
            </div>
            <DollarSign size={40} className="opacity-50" />
        </div>
        
        <div className="mt-6 pt-3 border-t border-white/20 flex justify-between text-sm">
            <span>Base Inicial: <span className="font-bold">$ {baseInicial.toFixed(2)}</span></span>
            <span>Neto Cobrado: <span className="font-bold">$ {(cajaActual - baseInicial).toFixed(2)}</span></span>
        </div>
      </div>

      {/* 2. ACCIONES RÁPIDAS (Botones) */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Acciones de Campo</h2>
      
      <ActionButton
        icon={DollarSign}
        title="Registrar Cobro"
        description="Cobro rápido a cliente existente."
        color="green"
        onClick={() => handleActionClick('/ruta')} // Cobro se hace desde la Ruta
      />

      <ActionButton
        icon={Send}
        title="Nuevo Préstamo"
        description="Alta de cliente y desembolso."
        color="primary" // Color azul configurado en tailwind.config
        onClick={() => handleActionClick('/clientes/new')} // Usaremos una sub-ruta
      />

      <ActionButton
        icon={TrendingDown}
        title="Registrar Gasto"
        description="Gasolina, almuerzo, imprevistos."
        color="red"
        onClick={() => handleActionClick('/gasto')}
      />

      <ActionButton
        icon={BookOpen}
        title="Cuadre del Día"
        description="Resumen de ingresos y egresos."
        color="gray"
        onClick={() => handleActionClick('/perfil')} // Se puede enlazar al perfil/cierre
      />

      {/* Espacio para la barra de navegación inferior */}
      <div className="h-10"></div>
    </div>
  );
};

export default Home;