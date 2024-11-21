import React, { useEffect, useState, } from 'react';
import { getFromLocalStorage, removeFromLocalStorage } from '../services/LocalStorageService'; 
import * as XLSX from 'xlsx';

function Registro() {
  const [registros, setRegistros] = useState([]);
  const [totalDia, setTotalDia] = useState(0);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  
  
  // Obtener usuario activo y registros del usuario cuando se carga el componente
  useEffect(() => {
    const usuario = getFromLocalStorage('usuarioActivo');
    if (usuario) {
      setUsuarioActivo(usuario);
      const registrosUsuario = getFromLocalStorage(`registro`) || [];

      if (Array.isArray(registrosUsuario)) {
        setRegistros(registrosUsuario);
        calcularTotalDia(registrosUsuario);
      } else {
        console.error("Formato de datos incorrecto en el registro del usuario");
      }
    }
  }, []);

  const calcularTotalDia = (registros) => {
    const total = registros.reduce((acc, registro) => acc + parseFloat(registro.total || 0), 0);
    setTotalDia(total);
  };

  

  

  // Función para exportar a archivo Excel
  const exportarExcel = () => {
    const datos = registros.map((registro) => ({
      Mesa: registro.mesa,
      fechaHora: new Date().toLocaleString(),
      Producto: registro.productos.map((p) => `${p.cantidad} ${p.producto}`).join(', '),
      Total: registro.total
    }));
    

    datos.push({
      Mesa: '',
      Fecha: '',
      Hora: 'Total del Día',
      Producto: '',
      Total: totalDia.toFixed(2)
    });

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros');
    XLSX.writeFile(workbook, `registro_ventas_${usuarioActivo}.xlsx`);
  };

  const imprimirPlanilla = () => {
    window.print();
  };

  const imprimirTicketMesa = (registro) => {
    const ticketWindow = window.open('', '_blank');
    ticketWindow.document.write(`
      <html>
  <head>
    <title>Ticket Mesa ${registro.mesa}</title>
    <style>
      body {
        font-family: "Courier New", Courier, monospace;
        font-size: 12px;
        margin: 0;
        padding: 10px;
        width: 200px; /* Ancho típico de una impresora térmica */
      }
      h1, h2, p {
        text-align: center;
        margin: 5px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        text-align: left;
        padding: 4px 0;
      }
      th {
        border-bottom: 1px dashed #000;
        padding:4px
      }
      td {
        
      }
      .total {
        font-weight: bold;
        border-top: 1px dashed #000;
        margin-top: 5px;
      }
      .footer {
        text-align: center;
        margin-top: 10px;
        font-size: 10px;
      }
    </style>
  </head>
  <body>
    <h1>RESTAURANTE XYZ</h1>
    <p>Mesa: ${registro.mesa}</p>
    <p>Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
    <hr />
    <table>
      <thead>
        <tr>
          <th>Cant</th>
          <th>Producto</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${registro.productos
          .map(
            (producto) => `
              <tr>
                <td>${producto.cantidad}</td>
                <td>${producto.producto}</td>
                <td>$${(producto.cantidad * parseFloat(producto.precio || 0)).toFixed(2)}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
    <hr />
    <h2 class="total">Total: $${registro.productos
      .reduce((sum, producto) => sum + producto.cantidad * parseFloat(producto.precio || 0), 0)
      .toFixed(2)}</h2>
    <p class="footer">¡Gracias por su preferencia!</p>
    <p class="footer"></p>
    <p class="footer">Visítanos pronto</p>
  </body>
</html>


      
    `);
    ticketWindow.document.close();
    ticketWindow.print();
  };

  const cerrarDia = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar el día y borrar todos los registros?")) {
      exportarExcel();
      setRegistros([]);
      setTotalDia(0);
      removeFromLocalStorage(`registro`);
    }
  };

  if (!usuarioActivo) {
    return <p className="text-gray-600 text-center">No hay usuario activo.</p>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg max-w-md">
      <h1 className='font-semibold'>Ventas del día: </h1>
      <p className=' mx-auto text-lg-100 text-center text-violet-600'>{usuarioActivo}</p>
      {registros.length > 0 ? (
        <div className="flex flex-col p-5 gap-6">
          <div className="flex flex-wrap  gap-4">
            {registros.map((registro, index) => (
              <div key={index} className="registro-item border  border-gray-300 p-4 rounded-lg shadow-md bg-white w-1/3">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Mesa {registro.mesa}</h2>
                <p className="text-gray-600 mb-2"> {registro.fechaHora}</p>
                <ul className="list-disc list-inside mb-2">
                  {registro.productos.map((producto, i) => (
                    <li key={i} className="mb-1 text-gray-700">
                      {producto.cantidad} {producto.producto} - ${parseFloat(producto.cantidad * producto.precio).toFixed(2)}
                    </li>
                  ))}
                  
                
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">Total: ${parseFloat(registro.total).toFixed(2)}</h3>
                <button
                  onClick={() => imprimirTicketMesa(registro)}
                  className="bg-violet-500 text-white p-2 rounded hover:bg-violet-600 transition mt-2"
                >
                  Imprimir Ticket
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No hay registros aún para el usuario {usuarioActivo.nombre}.</p>
      )}

      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold text-green-800">Total del Día: ${totalDia.toFixed(2)}</h2>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={exportarExcel}
          className="bg-green-500 text-white p-2 rounded flex items-center hover:bg-green-600 transition w-32"
        >
          <i className="fas fa-file-excel mr-2"></i> Exportar a Excel
        </button>

        <button
          onClick={imprimirPlanilla}
          className="bg-red-500 text-white p-2 rounded flex items-center hover:bg-red-900 transition w-32"
        >
          <i className="fas fa-print mr-2"></i> Imprimir Planilla
        </button>

        <button
          onClick={cerrarDia}
          className="bg-red-500 text-white p-2 rounded flex items-center hover:bg-red-900 transition w-32"
        >
          <i className="fas fa-times-circle mr-2"></i> Cerrar Día
        </button>
      </div>
    </div>
  );
}

export default Registro;
