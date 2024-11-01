import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './modules/Home';
import Menu from './modules/Menu';
import Reservations from './modules/Reservations';
import About from './modules/About';
import Contact from './modules/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './modules/User/Login'; // Nuevo import
import Register from './modules/User/Register'; // Nuevo import

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* Nueva ruta */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
