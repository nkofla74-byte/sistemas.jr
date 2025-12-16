import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css' // Importamos los estilos globales que configuramos antes

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Configuración del Router:
      Agregamos la propiedad 'future' con los flags en 'true' 
      para eliminar las advertencias de la consola sobre la v7.
    */}
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)