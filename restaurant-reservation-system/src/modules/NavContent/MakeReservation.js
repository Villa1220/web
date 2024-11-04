import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BASE_URL, IMAGE_URL } from '../../config';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Grid, Card, CardMedia } from '@mui/material';
import { UserContext } from '../../context/UserContext';
import './MakeReservation.css'; // Importa el archivo CSS

const MakeReservation = () => {
    const { user } = useContext(UserContext); // Obteniendo el usuario actual
    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState({});
    const [guests, setGuests] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        setError('');
        setSuccess('');

        // Validaciones previas a la reserva
        if (!reservationDate || !guests) {
            setError('Por favor, complete todos los campos obligatorios.');
            return;
        }

        const menuItemsToReserve = Object.entries(selectedMenuItems)
            .map(([id, quantity]) => quantity > 0 ? { item: id, quantity } : null)
            .filter(item => item !== null);

        if (menuItemsToReserve.length === 0) {
            setError('Por favor, seleccione al menos un plato con cantidad.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${BASE_URL}/reservations`,
                {
                    reservationDate,
                    guests: parseInt(guests, 10),
                    menuItems: menuItemsToReserve,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            console.log('Reservation created:', response.data);
            setSuccess('Reserva creada exitosamente.');
            setSelectedMenuItems({});
            setGuests('');
            setReservationDate('');
        } catch (error) {
            console.error('Error creating reservation:', error);
            setError('Error al crear la reserva. Intente de nuevo más tarde.');
            if (error.response && error.response.data.message) {
                setError(`Error: ${error.response.data.message}`);
            }
        }
    };

    return (
        <div className="make-reservation-container"> {/* Clase para el contenedor */}
            <h2 style={{ textAlign: 'center' }}>Realiza una Reserva</h2>

            <br></br>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <h3>Selecciona el Número de Invitados</h3> {/* Nueva instrucción */}
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
                        <h3>Elige la Fecha de Reserva</h3> {/* Nueva instrucción */}
                        <TextField
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
                            <Card key={item._id} className="menu-item-card"> {/* Clase para cada card */}
                                <CardMedia
                                    component="img"
                                    alt={item.name}
                                    image={`${IMAGE_URL}${item.image}`}
                                    title={item.name}
                                    className="menu-item-image"
                                />
                                <div className="menu-item-details">
                                    <h4>{item.name}</h4>
                                    <p>{item.description}</p>
                                    <FormControl fullWidth>
                                        <InputLabel>Cantidad</InputLabel>
                                        <Select
                                            value={selectedMenuItems[item._id] || 0}
                                            onChange={(e) => handleChange(item._id, e.target.value)}
                                        >
                                            <MenuItem value={0}>0</MenuItem>
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <MenuItem key={num} value={num}>{num}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Card>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">Reservar</Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default MakeReservation;
