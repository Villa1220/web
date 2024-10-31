import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './User.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    // Lógica para el manejo del registro (validación y llamada al backend)
    console.log('Name:', name, 'Email:', email, 'Password:', password);
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Crear Cuenta</h2>
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
        <button type="submit" className="register-button">Registrarse</button>
      </form>
      <p className="login-link">
        ¿Ya tienes una cuenta? <Link to="/user">Inicia Sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;
