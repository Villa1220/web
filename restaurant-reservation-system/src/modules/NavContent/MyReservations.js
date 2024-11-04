import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, IMAGE_URL } from '../../config';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Card,
    CardMedia,
} from '@mui/material';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [reservationDetails, setReservationDetails] = useState([]);
    const [error, setError] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedMenuItems, setSelectedMenuItems] = useState({});
    const [guests, setGuests] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/reservations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReservations(response.data.reservations);
                setReservationDetails(response.data.reservationDetails);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setError('Error al cargar las reservas. Intente de nuevo más tarde.');
            }
        };

        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/menu`);
                setMenuItems(response.data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
                setError('Error al cargar los platos. Intente de nuevo más tarde.');
            }
        };

        fetchReservations();
        fetchMenuItems();
    }, []);

    const handleCancelReservation = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/reservations/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReservations(reservations.filter((reservation) => reservation._id !== id));
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            setError('Error al cancelar la reserva. Intente de nuevo más tarde.');
        }
    };

    const handleEditReservation = (reservation) => {
        setSelectedReservation(reservation);
        setGuests(reservation.guests);
        setReservationDate(reservation.reservationDate);

        const menuItemsToSelect = getReservationMenuItems(reservation._id);
        const items = {};
        menuItemsToSelect.forEach((item) => {
            items[item.menuItem] = item.quantity;
        });
        setSelectedMenuItems(items);
        setEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditModalOpen(false);
        setSelectedReservation(null);
        setSelectedMenuItems({});
        setGuests('');
        setReservationDate('');
    };

    const getReservationMenuItems = (reservationId) => {
        return reservationDetails.filter((detail) => detail.reservation === reservationId);
    };

    const handleUpdateReservation = async () => {
        try {
            const token = localStorage.getItem('token');
            const menuItemsToUpdate = Object.entries(selectedMenuItems)
                .map(([id, quantity]) => (quantity > 0 ? { item: id, quantity } : null))
                .filter((item) => item !== null);

            const response = await axios.put(
                `${BASE_URL}/reservations/${selectedReservation._id}`,
                {
                    reservationDate,
                    guests: parseInt(guests, 10),
                    menuItems: menuItemsToUpdate,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Actualizar la tabla con la nueva información de la reserva
            setReservations(reservations.map((reservation) => {
                if (reservation._id === selectedReservation._id) {
                    return { ...reservation, ...response.data }; // Asegúrate de que la respuesta contenga los datos actualizados
                }
                return reservation;
            }));

            handleCloseModal();
        } catch (error) {
            console.error('Error updating reservation:', error);
            setError('Error al actualizar la reserva. Intente de nuevo más tarde.');
        }
    };

    const handleMenuItemChange = (itemId, quantity) => {
        setSelectedMenuItems((prev) => ({ ...prev, [itemId]: quantity }));
    };

    return (
        <div>
            <h2>Mis Reservas</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fecha de Reserva</TableCell>
                            <TableCell>Número de Invitados</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Platos</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reservation) => (
                            <TableRow key={reservation._id}>
                                <TableCell>{new Date(reservation.reservationDate).toLocaleString()}</TableCell>
                                <TableCell>{reservation.guests}</TableCell>
                                <TableCell>{reservation.status}</TableCell>
                                <TableCell>
                                    {getReservationMenuItems(reservation._id).length > 0 ? (
                                        getReservationMenuItems(reservation._id).map((item) => (
                                            <div key={item.menuItem} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                <Avatar
                                                    src={`${IMAGE_URL}${item.menuItem.image}`}
                                                    alt={item.menuItem.name}
                                                    style={{ marginRight: '10px' }}
                                                />
                                                <span>{item.menuItem.name} (x{item.quantity})</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No hay platos en esta reserva.</div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEditReservation(reservation)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleCancelReservation(reservation._id)}
                                    >
                                        Cancelar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal para editar reserva */}
            <Dialog open={editModalOpen} onClose={handleCloseModal}>
                <DialogTitle>Editar Reserva</DialogTitle>
                <DialogContent>
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
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h4>{item.name}</h4>
                                        <p>{item.description}</p>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Cantidad</InputLabel>
                                            <Select
                                                value={selectedMenuItems[item._id] || 0}
                                                onChange={(e) => handleMenuItemChange(item._id, e.target.value)}
                                                label="Cantidad"
                                            >
                                                {[...Array(10).keys()].map((num) => (
                                                    <MenuItem key={num} value={num}>
                                                        {num}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleUpdateReservation} color="primary">
                        Guardar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MyReservations;
