
import React, { useEffect, useState } from 'react';
import { getFromLocalStorage, } from '../services/LocalStorageService'; // Importa la función para remover del localStorage

function MainMenu() {
  const [ usuarioActivo, setUsername] = useState('');

  useEffect(() => {
    const usuarioActivo = getFromLocalStorage('usuarioActivo');
    if (usuarioActivo) {
      setUsername(usuarioActivo);
    }
    
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        <h1 className="text-3xl font-bold mb-4 text-gray-700">
          Bienvenido a la Aplicación 
        </h1>
        <p className='text-lg text-red-600 rounded font-semibold'>{usuarioActivo}</p>
        <p className="text-lg text-gray-600">
          Selecciona una opción del menú para comenzar.
        </p>
      </div>
    </div>
  );
}

export default MainMenu;
