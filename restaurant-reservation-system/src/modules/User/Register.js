import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './User.css';
import { BASE_URL } from '../../config';
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
  const { setUser } = useContext(UserContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!name || !email || !password || !address || !phone) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^09\d{8}$/;
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

      // Validar formato de correo electrónico
      if (!emailRegex.test(email)) {
        setError('Por favor, ingresa un correo electrónico válido.');
        return;
      }

      // Validar formato de teléfono
      if (!phoneRegex.test(phone)) {
        setError('Por favor, ingresa un número de teléfono válido (Ejemplo: 0984266777).');
        return;
      }

      // Validar formato del nombre (solo letras y espacios)
      if (!nameRegex.test(name)) {
        setError('El nombre completo solo puede contener letras y espacios.');
        return;
      }

      // Enviar datos al servidor
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        name,
        email,
        password,
        address,
        phone,
      });
      alert(response.data.message);

      // Iniciar sesión automáticamente después del registro
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = loginResponse.data;

      if (!token || !user) {
        throw new Error("No se encontró el token o los datos del usuario en la respuesta.");
      }

      localStorage.setItem('token', token);
      setUser({ email: user.email, role: user.role });

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
            placeholder="Ingresa tu nombre completo"
            required
            pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
            title="El nombre solo puede contener letras y espacios."
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@dominio.com"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Ingresa un correo electrónico válido."
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crea una contraseña segura"
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
            placeholder="Ingresa tu dirección"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ingrese un número de teléfono"
            required
            pattern="09\d{8}"
            title="Ingresa un número de teléfono ecuatoriano válido. Ejemplo: 0984266777."
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
