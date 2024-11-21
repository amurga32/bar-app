import React, { useEffect, useState } from 'react';
import { getFromLocalStorage, saveToLocalStorage,  } from '../services/LocalStorageService';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [historialVentas, setHistorialVentas] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const users = getFromLocalStorage('users') || [];
    console.log("Usuarios cargados:", users)
    setUsuarios(users);
  }, []);

  const obtenerHistorialVentas = (userId) => {
    const registros = getFromLocalStorage('registro') || [];
    const historial = registros.filter((registro) => registro === userId);
    setHistorialVentas(historial);
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setUsuarioSeleccionado(null);
  };

  const guardarCambios = () => {
    const nuevosUsuarios = usuarios.map((user) =>
      user.id === usuarioSeleccionado.id ? usuarioSeleccionado : user
    );
    setUsuarios(nuevosUsuarios);
    saveToLocalStorage('users', nuevosUsuarios);
    cerrarModal();
  };

  const eliminarUsuario = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      const nuevosUsuarios = usuarios.filter((user) => user.id !== id);
      setUsuarios(nuevosUsuarios);
      saveToLocalStorage('users', nuevosUsuarios);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>
      <table className="container min-w-full bg-white border border-gray-300 rounded-md shadow-lg">
        <thead className="bg-gray-200 rounded-t-md">
          <tr>
          <th className='py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700'>Nombre Completo</th>
            <th className='py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700'>Username</th>
            <th className='py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700'>Teléfono</th>
            <th className='py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700'>Rol</th>
            <th className='py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={index} className='hover:bg-gray-100 p-5 m-5 py-3 transition duration-200'>
              <td className='py-3 px-4 m-4 p-4 border-b border-gray-200 rounded-l-md'>{usuario.fullName}</td>
              <td className='py-3 px-4 m-4 p-4 border-b border-gray-200'>{usuario.newUsername}</td>
              <td className='py-3 px-4 m-4 p-4 border-b border-gray-200'>{usuario.phoneNumber}</td>
              <td className='py-3 px-4 m-4 p-4 border-b border-gray-200 rounded-r-md'>{usuario.role}</td>
              <td className='py-3 px-4 m-4 p-4 border-b border-gray-200'>
                <button
                  onClick={() => abrirModalEditar(usuario)}
                  className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarUsuario(usuario.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => obtenerHistorialVentas(usuario.id)}
                  className="bg-green-500 text-white px-4 py-1 rounded ml-2"
                >
                  Ver Historial
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para Editar Usuario */}
      {showModal && usuarioSeleccionado && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
            <label className="block mb-2">Nombre:</label>
            <input
              type="text"
              value={usuarioSeleccionado.nombre}
              onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, nombre: e.target.value })}
              className="border p-2 w-full mb-4"
            />
            <label className="block mb-2">Rol:</label>
            <input
              type="text"
              value={usuarioSeleccionado.rol}
              onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, rol: e.target.value })}
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={guardarCambios} className="bg-blue-500 text-white px-4 py-1 rounded">Guardar</button>
              <button onClick={cerrarModal} className="bg-gray-500 text-white px-4 py-1 rounded">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Historial de Ventas */}
      {historialVentas.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Historial de Ventas</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Mesa</th>
                <th className="py-2">Fecha y Hora</th>
                <th className="py-2">Productos</th>
                <th className="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {historialVentas.map((registro, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-200">
                  <td className="py-3 px-4 border-b border-gray-200">{registro.mesa}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{registro.fechaHora}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{registro.productos.map(p => `${p.producto} (x${p.cantidad})`).join(', ')}</td>
                  <td className="py-3 px-4 border-b border-gray-200">${registro.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
