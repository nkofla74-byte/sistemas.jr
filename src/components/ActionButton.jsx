import React from 'react'; // <-- DEBE ESTAR
import { ChevronRight } from 'lucide-react';

// Mapeo explícito de colores para que Tailwind no se confunda.
const colorMap = {
  primary: { border: 'border-blue-400', bg: 'bg-blue-100', text: 'text-blue-600' },
  green: { border: 'border-green-400', bg: 'bg-green-100', text: 'text-green-600' },
  red: { border: 'border-red-400', bg: 'bg-red-100', text: 'text-red-600' },
  gray: { border: 'border-gray-400', bg: 'bg-gray-100', text: 'text-gray-600' },
};

const ActionButton = ({ icon: Icon, title, description, color, onClick }) => {
  const classes = colorMap[color] || colorMap.primary; 

  return ( // <-- EL ERROR DICE QUE ESTÁ AQUÍ
    <button
      onClick={onClick}
      className={`
        flex items-center justify-between p-4 mb-3 rounded-xl 
        bg-white shadow-md border-l-4 ${classes.border}
        hover:bg-gray-50 transition-colors w-full
      `}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${classes.bg} ${classes.text} mr-4`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <div className="text-left">
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight className="text-gray-400" size={20} />
    </button>
  );
};

export default ActionButton;