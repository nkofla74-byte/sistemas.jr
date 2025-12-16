import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos el Layout
import CobradorLayout from './layouts/CobradorLayout';

// Importamos las Páginas
import Home from './pages/Home';
import Ruta from './pages/Ruta';
import Clientes from './pages/Clientes';
import Perfil from './pages/Perfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Usamos el Layout como "padre" de todas las rutas */}
        <Route path="/" element={<CobradorLayout />}>
          <Route index element={<Home />} />
          <Route path="ruta" element={<Ruta />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;