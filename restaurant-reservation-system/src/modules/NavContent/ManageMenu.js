import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { BASE_URL, IMAGE_URL } from '../../config'; 
import './ManageMenu.css';

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: null });
  const [editingItemId, setEditingItemId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Obtener los elementos del menú
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/menu`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error al obtener platos', error);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios de archivos
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Manejar el envío del formulario
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      if (editingItemId) {
        await axios.put(`${BASE_URL}/menu/${editingItemId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`${BASE_URL}/menu`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      fetchMenuItems();
      resetForm();
    } catch (error) {
      setError(editingItemId ? 'Error al actualizar plato' : 'Error al agregar plato');
    }
  };

  // Restablecer el formulario
  const resetForm = () => {
    setForm({ name: '', description: '', price: '', image: null });
    setEditingItemId(null);
    setShowModal(false);
    setError('');
  };

  // Manejar la edición de un elemento del menú
  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price, image: null });
    setEditingItemId(item._id);
    setShowModal(true);
  };

  // Manejar la eliminación de un elemento del menú
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este plato?')) {
      try {
        await axios.delete(`${BASE_URL}/menu/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchMenuItems();
      } catch (error) {
        console.error('Error al eliminar plato', error);
      }
    }
  };

  return (
    <>
      {/* Contenedor para centrar el botón "Agregar Plato" */}
      <div className="button-container">
        <Button onClick={() => setShowModal(true)}>Agregar Plato</Button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <div className="table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>
                  {item.image ? (
                    <img
                      src={`${IMAGE_URL}${item.image}`} // Asegurarse que la URL no tenga barras duplicadas
                      alt={item.name}
                      style={{ width: '50px', height: '50px' }}
                    />
                  ) : (
                    'Sin imagen'
                  )}
                </td>
                <td>
                  <Button variant="success" onClick={() => handleEdit(item)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(item._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItemId ? 'Editar Plato' : 'Agregar Plato'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" name="description" value={form.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button type="submit">{editingItemId ? 'Actualizar' : 'Agregar'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ManageMenu;
