import React, { useState, useEffect, useCallback } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/LocalStorageService';
import { FaEdit, FaTrash, FaPlus, FaCheck } from 'react-icons/fa'; // Importando íconos

const CATEGORIES = ["Pizzas", "Carnes", "Sandwiches", "Tragos", "Bebidas", "Bebidas con Alcohol", "Guarniciones", "Cafeteria"];

function Ventas() { 
  const [productos, setProductos] = useState([]);
  const [mesa, setMesa] = useState('');
  const [ordenes, setOrdenes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [totalesMesa, setTotalesMesa] = useState({});
  const [registro, setRegistro] = useState([]);
  const [cantidades, setCantidades] = useState(1); // State to track quantity

  useEffect(() => {
    const storedProducts = getFromLocalStorage('productos');
    if (storedProducts) {
      setProductos(storedProducts);
    }

    const storedOrdenes = getFromLocalStorage('ordenes');
    if (storedOrdenes) {
      setOrdenes(storedOrdenes);
    }

    const storedRegistro = getFromLocalStorage('registro');
    if (storedRegistro) {
      setRegistro(storedRegistro);
    }
  }, []);

  const calcularTotales = useCallback(() => {
    const nuevosTotales = {};
    Object.keys(ordenes).forEach((mesa) => {
      const total = ordenes[mesa]?.reduce((acc, producto) => acc + parseFloat(producto.precio) * producto.cantidad, 0) || 0; // Adjusted to calculate total with quantity
      nuevosTotales[mesa] = total;
    });
    setTotalesMesa(nuevosTotales);
  }, [ordenes]);

  useEffect(() => {
    calcularTotales();
  }, [ordenes, calcularTotales]);

  const agregarProducto = (producto) => {
    if (!mesa) {
      alert("Por favor ingresa un número de mesa.");
      return;
    }
    const cantidad = cantidades[producto.producto] || 1;;
    const productoConCantidad = {...producto, cantidad};
    const nuevaOrden = ordenes[mesa] ? [...ordenes[mesa], productoConCantidad] : [productoConCantidad];
    const nuevasOrdenes = { ...ordenes, [mesa]: nuevaOrden };
    setOrdenes(nuevasOrdenes);
    saveToLocalStorage('ordenes', nuevasOrdenes);
    setCantidades((prev) => ({...prev, [producto.producto]:1}))
  };

  const eliminarProducto = (mesa, index) => {
    const nuevaOrden = ordenes[mesa].filter((_, i) => i !== index);
    const nuevasOrdenes = { ...ordenes, [mesa]: nuevaOrden };
    setOrdenes(nuevasOrdenes);
    saveToLocalStorage('ordenes', nuevasOrdenes);
  };

  const editarProducto = (mesa, index) => {
    const productoAEditar = ordenes[mesa][index];
    const nuevoProducto = window.prompt('Nuevo nombre del producto', productoAEditar.producto);
    const nuevoPrecio = window.prompt('Nuevo precio del producto', productoAEditar.precio);
    const nuevaCategoria = window.prompt('Nueva categoría', productoAEditar.categoria);
    const nuevaCantidad = window.prompt('Nueva cantidad', productoAEditar.cantidad);

    const nuevaOrden = ordenes[mesa].map((p, i) =>
      i === index ? { producto: nuevoProducto, precio: nuevoPrecio, categoria: nuevaCategoria, cantidad: nuevaCantidad } : p
    );
    const nuevasOrdenes = { ...ordenes, [mesa]: nuevaOrden };
    setOrdenes(nuevasOrdenes);
    saveToLocalStorage('ordenes', nuevasOrdenes);
  };

  const cerrarMesa = (mesa) => {
    const mesaCerrada = { 
      mesa, 
      productos: ordenes[mesa], 
      total: totalesMesa[mesa], 
      fechaHora: new Date().toLocaleString() 
    };
    const nuevoRegistro = [...registro, mesaCerrada];
    
    setRegistro(nuevoRegistro);
    saveToLocalStorage('registro', nuevoRegistro);

    const nuevasOrdenes = { ...ordenes };
    delete nuevasOrdenes[mesa];  
    setOrdenes(nuevasOrdenes);
    saveToLocalStorage('ordenes', nuevasOrdenes);
  };
  

  return (
    <div className="container mx-auto p-4 bg-white  rounded  shadow-lg max-w-2xl">
      <h1 className='p-2 rounded font-semibold'>Ventas</h1>
      
      <label className="block mb-2">Número de Mesa:</label>
      <input
        type="text"
        placeholder="Número de mesa"
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
        className="border border-gray-300 p-2 mb-4 w-full"
      />

      <h2 className="text-xl font-semibold mb-2">Seleccionar Productos</h2>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border border-gray-300 p-2 mb-4 w-full"
      >
        <option value="">Selecciona una categoría</option>
        {CATEGORIES.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>

      {selectedCategory && (
        <div>
          <h3 className="text-lg font-semibold mb-2">{selectedCategory}</h3>
          <table className="container min-w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <thead>
              <tr className=" bg-violet-200 ">
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Producto</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Precio</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Cantidad</th>
                <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-medium text-gray-700">Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos
                .filter((p) => p.categoria === selectedCategory)
                .map((p, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors">
                    <td className="border border-gray-100 p-2">{p.producto}</td>
                    <td className="border border-gray-100 p-2">{p.precio}</td>
                    <td className="border  p-2">
                    <input
                        type="number"
                        min="1"
                        value={cantidades[p.producto] || 1}
                        onChange={(e) => setCantidades({ ...cantidades, [p.producto]: parseInt(e.target.value) })}
                        className="border border-gray-100 p-1 w-16"
                      />
                    </td>
                    <td className="border  p-2">
                    <button
                        onClick={() => agregarProducto(p)}
                        className="bg-violet-600 text-white p-1 rounded hover:bg-violet-500 transition flex items-center justify-center"
                      >
                        <FaPlus className="mr-1" /> 
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 p-2 rounded">Órdenes por Mesa</h2>
      <div className="flex flex-wrap justify-start">
        {Object.keys(ordenes).map((mesa) => (
          <div 
            key={mesa} 
            className="border border-gray-300 p-2 m-1 rounded-lg shadow-lg flex flex-col" 
            style={{ minWidth: '16rem', maxWidth: '20rem' }}
          >
            <h3 className="text-lg font-semibold mb-2 text-center p-2 rounded">Mesa {mesa}</h3>
            <div className="flex-grow  border-gray-300  overflow-auto mb-2">
              {ordenes[mesa].map((p, index) => (
                <div key={index} className="flex justify-between border-b border-gray-300 p-2">
                  <span>{p.cantidad} {p.producto}</span> {/* Displaying quantity */}
                  <span>${(p.precio * p.cantidad).toFixed(2)}</span> {/* Total price for the product */}
                  <div>
                    <button
                      onClick={() => editarProducto(mesa, index)}
                      className="bg-yellow-500 text-white p-1 rounded mr-1 hover:bg-yellow-400 transition flex items-center"
                    >
                      <FaEdit className="mr-1" />
                    </button>
                    <button
                      onClick={() => eliminarProducto(mesa, index)}
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-400 transition flex items-center"
                    >
                      <FaTrash className="mr-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Total:</span>
              <span className="font-bold">${totalesMesa[mesa]?.toFixed(2) || 0.00}</span>
            </div>
            <button
              onClick={() => cerrarMesa(mesa)}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-500 fas  transition mt-2 w-full"
            >
              
              <FaCheck className="mr-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ventas;
