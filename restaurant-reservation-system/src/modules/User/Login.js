import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './User.css';
import BASE_URL from '../../config';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext'; // Importa el contexto

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Obtiene la función para establecer el usuario

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token); // Guarda el token en localStorage
      setUser({ email: email, name: response.data.name }); // Guarda el usuario en el contexto
      navigate('/user'); // Redirige a la página de usuario
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
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
        <button type="submit" className="login-button">Ingresar</button>
      </form>
      <p className="register-link">
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;
