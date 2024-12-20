import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { BASE_URL } from '../../config';
import './ManageCustomers.css'; 

const ADMIN_KEY = 'clave_segura_para_crear_admin'; 

const ManageCustomers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', phone: '', role: 'user', password: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [error, setError] = useState('');
  const usersPerPage = 7;

  useEffect(() => {
    fetchUsers();
  }, []);

  // Obtener la lista de usuarios
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    }
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        const { password, ...updatedForm } = form;
        await axios.put(`${BASE_URL}/users/${editingUserId}`, updatedForm, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        let response;
        if (form.role === 'admin') {
          response = await axios.post(`${BASE_URL}/auth/register-admin`, { ...form, adminKey: ADMIN_KEY });
        } else {
          response = await axios.post(`${BASE_URL}/auth/register`, form);
        }
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      setError(editingUserId ? 'Error al actualizar usuario' : 'Error al agregar usuario');
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', address: '', phone: '', role: 'user', password: '' });
    setEditingUserId(null);
    setShowModal(false);
    setError('');
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUserId(user._id);
      setForm({ name: user.name, email: user.email, address: user.address, phone: user.phone, role: user.role, password: '' });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const currentUsers = users.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

  return (
    <div className="manage-customers-container">
      <div className="manage-customers-nav">
        <h2>Gestión de Clientes</h2>
        <Button className="add-user-button" onClick={() => openModal()}>Agregar Nuevo Usuario</Button>
      </div>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => openModal(user)}>Editar</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={Math.ceil(users.length / usersPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={8}
        onPageChange={handlePageClick}
        containerClassName={'pagination justify-content-center'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        activeClassName={'active'}
      />
      
      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUserId ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="text" name="phone" value={form.phone} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Dirección</Form.Label>
              <Form.Control type="text" name="address" value={form.address} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Rol</Form.Label>
              <Form.Control as="select" name="role" value={form.role} onChange={handleChange}>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </Form.Control>
            </Form.Group>
            {!editingUserId && (
              <Form.Group controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
              </Form.Group>
            )}
            <Button variant="primary" type="submit" className="mt-3">
              {editingUserId ? 'Guardar Cambios' : 'Agregar Usuario'}
            </Button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageCustomers;
