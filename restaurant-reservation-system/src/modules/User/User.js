import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext'; 

const User = () => {
  const { user } = useContext(UserContext); 
  return (
    <div>
      <h1>Bienvenido, {user ? user.name : 'Usuario'}</h1>
      <p>Administra tus datos y tus reservas desde aquí.</p>
    </div>
  );
};

export default User;
