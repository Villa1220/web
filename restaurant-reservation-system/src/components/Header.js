import React, { useContext } from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaHome, FaUtensils, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';
import logo from '../images/logo.png';
import './Header.css';
import { UserContext } from '../context/UserContext';

const Header = () => {
  const { user } = useContext(UserContext); 

  return (
    <AppBar position="static" className="header" sx={{ backgroundColor: "#1c1c1c", color: "white" }}>
      <Toolbar>
        <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit", flexGrow: 1 }}>
          <img src={logo} alt="Logo" className="logo" />
        </Box>
        <Box className="nav-menu">
          <ul>
            <li>
              <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                <FaHome style={{ marginRight: "0.5rem" }} /> Inicio
              </Link>
            </li>
            <li>
              <Link to="/menu" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                <FaUtensils style={{ marginRight: "0.5rem" }} /> Menú
              </Link>
            </li>
            <li>
              <Link to="/reservations" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                <FaCalendarAlt style={{ marginRight: "0.5rem" }} /> Reservas
              </Link>
            </li>
            {user ? (
              <li>
                <Link to="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", color: "white", padding: "12px 20px", borderRadius: "8px", margin: "0 5px", fontSize: "large" }}>
                  <FaUserCircle style={{ marginRight: "0.5rem" }} /> Bienvenido, {user.email}
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/user" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                  <FaUserCircle style={{ marginRight: "0.5rem" }} /> Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
