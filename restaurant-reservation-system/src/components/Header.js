import React from 'react';
import './Header.css';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaHome, FaUtensils, FaCalendarAlt, FaPhone } from 'react-icons/fa'; 


const Header = () => {
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography
          variant="h6"
          className="logo"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Mi Restaurante
        </Typography>
        <Box className="nav-menu">
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '0 1rem' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                <FaHome style={{ marginRight: '0.5rem' }} /> Inicio
              </Link>
            </li>
            <li style={{ margin: '0 1rem' }}>
              <Link to="/menu" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                <FaUtensils style={{ marginRight: '0.5rem' }} /> Menú
              </Link>
            </li>
            <li style={{ margin: '0 1rem' }}>
              <Link to="/reservations" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                <FaCalendarAlt style={{ marginRight: '0.5rem' }} /> Reservas
              </Link>
            </li>
            <li style={{ margin: '0 1rem' }}>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                <FaPhone style={{ marginRight: '0.5rem' }} /> Contacto
              </Link>
            </li>
          </ul>
        </Box>
        <Box className="user-options">
          <Button color="inherit" component={Link} to="/login">Iniciar Sesión</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
