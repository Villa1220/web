import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [reservationDetails, setReservationDetails] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/reservations`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Se espera que response.data tenga las propiedades reservations y reservationDetails
                setReservations(response.data.reservations);
                setReservationDetails(response.data.reservationDetails);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setError('Error al cargar las reservas. Intente de nuevo más tarde.');
            }
        };
        fetchReservations();
    }, []);

    const handleCancelReservation = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/reservations/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setReservations(reservations.filter(reservation => reservation._id !== id));
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            setError('Error al cancelar la reserva. Intente de nuevo más tarde.');
        }
    };

    const handleEditReservation = (id) => {
        // Aquí podrías implementar la lógica para editar la reserva
        // Esto podría abrir un modal o redirigir a otro componente para editar
    };

    // Función auxiliar para obtener los detalles de la reserva correspondiente a un ID de reserva
    const getReservationMenuItems = (reservationId) => {
        return reservationDetails
            .filter(detail => detail.reservation === reservationId)
            .map(detail => ({
                ...detail.menuItem,
                quantity: detail.quantity
            }));
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
                            <TableCell>Platos</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reservation) => (
                            <TableRow key={reservation._id}>
                                <TableCell>{new Date(reservation.reservationDate).toLocaleString()}</TableCell>
                                <TableCell>{reservation.guests}</TableCell>
                                <TableCell>
                                    {getReservationMenuItems(reservation._id).length > 0 ? (
                                        getReservationMenuItems(reservation._id).map((item) => (
                                            <div key={item._id}>
                                                {item.name} (x{item.quantity})
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
                                        onClick={() => handleEditReservation(reservation._id)}
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
        </div>
    );
};

export default MyReservations;
