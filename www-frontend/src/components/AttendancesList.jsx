import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Container, Paper, TableContainer } from '@mui/material';
import { useParams } from 'react-router-dom';

const AttendancesList = (event_id) => {
  //const { event_id } = useParams(); // Retrieve event ID from URL params
  const [eventDetails, setEventDetails] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingAttendees, setLoadingAttendees] = useState(true);
  const params = useParams();

   // Retrieve user_id from localStorage
   const userId = localStorage.getItem("user_id");

   // Filter attendees who have checked in (assuming 'checked_in' is a boolean field)
   const attendingUsers = attendees.filter((attendee) => attendee.checked_in);

  // Fetch event details
  useEffect(() => {
   const fetchEventDetails = async () => {
     try {
       const eventResponse = await axios.get(`http://localhost:3001/api/v1/events/${params.event_id}`);
       setEventDetails(eventResponse.data);
     } catch (error) {
       console.error("Error fetching event details:", error);
     } finally {
       setLoadingEvent(false);
     }
   };

   fetchEventDetails();
   console.log(eventDetails)
 }, [params.event_id]);
 console.log(eventDetails)
 // Fetch attendees
 useEffect(() => {
   const fetchAttendees = async () => {
     try {
       const attendeesResponse = await axios.get(`http://localhost:3001/api/v1/events/${params.event_id}/attendances`);
       setAttendees(attendeesResponse.data);
     } catch (error) {
       console.error("Error fetching attendees:", error);
     } finally {
       setLoadingAttendees(false);
     }
   };

   fetchAttendees();
 }, [params.event_id]);

  // If still loading event data
  if (loadingEvent) {
    return <CircularProgress />;
  }

  // If event details are not available
  if (!eventDetails) {
    return <p>No event details found.</p>;
  }

//   useEffect(() => {
//     console.log(eventDetails)
//    })

  return (
    <Container>
      {/* Event Details */}
      <Typography variant="h4" sx={{ color: '#c0874f', mb: 2 }}>{eventDetails.event.name || 'Event'}</Typography>
      <Typography variant="h6" sx={{ color: '#c0c0c0' }}>
        Address: {eventDetails.address?.line1 || "No address available"}
      </Typography>
      <Typography variant="body2" sx={{ color: '#c0c0c0', mb: 2 }}>
        Description: {eventDetails.event.description || 'No description available'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#c0c0c0' }}>
        Start Date: {eventDetails.event.start_date ? new Date(eventDetails.event.start_date).toLocaleDateString() : 'No start date available'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#c0c0c0', mb: 4 }}>
        End Date: {eventDetails.event.end_date ? new Date(eventDetails.event.end_date).toLocaleDateString() : 'No end date available'}
      </Typography>

      <Typography variant="h5" sx={{ color: '#c0874f', mb: 2 }}>Attendees:</Typography>

      {/* Attendees Table */}
      {loadingAttendees ? (
        <Typography>Loading attendees...</Typography>
      ) : attendingUsers.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ backgroundColor: '#333', color: '#fff' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#c0874f' }}>User ID</TableCell>
                <TableCell sx={{ color: '#c0874f' }}>First Name</TableCell>
                <TableCell sx={{ color: '#c0874f' }}>Last Name</TableCell>
                <TableCell sx={{ color: '#c0874f' }}>Handle</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {attendingUsers.map((attendee) => (
                <TableRow key={attendee.user_id}>
                  <TableCell sx={{ color: '#fff' }}>{attendee.user_id}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{attendee.first_name}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{attendee.last_name}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{attendee.handle}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No attendees have checked in yet.</Typography>
      )}
    </Container>
  );
};

export default AttendancesList;
