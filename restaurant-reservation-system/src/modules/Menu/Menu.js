import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Menu.css'; 
import { BASE_URL, IMAGE_URL } from '../../config';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/menu`);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error al obtener los platos', error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="menu-container">
      <h1 className="home-title">Menú</h1>
      <p className="home-description">Explora nuestra variedad de platos y elige tus favoritos.</p>
      <div className="menu-grid">
        {menuItems.map((item) => (
          <div 
            key={item._id} 
            className="menu-item"
          >
            <img 
              src={IMAGE_URL + item.image} 
              alt={item.name} 
              className="menu-image" 
            />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p><strong>Precio: ${Number(item.price).toFixed(2)}</strong></p> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
