import React from 'react';
import { Link } from 'react-router-dom';
import './Reservation.css';

const Reservations = () => {
  return (
    <div className="reservations-container">

      <div className="promo-message">
        <h2>SI QUIERES RESERVAR</h2>
        <h2>¡¡¡ Regístrate ya para poder usar nuestros servicios !!!</h2>
        <Link to="/register">
          <button className="register-button">Regístrate</button>
        </Link>
      </div>
      
    </div>
  );
};

export default Reservations;
