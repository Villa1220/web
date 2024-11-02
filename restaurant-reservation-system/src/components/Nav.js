import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
  const { user } = useContext(UserContext);

  if (!user) return null; // No renderiza Nav si no hay usuario

  const menuOptions = user.role === 'admin' 
    ? [
        { text: 'Gestionar Clientes', link: '/manage-customers' },
        { text: 'Gestionar Reservas', link: '/manage-reservations' },
        { text: 'Gestionar Menú', link: '/manage-menu' },
        { text: 'Mi Perfil', link: '/profile' },
      ]
    : [
        { text: 'Realiza una Reserva YA', link: '/make-reservation' },
        { text: 'Gestionar mis Reservas', link: '/my-reservations' },
        { text: 'Mi Perfil', link: '/profile' },
      ];

  return (
    <Box component="nav" className="nav">
      <List>
        {menuOptions.map((option, index) => (
          <ListItem button key={index}>
            <Link to={option.link} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemText primary={option.text} />
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Nav;
