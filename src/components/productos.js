import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { saveToLocalStorage, getFromLocalStorage } from '../services/LocalStorageService';

const CATEGORIES = ["Pizzas", "Carnes", "Sandwiches", "Tragos", "Bebidas", "Bebidas con Alcohol", "Guarniciones", "Cafeteria"];

function Productos() {
  const [producto, setProducto] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
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

    const nuevoProducto = { id: Date.now(), producto, precio, categoria }; // Agregamos un id único
    const updatedProductos = [...productos, nuevoProducto];
    setProductos(updatedProductos);
    saveToLocalStorage('productos', updatedProductos);
    setProducto('');
    setPrecio('');
    setCategoria('');
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const updatedProductos = productos.filter((p) => p.id !== id); // Usamos el id único para eliminar
      setProductos(updatedProductos);
      saveToLocalStorage('productos', updatedProductos);
    }
  };

  const editarProducto = (id) => {
    const productoAEditar = productos.find((p) => p.id === id); // Encontramos el producto por su id
    if (!productoAEditar) return;

    const nuevaCategoria = window.prompt('Nueva categoría', productoAEditar.categoria);

    if (!nuevaCategoria) {
      alert('La categoría no puede estar vacía');
      return;
    }

    if (window.prompt('Ingrese la contraseña') === 'pericobar') {
      const nuevoProducto = window.prompt('Nuevo nombre del producto', productoAEditar.producto);
      const nuevoPrecio = window.prompt('Nuevo precio del producto', productoAEditar.precio);

      if (!nuevoProducto || !nuevoPrecio) {
        alert('El nombre del producto y el precio no pueden estar vacíos.');
        return;
      }

      const productosActualizados = productos.map((p) =>
        p.id === id ? { ...p, producto: nuevoProducto, precio: nuevoPrecio, categoria: nuevaCategoria } : p
      );
      setProductos(productosActualizados);
      saveToLocalStorage('productos', productosActualizados);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg max-w-md">
      <div className="product-input-section mb-5">
        <h1 className='rounded font-semibold'>Productos</h1>
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
            onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Selecciona una categoría</option>
            {CATEGORIES.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            onClick={agregarProducto} 
            className="bg-violet-600 text-white p-2 rounded-md shadow  transition  duration-200"
          >
            Agregar Producto
          </button>
        </div>
      </div>

      <h2 className="text-violet-600 m-10 p-2  max-w-xs mx-auto mb-10 text-center rounded font-semibold ">
  Lista de Productos
</h2>
      {CATEGORIES.map((cat) => (
        <div key={cat} className="mb-4">
          {/* Cambiamos el estilo del encabezado de la categoría */}
          <h3 className="text-lg font-semibold text-black">
              
            {cat}
          </h3>
          <table className="container min-w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <thead className="bg-gray-200 rounded-t-md">
              <tr>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Producto</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Precio</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Acciones</th>
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
                        className="bg-yellow-500 text-white p-1 rounded-md shadow hover:bg-yellow-600 transition duration-200 mr-2"
                        onClick={() => editarProducto(p.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-500 text-white p-1 rounded-md shadow hover:bg-red-600 transition duration-200"
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
    </div>
  );
}

export default Productos;
