import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Router, useLocation } from 'react-router-dom';
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
  const [usuarioActivo, setUsername] = useState('');

  useEffect(() => {
    const usuarioActivo = getFromLocalStorage('usuarioActivo');
    if (usuarioActivo) {
      setUsername(usuarioActivo);
    }
  }, []);

  return (
    <Router basename="/bar-app"> {/* Añade el basename aquí */}
      <div className=''>
        {location.pathname !== '/' && (
          <nav className="bg-violet-700 h-full w-64 p-4 top-0 left-0 shadow-lg">
            <p className='text-white rounded font-semibold'>Usuario: {usuarioActivo}</p>
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
                  <i className="fas fa-truck mr-2"></i> Provedores
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

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<MainMenu />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/provedores" element={<Proveedores />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;