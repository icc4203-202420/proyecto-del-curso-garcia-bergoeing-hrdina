import React, { useState } from 'react'; 
import axios from 'axios';
import { Typography, Button, CircularProgress } from '@mui/material';

const AddCheckIn = ({ bar_id, event_id, onCheckIn }) => {
    console.log('AddCheckIn component rendered');
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [error, setError] = useState('');
    // Retrieve user_id from localStorage
   const userId = parseInt(localStorage.getItem("user_id"), 10);  // Ensures it's an integer

    const handleCheckIn = async () => {
        setIsCheckingIn(true);
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            setError('Authentication token not found.');
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:3001/api/v1/bars/${bar_id}/events/${event_id}/attendances`,
                {user_id: userId}, // Empty body, adjust if needed
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
    
            // Asegúrate de que la respuesta contiene el attendance con user_id
            const { attendance } = response.data;
            
            // Extrae y muestra el user_id en la consola
            if (attendance && attendance.user_id) {
                console.log('User ID:', attendance.user_id);
            } else {
                console.log('No user ID found in the response');
            }
    
            setHasCheckedIn(true);
            onCheckIn(attendance);
        } catch (error) {
            console.error('Error details:', error.toJSON ? error.toJSON() : error);
            setError('Failed to check in. Please try again.');
        } finally {
            setIsCheckingIn(false);
        }
    };

    return (
        <div>
            {isCheckingIn ? (
                <CircularProgress />
            ) : (
                <Button
                    onClick={handleCheckIn}
                    variant="outlined"
                    sx={{ color: '#c0874f', borderColor: '#c0874f' }}
                >
                    Check In
                </Button>
            )}

            {error && <Typography color="error">{error}</Typography>}
        </div>
    );
};

export default AddCheckIn;