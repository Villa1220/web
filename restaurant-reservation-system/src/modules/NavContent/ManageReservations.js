import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import {
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from '@mui/material';
import './ManageReservation.css';

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState({});
    const [guests, setGuests] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    
    const editFormRef = useRef(null);

    useEffect(() => {
        fetchReservations();
        fetchMenuItems();
    }, []);

    const fetchReservations = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BASE_URL}/reservations/admin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReservations(response.data.reservations);
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

    const handleSelectReservation = (reservation) => {
        setSelectedReservation(reservation);
        setGuests(reservation.guests);
        setReservationDate(reservation.reservationDate);
        const menuItemsMap = {};
        if (Array.isArray(reservation.reservationDetails)) {
            reservation.reservationDetails.forEach(detail => {
                menuItemsMap[detail.menuItem] = detail.quantity;
            });
        }
        setSelectedMenuItems(menuItemsMap);
        if (editFormRef.current) {
            editFormRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleChange = (itemId, value) => {
        setSelectedMenuItems(prev => ({ ...prev, [itemId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

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
            await axios.put(
                `${BASE_URL}/reservations/admin/edit/${selectedReservation._id}`,
                {
                    reservationDate,
                    guests: parseInt(guests, 10),
                    menuItems: menuItemsToReserve,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess('Reserva actualizada exitosamente.');
            setSelectedReservation(null);
            setSelectedMenuItems({});
            setGuests('');
            setReservationDate('');
            fetchReservations(); 
        } catch (error) {
            console.error('Error updating reservation:', error);
            setError('Error al actualizar la reserva. Intente de nuevo más tarde.');
        }
    };

    const handleStatusChange = async (reservationId, newStatus) => {
        const token = localStorage.getItem('token');

        if (newStatus === 'canceled') {
            try {
                await axios.delete(`${BASE_URL}/reservations/admin/${reservationId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Reserva cancelada exitosamente.');
                fetchReservations();
            } catch (error) {
                console.error('Error canceling reservation:', error);
                setError('Error al cancelar la reserva.');
            }
        } else {
            try {
                await axios.put(`${BASE_URL}/reservations/admin/update-status/${reservationId}`, { status: newStatus }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Estado de la reserva actualizado exitosamente.');
                fetchReservations(); 
            } catch (error) {
                console.error('Error updating reservation status:', error);
                setError('Error al actualizar el estado de la reserva.');
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };

    return (
        <div className="manage-reservations-container"> 
            <h2>Gestión de Reservas</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <h3>Reservas Disponibles</h3>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Fecha de Reserva</TableCell>
                            <TableCell>Número de Invitados</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation) => (
                            <TableRow key={reservation._id}>
                                <TableCell>{reservation._id}</TableCell>
                                <TableCell>{new Date(reservation.reservationDate).toLocaleString()}</TableCell>
                                <TableCell>{reservation.guests}</TableCell>
                                <TableCell>
                                    <Select
                                        value={reservation.status}
                                        onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                                    >
                                        <MenuItem value="pending">Pendiente</MenuItem>
                                        <MenuItem value="accepted">Aceptada</MenuItem>
                                        <MenuItem value="canceled">Cancelada</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleSelectReservation(reservation)}>Editar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[6, 12, 24]}
                component="div"
                count={reservations.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {selectedReservation && (
                <div ref={editFormRef} style={{ marginTop: '2rem' }}>
                    <h3>Editar Reserva</h3>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Número de Invitados"
                                    type="number"
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Fecha de Reserva"
                                    type="datetime-local"
                                    value={reservationDate}
                                    onChange={(e) => setReservationDate(e.target.value)}
                                    required
                                />
                            </Grid>
                            {menuItems.map((item) => (
                                <Grid item xs={12} key={item._id}>
                                    <FormControl fullWidth>
                                        <InputLabel>{item.name}</InputLabel>
                                        <Select
                                            value={selectedMenuItems[item._id] || ''}
                                            onChange={(e) => handleChange(item._id, e.target.value)}
                                        >
                                            {[...Array(11).keys()].map((num) => (
                                                <MenuItem key={num} value={num}>
                                                    {num}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            ))}
                        </Grid>
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
                            Actualizar Reserva
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageReservations;
