import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './modules/Home';
import Menu from './modules/Menu';
import Reservations from './modules/Reservations';
import About from './modules/About';
import Header from './components/Header'; 
import Footer from './components/Footer';
import Login from './modules/User/Login';
import Register from './modules/User/Register';
import Nav from './components/Nav'; 
import { UserContext } from './context/UserContext';

// Importa los componentes de cada módulo de navegación
import MakeReservation from './modules/NavContent/MakeReservation';
import ManageCustomers from './modules/NavContent/ManageCustomers';
import ManageMenu from './modules/NavContent/ManageMenu';
import ManageReservations from './modules/NavContent/ManageReservations';
import MyReservations from './modules/NavContent/MyReservations';

function App() {
  const { user } = useContext(UserContext);

  // Componente de ruta protegida
  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/user" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
  };

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
          <Route path="/user" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas para administradores */}
          <Route 
            path="/manage-customers" 
            element={
              <ProtectedRoute role="admin">
                <ManageCustomers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manage-reservations" 
            element={
              <ProtectedRoute role="admin">
                <ManageReservations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manage-menu" 
            element={
              <ProtectedRoute role="admin">
                <ManageMenu />
              </ProtectedRoute>
            } 
          />

          {/* Rutas protegidas para usuarios */}
          <Route 
            path="/make-reservation" 
            element={
              <ProtectedRoute>
                <MakeReservation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-reservations" 
            element={
              <ProtectedRoute>
                <MyReservations />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
