import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from './components/login';
import MainMenu from './components/mainmenu';
import Productos from './components/productos';
import Ventas from './components/ventas';
import Registro from './components/registro';
import Proveedores from './components/provedores';
import Usuarios from './components/usuarios';
import { getFromLocalStorage } from './services/LocalStorageService';
import './App.css';

function App() {
  const location = useLocation();
  const [usuarioActivo, setUsuarioActivo] = useState('');

  useEffect(() => {
    // Cargar el usuario activo desde el LocalStorage
    const usuario = getFromLocalStorage('usuarioActivo');
    if (usuario) {
      setUsuarioActivo(usuario); // Si existe, setea el usuario como activo
    }
  }, []);

  // Redirigir a /menu si el usuario está autenticado, de lo contrario a /login
  return (
    <div className="flex">
      {/* Mostrar nav solo si el usuario está autenticado */}
      {usuarioActivo && location.pathname !== '/login' && (
        <nav className="bg-violet-700 h-screen w-64 p-4 shadow-lg">
          <p className="text-white font-semibold mb-4">Usuario: {usuarioActivo}</p>
          <ul>
            <li>
              <Link to="/menu" className="flex items-center text-white p-2 rounded">
                <i className="fas fa-handshake mr-2"></i> Bienvenida
              </Link>
            </li>
            <li>
              <Link to="/ventas" className="flex items-center text-white p-2 rounded">
                <i className="fas fa-receipt mr-2"></i> Ventas
              </Link>
            </li>
            <li>
              <Link to="/registro" className="flex items-center text-white p-2 rounded">
                <i className="fas fa-history mr-2"></i> Registro
              </Link>
            </li>
            <li>
              <Link to="/productos" className="flex items-center text-white p-2 rounded">
                <i className="fas fa-box-open mr-2"></i> Productos
              </Link>
            </li>
            <li>
              <Link to="/provedores" className="flex items-center text-white p-2 rounded">
                <i className="fas fa-truck mr-2"></i> Proveedores
              </Link>
            </li>
            <li>
              <Link to="/usuarios" className="flex items-center text-white p-2 rounded">
                <i className="fas fa-user mr-2"></i> Usuarios
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <div className="flex-1">
        <Routes>
          {/* Si el usuario no está autenticado, redirigir al login */}
          <Route path="/" element={usuarioActivo ? <Navigate to="/menu" /> : <Login />} />
          <Route path="/login" element={usuarioActivo ? <Navigate to="/menu" /> : <Login />} />
          
          {/* Rutas protegidas: solo accesibles si el usuario está autenticado */}
          <Route path="/menu" element={usuarioActivo ? <MainMenu /> : <Navigate to="/login" />} />
          <Route path="/productos" element={usuarioActivo ? <Productos /> : <Navigate to="/login" />} />
          <Route path="/ventas" element={usuarioActivo ? <Ventas /> : <Navigate to="/login" />} />
          <Route path="/registro" element={usuarioActivo ? <Registro /> : <Navigate to="/login" />} />
          <Route path="/provedores" element={usuarioActivo ? <Proveedores /> : <Navigate to="/login" />} />
          <Route path="/usuarios" element={usuarioActivo ? <Usuarios /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
