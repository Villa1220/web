import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext'; // Importa el contexto

const User = () => {
  const { user } = useContext(UserContext); // Obtiene el usuario del contexto

  return (
    <div>
      <h1>Bienvenido, {user ? user.name : 'Usuario'}</h1>
      <p>Administra tus datos y tus reservas desde aquí.</p>
    </div>
  );
};

export default User;
