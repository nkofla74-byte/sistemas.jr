import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CobradorLayout from './layouts/CobradorLayout';

// Páginas
import Home from './pages/Home';
import Ruta from './pages/Ruta';
import ListadoClientes from './pages/ListadoClientes'; 
import NuevoCliente from './pages/NuevoCliente'; 
import Perfil from './pages/Perfil';
import GestionarRuta from './pages/GestionarRuta'; // <--- IMPORTAR NUEVO

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CobradorLayout />}>
          <Route index element={<Home />} />
          <Route path="ruta" element={<Ruta />} />
          <Route path="listado-general" element={<ListadoClientes />} />
          <Route path="perfil" element={<Perfil />} />
          
          {/* NUEVA RUTA: PLANIFICADOR (Dentro del layout para mantener estilo, aunque tapa el menú con su botón) */}
          <Route path="enrutar" element={<GestionarRuta />} />
        </Route>

        <Route path="/clientes/crear" element={<NuevoCliente />} /> 
        <Route path="/creditos/nuevo" element={<NuevoCliente />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;