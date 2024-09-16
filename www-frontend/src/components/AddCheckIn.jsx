import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, CircularProgress } from '@mui/material';

const AddCheckIn = ({ bar_id, event_id, onCheckIn }) => {
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [error, setError] = useState('');

    console.log("Bar: ", bar_id)
    console.log("Event: ", event_id)

    const handleCheckIn = async () => {
        setIsCheckingIn(true);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                `http://localhost:3001/api/v1/bars/${bar_id}/events/${event_id}/attendances`,
                {}, // Update this with required data if any
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Make sure the token format is correct
                        'Content-Type': 'application/json' // Ensure correct content type if needed
                    }
                }
            );
            setHasCheckedIn(true);
            onCheckIn(response.data.attendance);
        } catch (error) {
            console.error("Error checking in:", error);
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

export default AddCheckIn