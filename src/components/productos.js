import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { saveToLocalStorage, getFromLocalStorage } from '../services/LocalStorageService';

const CATEGORIES = ["Pizzas", "Carnes", "Sandwiches", "Tragos", "Bebidas", "Bebidas con Alcohol", "Guarniciones", "Cafeteria"];

function Productos() {
  const [producto, setProducto] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [productos, setProductos] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // Producto en edición
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' }); // Credenciales del administrador
  const [showCredentialModal, setShowCredentialModal] = useState(false); // Modal para credenciales

  useEffect(() => {
    // Cargar productos desde localStorage
    const storedProducts = getFromLocalStorage('productos');
    if (storedProducts) {
      setProductos(storedProducts);
    }
  }, []);

  const agregarProducto = () => {
    if (!producto || !precio || !categoria) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const nuevoProducto = { id: Date.now(), producto, precio, categoria };
    const updatedProductos = [...productos, nuevoProducto];
    setProductos(updatedProductos);
    saveToLocalStorage('productos', updatedProductos);
    setProducto('');
    setPrecio('');
    setCategoria('');
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const updatedProductos = productos.filter((p) => p.id !== id);
      setProductos(updatedProductos);
      saveToLocalStorage('productos', updatedProductos);
    }
  };

  const abrirModalCredenciales = (producto) => {
    setEditingProduct(producto);
    setShowCredentialModal(true);
  };

  const verificarCredenciales = () => {
    const { username, password } = adminCredentials;
    const users = getFromLocalStorage('users');

    const adminUser = users?.find(
      (user) =>
        user.newUsername === username &&
        user.newPassword === password &&
        user.role === 'Administrador'
    );

    if (adminUser) {
      setShowCredentialModal(false);
    } else {
      alert('Credenciales incorrectas o no tienes permisos de administrador.');
      setEditingProduct(null);
    }
  };

  const guardarEdicion = () => {
    if (!editingProduct.producto || !editingProduct.precio || !editingProduct.categoria) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const updatedProductos = productos.map((p) =>
      p.id === editingProduct.id ? editingProduct : p
    );
    setProductos(updatedProductos);
    saveToLocalStorage('productos', updatedProductos);
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg max-w-md">
      <div className="product-input-section mb-5">
        <h1 className="rounded font-semibold">Productos</h1>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Nombre del producto"
            className="p-2 border rounded-md shadow focus:outline-none focus:ring focus:ring-blue-500"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio del producto"
            className="p-2 border rounded-md shadow focus:outline-none focus:ring focus:ring-blue-500"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <select
            className="p-2 border rounded-md shadow focus:outline-none focus:ring focus:ring-blue-500"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIES.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={agregarProducto}
            className="bg-violet-600 text-white p-2 rounded-md shadow transition duration-200"
          >
            Agregar Producto
          </button>
        </div>
      </div>

      <h2 className="text-violet-600 m-10 p-2 max-w-xs mx-auto mb-10 text-center rounded font-semibold">
        Lista de Productos
      </h2>
      {CATEGORIES.map((cat) => (
        <div key={cat} className="mb-4">
          <h3 className="text-lg font-semibold text-black">{cat}</h3>
          <table className="container min-w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <thead className="bg-gray-200 rounded-t-md">
              <tr>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">
                  Producto
                </th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">
                  Precio
                </th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {productos
                .filter((p) => p.categoria === cat)
                .map((p) => (
                  <tr key={p.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="py-3 px-4 border-b border-gray-200">{p.producto}</td>
                    <td className="py-3 px-4 border-b border-gray-200">{p.precio}</td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      <button
                        className="bg-violet-500 text-white p-1 rounded-md shadow hover:bg-violet-200 transition duration-200 mr-2"
                        onClick={() => abrirModalCredenciales(p)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-violet-500 text-white p-1 rounded-md shadow hover:bg-violet-200 transition duration-200"
                        onClick={() => eliminarProducto(p.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Modal de credenciales */}
      {showCredentialModal && (
        <div className="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="modal-content bg-white p-4 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Validar Administrador</h2>
            <input
              type="text"
              placeholder="Nombre de usuario"
              className="p-2 border rounded-md shadow mb-2 w-full"
              value={adminCredentials.username}
              onChange={(e) =>
                setAdminCredentials({ ...adminCredentials, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="p-2 border rounded-md shadow mb-4 w-full"
              value={adminCredentials.password}
              onChange={(e) =>
                setAdminCredentials({ ...adminCredentials, password: e.target.value })
              }
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-violet-500 text-white px-4 py-2 rounded shadow"
                onClick={verificarCredenciales}
              >
                Verificar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded shadow"
                onClick={() => {
                  setShowCredentialModal(false);
                  setEditingProduct(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingProduct && !showCredentialModal && (
        <div className="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="modal-content bg-white p-4 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Editar Producto</h2>
            <input
              type="text"
              placeholder="Nombre del producto"
              className="p-2 border rounded-md shadow mb-2 w-full"
              value={editingProduct.producto}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, producto: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Precio del producto"
              className="p-2 border rounded-md shadow mb-2 w-full"
              value={editingProduct.precio}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, precio: e.target.value })
              }
            />
            <select
              className="p-2 border rounded-md shadow mb-4 w-full"
              value={editingProduct.categoria}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, categoria: e.target.value })
              }
            >
              {CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-violet-500 text-white px-4 py-2 rounded shadow"
                onClick={guardarEdicion}
              >
                Guardar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 p-8 rounded shadow"
                onClick={() => setEditingProduct(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
