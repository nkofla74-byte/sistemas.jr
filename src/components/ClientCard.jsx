import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';

const ClientCard = ({ client, onCobrarClick }) => {
  
  // Función para obtener las clases de color semáforo (Explicitas para Tailwind)
  const getStatusClasses = (status) => {
    switch (status) {
      case 'mora_critica':
        return {
          borderColor: 'border-l-red-500',
          badgeClass: 'bg-red-100 text-red-700',
          statusText: 'MORA CRÍTICA',
        };
      case 'vencido':
        return {
          borderColor: 'border-l-yellow-500',
          badgeClass: 'bg-yellow-100 text-yellow-700',
          statusText: 'VENCIDO',
        };
      case 'pagado':
        return {
          borderColor: 'border-l-gray-400',
          badgeClass: 'bg-gray-100 text-gray-600',
          statusText: 'Pagado Hoy',
        };
      case 'al_dia':
      default:
        return {
          borderColor: 'border-l-green-500',
          badgeClass: 'bg-green-100 text-green-700',
          statusText: 'Al día',
        };
    }
  };

  const classes = getStatusClasses(client.status);
  
  // Estilo para la foto del cliente
  const avatarStyle = client.status === 'pagado' ? 'bg-gray-200' : 'bg-blue-100 text-blue-600';

  return (
    <div 
      className={`bg-white rounded-xl shadow-md mb-4 p-4 
                  flex justify-between items-center transition-all duration-300
                  border-l-8 ${classes.borderColor} // Borde de color semáforo
                  hover:shadow-lg hover:border-l-blue-500
                `}
    >
      {/* Información del Cliente */}
      <div className="flex items-center flex-1 min-w-0">
        
        {/* Ícono/Foto (Círculo) */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${avatarStyle} flex-shrink-0`}>
          {client.status === 'pagado' ? (
              <DollarSign size={20} className="text-gray-500" />
          ) : (
              // Usamos la inicial del nombre o la prioridad para simular la foto
              <span className="font-bold text-lg">{client.name.charAt(0)}</span> 
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          
          {/* Nombre y Estatus (Fila superior) */}
          <div className="flex items-center justify-between">
             <h3 className={`font-bold text-gray-800 truncate text-base 
                            ${client.status === 'pagado' ? 'line-through text-gray-400' : ''}`}
             >
                {client.name}
             </h3>
             
             {/* Badge de Estado */}
             <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${classes.badgeClass}`}>
                {classes.statusText}
             </span>
          </div>
          
          {/* Detalles (Dirección) */}
          <p className="text-sm text-gray-500 flex items-center mt-1 truncate">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            {client.address}
          </p>
        </div>
      </div>
      
      {/* Sección de Acción (Botón de Cuota) */}
      {client.status !== 'pagado' && (
        <button
          onClick={() => onCobrarClick(client)}
          className="ml-3 flex-shrink-0 bg-green-600 text-white font-extrabold py-2 px-4 rounded-xl shadow-md hover:bg-green-700 transition-colors text-lg"
        >
          $ {client.cuota.toFixed(2)}
        </button>
      )}

      {client.status === 'pagado' && (
        <div className="ml-3 flex-shrink-0 text-gray-500 font-bold text-sm">
           COBRADO
        </div>
      )}
      
    </div>
  );
};

export default ClientCard;