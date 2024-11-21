import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFromLocalStorage, saveToLocalStorage } from '../services/LocalStorageService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [registerData, setRegisterData] = useState({
    userNumber: '',
    fullName: '',
    newUsername: '',
    phoneNumber: '',
    newPassword: '',
    role: 'Usuario',
  });
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = getFromLocalStorage('users') || [];
    const foundUser = users.find(user => user.newUsername === username);

    if (foundUser) {
      if (foundUser.newPassword === password) {
        saveToLocalStorage('usuarioActivo', foundUser.fullName);
        navigate('/menu');
      } else {
        alert('Contraseña incorrecta');
      }
    } else {
      alert('Usuario no encontrado');
    }
  };

  const handleRegister = () => {
    const users = getFromLocalStorage('users') || [];

    // Verificar si los campos están completos
    const { userNumber, fullName, newUsername, phoneNumber, newPassword,  } = registerData;
    if (!userNumber || !fullName || !newUsername || !phoneNumber || !newPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Verificar si el nombre de usuario ya está en uso
    if (users.some(user => user.newUsername === newUsername)) {
      alert('El nombre de usuario ya está en uso.');
      return;
    }

    // Añadir el nuevo usuario y guardar en localStorage
    users.push(registerData);
    saveToLocalStorage('users', users);
    setShowModal(false);
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
  };

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-violet-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center mb-4">Bienvenido</h1>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
        />
        

        <button
          onClick={handleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300 mb-2"
        >
          Login
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Registrarse
        </button>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4">Registro</h2>

              <input
                type="text"
                name="userNumber"
                placeholder="Número de Usuario"
                value={registerData.userNumber}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="newUsername"
                placeholder="Confirmar Nombre de Usuario"
                value={registerData.newUsername}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="fullName"
                placeholder="Nombre Completo"
                value={registerData.fullName}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              
              <input
                type="text"
                name="phoneNumber"
                placeholder="Número de Teléfono"
                value={registerData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="Contraseña"
                value={registerData.newPassword}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <select
                name="role"
                value={registerData.role}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="Usuario">Usuario</option>
                <option value="Administrador">Administrador</option>
              </select>

              <button
                onClick={handleRegister}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 mb-2"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
