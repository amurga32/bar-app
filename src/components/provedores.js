import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/LocalStorageService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [producto, setProducto] = useState('');
  const [costo, setCosto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de edición
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Modal de autenticación
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [totalGeneral, setTotalGeneral] = useState(0); // Estado para el total general

  useEffect(() => {
    const storedProveedores = getFromLocalStorage('proveedores');
    if (storedProveedores) {
      setProveedores(storedProveedores);
    }
  }, []);

  useEffect(() => {
    // Calcular el total general cada vez que se actualizan los proveedores
    const total = proveedores.reduce((acc, proveedor) => {
      return acc + parseFloat(proveedor.costo || 0) * parseFloat(proveedor.cantidad || 0);
    }, 0);
    setTotalGeneral(total);
  }, [proveedores]);

  const guardarProveedores = (proveedores) => {
    saveToLocalStorage('proveedores', proveedores);
    setProveedores(proveedores);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    const nuevoProveedor = { nombre, contacto, producto, costo, cantidad };

    if (editIndex !== null) {
      const updatedProveedores = [...proveedores];
      updatedProveedores[editIndex] = nuevoProveedor;
      guardarProveedores(updatedProveedores);
      setEditIndex(null);
      setIsModalOpen(false); // Cerrar el modal de edición
    } else {
      guardarProveedores([...proveedores, nuevoProveedor]);
    }

    setNombre('');
    setContacto('');
    setProducto('');
    setCosto('');
    setCantidad('');
  };

  const eliminarProveedor = (index) => {
    const updatedProveedores = proveedores.filter((_, i) => i !== index);
    guardarProveedores(updatedProveedores);
  };

  const abrirModalAutenticacion = (index) => {
    setEditIndex(index); // Guardar el índice del proveedor a editar
    setIsAuthModalOpen(true); // Abrir el modal de autenticación
  };

  const verificarCredenciales = () => {
    const users = getFromLocalStorage('users');
    const user = users?.find((u) => u.newUsername === username && u.newPassword === password);

    if (user && user.role === 'Administrador') {
        setIsAuthModalOpen(false); // Cerrar el modal de autenticación
        setIsModalOpen(true); // Abrir el modal de edición
        const proveedor = proveedores[editIndex];
        setNombre(proveedor.nombre);
        setContacto(proveedor.contacto);
        setProducto(proveedor.producto);
        setCosto(proveedor.costo);
        setCantidad(proveedor.cantidad);
        setAuthError('');
    } else {
        alert('Credenciales inválidas o no tiene permisos de administrador.'); // Mostrar alerta
        
    }
};


  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg max-w-md">
      <h1 className="rounded font-semibold">Gestión de Proveedores</h1>

      <form onSubmit={manejarSubmit} className="product-input-section mb-5">
        {/* Formulario */}
        <button type="submit" className="bg-violet-600 text-white p-2 rounded-md shadow transition duration-200">
          {editIndex !== null ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
        </button>
      </form>

      <h2 className="text-violet-600 m-10 p-2 max-w-xs mx-auto mb-10 text-center rounded font-semibold">
        Lista de Proveedores
      </h2>
      {proveedores.length > 0 ? (
        <>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Nombre</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Contacto</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Producto</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Costo</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Cantidad</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Total</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((proveedor, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 border-b border-gray-200'>{proveedor.nombre}</td>
                  <td className='py-3 px-4 border-b border-gray-200'>{proveedor.contacto}</td>
                  <td className='py-3 px-4 border-b border-gray-200'>{proveedor.producto}</td>
                  <td className='py-3 px-4 border-b border-gray-200'>{proveedor.costo} $</td>
                  <td className='py-3 px-4 border-b border-gray-200'>{proveedor.cantidad}</td>
                  <td className='py-3 px-4 border-b border-gray-200'>{parseFloat(proveedor.costo || 0) * parseFloat(proveedor.cantidad || 0)} $</td>
                  <td className='py-3 px-4 border-b border-gray-200'>
                    <button onClick={() => abrirModalAutenticacion(index)} className="bg-violet-500 text-white p-1">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => eliminarProveedor(index)} className="bg-violet-500 text-white p-1">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4  text-center text-xl font-semibold text-red-800">
            <strong>Total General: {totalGeneral.toFixed(2)} $</strong>
          </div>
        </>
      ) : (
        <p className="text-gray-700">No hay proveedores registrados.</p>
      )}

      
      {/* Modal de autenticación */}
      {isAuthModalOpen && (
        <div className="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="modal-content bg-white p-4 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Validar Administrador</h2>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border rounded-md shadow mb-2 w-full"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded-md shadow mb-2 w-full"
              required
            />
            {authError && <p className="text-red-500">{authError}</p>}
            <div className="flex justify-end">
              
              <button
                onClick={verificarCredenciales}
                className="bg-violet-500 text-white p-2 rounded"
              >
                Verificar
              </button>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="mr-2 bg-red-500 text-white p-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {isModalOpen && (
        <div className="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="modal-content bg-white p-4 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Editar Proveedor</h2>
            <form onSubmit={manejarSubmit}>
              <input
                type="text"
                placeholder="Nombre del Proveedor"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="p-2 border rounded-md shadow mb-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Contacto"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                className="p-2 border rounded-md shadow mb-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Producto"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                className="p-2 border rounded-md shadow mb-2 w-full"
                required
              />
              <input
                type="number"
                placeholder="Costo"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                className="p-2 border rounded-md shadow mb-2 w-full"
                required
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="p-2 border rounded-md shadow mb-2 w-full"
                required
              />
              <div className="flex justify-end space-x-2">
              <button
                  type="submit"
                  className="bg-red-500 p-8 text-white px-4 py-2 rounded shadow"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-violet-500 p-8 text-white px-4 py-2 rounded shadow"
                >
                  Cancelar
                </button>
                
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proveedores;
