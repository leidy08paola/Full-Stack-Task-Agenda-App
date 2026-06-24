import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Registro from './pages/Registro'; // 👈 Asegúrate de que esta línea esté idéntica

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el Inicio de Sesión */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para el Formulario de Registro */}
        <Route path="/registro" element={<Registro />} />
        
        {/* Ruta para la Agenda Principal */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Redirección automática si escriben cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;