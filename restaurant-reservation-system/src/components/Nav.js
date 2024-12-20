import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; 
import './Nav.css';

const Nav = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) return null; 

  const menuOptions = user.role === 'admin' 
    ? [
        { text: 'Gestionar Clientes', link: '/manage-customers' },
        { text: 'Gestionar Reservas', link: '/manage-reservations' },
        { text: 'Gestionar Menú', link: '/manage-menu' },
      ]
    : [
        { text: 'Realiza una Reserva YA', link: '/make-reservation' },
        { text: 'Gestionar mis Reservas', link: '/my-reservations' },
      ];

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setUser(null); 
    navigate('/'); 
  };

  return (
    <Box component="nav" className="nav">
      <List>
        {menuOptions.map((option, index) => (
          <ListItem button key={index}>
            <Link to={option.link} style={{ textDecoration: 'none' }}>
              <ListItemText primary={option.text} />
            </Link>
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout} className="logout-item">
          <Link to="#" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <IconButton aria-label="Cerrar sesión" style={{ color: 'inherit' }}>
              <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
            </IconButton>
            <ListItemText primary="Cerrar Sesión" />
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default Nav;
