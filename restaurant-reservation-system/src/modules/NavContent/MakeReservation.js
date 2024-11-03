import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, IMAGE_URL } from '../../config';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Grid, Typography, Card, CardMedia } from '@mui/material';

const MakeReservation = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState({});
    const [guests, setGuests] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/menu`);
                setMenuItems(response.data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
                setError('Error al cargar los platos. Intente de nuevo más tarde.');
            }
        };
        fetchMenuItems();
    }, []);

    const handleChange = (itemId, value) => {
        setSelectedMenuItems((prev) => ({ ...prev, [itemId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Comprobación de datos de entrada
        if (!reservationDate || !guests) {
            setError('Por favor, complete todos los campos obligatorios.');
            return;
        }

        // Solo agregar los IDs de los items seleccionados, no las cantidades
        const menuItemsToReserve = Object.keys(selectedMenuItems)
            .map(id => selectedMenuItems[id] > 0 ? id : null) // Solo guardar IDs si la cantidad es mayor a 0
            .filter(item => item !== null); // Filtrar solo los elementos válidos

        if (menuItemsToReserve.length === 0) {
            setError('Por favor, seleccione al menos un plato con cantidad.');
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Obtiene el token del localStorage
            const response = await axios.post(`${BASE_URL}/reservations`, {
                reservationDate,
                guests: parseInt(guests, 10),
                menuItems: menuItemsToReserve, // Solo los IDs
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Añade el token en el header
                }
            });
            console.log('Reservation created:', response.data);
            setError('Reserva creada exitosamente.');
            // Resetear el formulario si se desea
            setSelectedMenuItems({});
            setGuests('');
            setReservationDate('');
        } catch (error) {
            console.error('Error creating reservation:', error);
            setError('Error al crear la reserva. Intente de nuevo más tarde.');
        }
    };

    return (
        <div>
            <h2>Realiza una Reserva</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Número de invitados"
                            type="number"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Fecha de Reserva"
                            type="datetime-local"
                            value={reservationDate}
                            onChange={(e) => setReservationDate(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h3>Selecciona los Platos</h3>
                        {menuItems.map((item) => (
                            <Card key={item._id} style={{ marginBottom: '1rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                                <CardMedia
                                    component="img"
                                    alt={item.name}
                                    image={`${IMAGE_URL}${item.image}`} 
                                    title={item.name}
                                    style={{ width: 100, height: 100, objectFit: 'cover', marginRight: '1rem' }}
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>{item.name}</InputLabel>
                                    <Select
                                        value={selectedMenuItems[item._id] || ''}
                                        onChange={(e) => handleChange(item._id, e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione cantidad</em>
                                        </MenuItem>
                                        {[...Array(10).keys()].map(num => (
                                            <MenuItem key={num} value={num + 1}>{num + 1}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Card>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Confirmar Reserva
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default MakeReservation;
