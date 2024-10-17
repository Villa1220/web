import React, { useState } from 'react';
import './Menu.css'; 
import menu1 from '../../images/menu1.png';
import menu2 from '../../images/menu2.png';
import menu3 from '../../images/menu3.png';
import menu4 from '../../images/menu4.png';

const Menu = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState('');

  const menuItems = [
    { image: menu1, description: 'Descripción del plato 1' },
    { image: menu2, description: 'Descripción del plato 2' },
    { image: menu3, description: 'Descripción del plato 3' },
    { image: menu4, description: 'Descripción del plato 4' },
  ];

  const openModal = (image, description) => {
    setSelectedImage(image);
    setSelectedDescription(description);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
    setSelectedDescription('');
  };

  return (
<div className="menu-container">
  <h1 className="home-title">Menú</h1>
  <p className="home-description">Explora nuestra variedad de platos y elige tus favoritos.</p>
  <div className="menu-grid">
    {menuItems.map((item, index) => (
      <div key={index} className="menu-item" onClick={() => openModal(item.image, item.description)}>
        <img src={item.image} alt={`Plato ${index + 1}`} className="menu-image" />
      </div>
    ))}
  </div>

  {modalIsOpen && (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal">
        <h2>Descripción del Plato</h2>
        {selectedImage && <img src={selectedImage} alt="Plato seleccionado" className="modal-image" />}
        <p>{selectedDescription}</p>
        <button onClick={closeModal}>Cerrar</button>
      </div>
    </div>
  )}
</div>
  );
};

export default Menu;
