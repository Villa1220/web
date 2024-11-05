import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 
import './Footer.css';


const Footer = () => {
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} className="footer-column">
            <Typography className="footer-title">Información del Restaurante</Typography>
            <br></br>
            <Typography className="footer-text">Dirección: Perucho.</Typography>
            <Typography className="footer-text">Horario de Apertura: Sábados, Domingos y Feriados</Typography>
            <Typography className="footer-text">Teléfono: 0984266777 / 0995874667</Typography>
          </Grid>

          <Grid item xs={12} md={4} className="footer-column">
            
            <Typography className="footer-title">Políticas</Typography>
            <br></br>
            <ul className="footer-links">
              <li>
                <Link to="/privacy-policy" className="footer-link">Política de Privacidad</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="footer-link">Términos y Condiciones</Link>
              </li>
              <li>
                <Link to="/faqs" className="footer-link">FAQs</Link>
              </li>
            </ul>
          </Grid>

          <Grid item xs={12} md={4} className="footer-column">
            <Typography className="footer-title">Redes Sociales</Typography>
            <br></br>
            <Box className="social-icons">
              <motion.div whileHover={{ scale: 1.2 }}>
                <FaFacebook size={30} className="social-icon" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }}>
                <FaInstagram size={30} className="social-icon" />
              </motion.div>
            </Box>
          </Grid>
        </Grid>

        <Typography className="footer-copy">
          &copy; {new Date().getFullYear()} La Ruta del Sabor. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
