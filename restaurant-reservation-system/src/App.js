import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './modules/Home';
import Menu from './modules/Menu';
import Reservations from './modules/Reservations';
import About from './modules/About';
import Contact from './modules/Contact';
import Header from './components/Header'; 
import Footer from './components/Footer';
import Login from './modules/User/Login';
import Register from './modules/User/Register';
import Nav from './components/Nav'; 
import { UserContext } from './context/UserContext'; 

function App() {
  const { user } = useContext(UserContext); 

  return (
    <Router>
      <div className="App">
        {/* Header siempre se muestra */}
        <Header />
        
        {/* Nav solo se muestra si el usuario ha iniciado sesión */}
        {user && <Nav />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
