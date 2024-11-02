import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './User.css';
import { BASE_URL, IMAGE_URL } from '../../config';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Usar el contexto del usuario

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        name,
        email,
        password,
        address,
        phone,
      });
      alert(response.data.message); // Muestra un mensaje de éxito

      // Ahora inicia sesión automáticamente
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = loginResponse.data;

      // Verifica si el token y los datos de usuario están en la respuesta
      if (!token || !user) {
        throw new Error("No se encontró el token o los datos del usuario en la respuesta.");
      }

      // Guarda el token en localStorage y el usuario en el contexto
      localStorage.setItem('token', token);
      setUser({ email: user.email, role: user.role });

      // Redirige a la página principal
      navigate('/');
    } catch (err) {
      setError('Error al registrarse o iniciar sesión');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Crear Cuenta</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <label htmlFor="name">Nombre Completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-button">Registrarse</button>
      </form>
      <p className="login-link">
        ¿Ya tienes una cuenta? <Link to="/user">Inicia Sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;
