import React, { useState } from 'react';
import { Container, TextField } from '@mui/material';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container>
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'blue',
            },
            '& input': {
              color: 'white',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'white',
          },
          backgroundColor: '#333',
        }}
      />
    </Container>
  );
};

export default UserSearch;
