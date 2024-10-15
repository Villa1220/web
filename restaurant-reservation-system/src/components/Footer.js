import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  return (
    <Box component="footer">
      <Container className="footer-container">
        <Grid container spacing={3} className="footer-grid">
          {/* Columna izquierda: Información del Restaurante */}
          <Grid item xs={12} md={4} style={{ textAlign: 'left' }}>
            <Typography className="footer-title">Información del Restaurante</Typography>
            <Typography>Dirección: Perucho.</Typography>
            <Typography>Horario de Apertura: Sabados, Domingos y Feriados</Typography>
            <Typography>Teléfono: 0984266777/0995874667</Typography>
          </Grid>

          {/* Columna del medio: Políticas y FAQs */}
          <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
            <Typography className="footer-title">Políticas</Typography>
            <Typography>Política de Privacidad: Información sobre cómo se manejan los datos de los usuarios.</Typography>
            <Typography>Términos y Condiciones: Detalles sobre el uso del sistema.</Typography>
            <Typography>FAQs: Preguntas frecuentes que puedan ayudar a los usuarios.</Typography>
          </Grid>

          {/* Columna derecha: Redes Sociales */}
          <Grid item xs={12} md={4} style={{ textAlign: 'right' }}>
            <Typography className="footer-title">Redes Sociales</Typography>
            <Box className="social-icons">
              <motion.div whileHover={{ scale: 1.2 }}>
                <FaFacebook size={24} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }}>
                <FaTwitter size={24} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }}>
                <FaInstagram size={24} />
              </motion.div>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography className="footer-copy" style={{ marginTop: '20px' }}>
          &copy; {new Date().getFullYear()} La Ruta del Sabor. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
