import React, { useState } from 'react';
import ClientCard from '../components/ClientCard';
import PaymentModal from '../components/PaymentModal'; // Importamos el modal
import { Filter, Search, Map } from 'lucide-react';

// --- SIMULACIÓN DE DATOS (MOCK DATA) ---
const initialMockClients = [
    { id: 1, name: 'ELI MELENDEZ', cuota: 10.00, address: 'AV 5 DE ABRIL MANZANA 134', status: 'al_dia', priority: 1 },
    { id: 2, name: 'OLGA GLORIA VIGO', cuota: 15.00, address: 'CALLE FRANCISCO DE PAULA 845', status: 'vencido', priority: 2 },
    { id: 3, name: 'MARCO ANTONIO CHU', cuota: 25.00, address: 'CALLE FRANCISCO DE PAULA 355', status: 'mora_critica', priority: 3 },
    { id: 4, name: 'MIGUEL ANGEL QUEZADA', cuota: 12.50, address: 'AV 2B DE MARZO 787', status: 'al_dia', priority: 4 },
    { id: 5, name: 'LUIS VALDIVIESO', cuota: 5.00, address: '26 DE MARZO 887', status: 'pagado', priority: 5 }, 
    { id: 6, name: 'MARILU SOLEDAD PENA', cuota: 18.00, address: 'JR. BALMACEDA 1797', status: 'al_dia', priority: 6 },
    { id: 7, name: 'ORTENCIA TASILLA', cuota: 15.00, address: 'AV SAN MARTIN', status: 'mora_critica', priority: 7 },
];

const Ruta = () => {
    const [mockClients, setMockClients] = useState(initialMockClients); // Ahora es un estado
    const [filter, setFilter] = useState('pendientes'); 
    const [search, setSearch] = useState('');
    const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado para el modal

    // Función para abrir el modal
    const handleCobrar = (client) => {
        setSelectedClient(client);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setSelectedClient(null);
    };

    // Función que simula el registro en base de datos y actualiza la UI
    const handlePaymentConfirmed = (clientId) => {
        setMockClients(prevClients => 
            prevClients.map(c => 
                c.id === clientId ? { ...c, status: 'pagado' } : c
            )
        );
        // El modal se cierra en el componente PaymentModal después del éxito
    };


    const filteredClients = mockClients
        .filter(client => {
            if (filter === 'pendientes') return client.status !== 'pagado';
            if (filter === 'mora') return client.status === 'mora_critica' || client.status === 'vencido';
            return true; 
        })
        .filter(client => client.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.priority - b.priority); // Mantener el orden de ruta

    return (
        <div className="p-4 pt-6 max-w-md mx-auto">
            {/* ... [ RESTO DEL CÓDIGO DE BÚSQUEDA Y FILTROS ES EL MISMO ] ... */}
            
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex justify-between items-center">
                Mi Ruta <Map size={28} className="text-blue-500" />
            </h1>
            
            {/* 1. BARRA DE BÚSQUEDA */}
            <div className="relative mb-4">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar cliente por nombre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
            </div>

            {/* 2. FILTROS RÁPIDOS (Píldoras) */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1 hide-scrollbar">
                {['pendientes', 'mora', 'todos'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`
                            px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors
                            ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200'}
                        `}
                    >
                        {f === 'pendientes' && 'Clientes Pendientes'}
                        {f === 'mora' && '🔴 Clientes en Mora'}
                        {f === 'todos' && 'Ver Toda la Ruta'}
                    </button>
                ))}
            </div>


            {/* 3. LISTA DE CLIENTES */}
            <h2 className="text-lg font-bold text-gray-700 mb-3">
                {filteredClients.length} Clientes encontrados
            </h2>

            {filteredClients.length === 0 && (
                 <p className="text-center text-gray-500 pt-8">¡Ruta finalizada o sin coincidencias!</p>
            )}

            {filteredClients.map(client => (
                <ClientCard 
                    key={client.id} 
                    client={client} 
                    onCobrarClick={handleCobrar} // Abre el modal
                />
            ))}

            {/* Espacio para la barra de navegación inferior */}
            <div className="h-10"></div>
            
            {/* MODAL DE PAGO (solo se muestra si selectedClient no es null) */}
            {selectedClient && (
                <PaymentModal 
                    client={selectedClient} 
                    onClose={handleCloseModal} 
                    onPaymentConfirmed={handlePaymentConfirmed}
                />
            )}
        </div>
    );
};

export default Ruta;