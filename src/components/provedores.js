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

  useEffect(() => {
    const storedProveedores = getFromLocalStorage('proveedores');
    if (storedProveedores) {
      setProveedores(storedProveedores);
    }
  }, []);

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

  const editarProveedor = (index) => {
    const proveedor = proveedores[index];
    setNombre(proveedor.nombre);
    setContacto(proveedor.contacto);
    setProducto(proveedor.producto);
    setCosto(proveedor.costo);
    setCantidad(proveedor.cantidad);
    setEditIndex(index);
  };

  // Calcular el total por fila (costo × cantidad)
  const calcularTotalFila = (costo, cantidad) => {
    return parseFloat(costo || 0) * parseFloat(cantidad || 0);
  };

  // Calcular el total general (suma de todos los totales por fila)
  const calcularTotalGeneral = () => {
    return proveedores.reduce((total, proveedor) => {
      return total + calcularTotalFila(proveedor.costo, proveedor.cantidad);
    }, 0);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg max-w-md">
      <h1 className="rounded font-semibold">Gestión de Proveedores</h1>

      <form onSubmit={manejarSubmit} className="product-input-section mb-5">
        <div className="mb-5">
          <input
            type="text"
            placeholder="Nombre del Proveedor"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Contacto"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Producto"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Costo por Producto"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-violet-600 text-white p-2 rounded-md shadow transition duration-200"
        >
          {editIndex !== null ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
        </button>
      </form>

      <h2 className="text-violet-600 m-10 p-2 max-w-xs mx-auto mb-10 text-center rounded font-semibold">
        Lista de Proveedores
      </h2>
      {proveedores.length > 0 ? (
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
                <td className="border border-gray-300 p-3">{proveedor.nombre}</td>
                <td className="border border-gray-300 p-3">{proveedor.contacto}</td>
                <td className="border border-gray-300 p-3">{proveedor.producto}</td>
                <td className="border border-gray-300 p-3">{proveedor.costo} $</td>
                <td className="border border-gray-300 p-3">{proveedor.cantidad}</td>
                <td className="border border-gray-300 p-3">
                  {calcularTotalFila(proveedor.costo, proveedor.cantidad)} $
                </td>
                <td className="border border-gray-300 p-3">
                  <button
                    onClick={() => editarProveedor(index)}
                    className="bg-violet-500 text-white p-1 rounded-md shadow hover:bg-violet-200 transition duration-200 mr-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => eliminarProveedor(index)}
                    className="bg-violet-500 text-white p-1 rounded-md shadow hover:bg-violet-200 transition duration-200"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700">No hay proveedores registrados.</p>
      )}

      <h3 className="text-xl font-semibold text-red-800">
        Total General: {calcularTotalGeneral()} $
      </h3>
    </div>
  );
};

export default Proveedores;
