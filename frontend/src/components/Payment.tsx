// src/pages/Payment.tsx
import React from 'react';
import { Button, Container, Typography, TextField, Box } from '@mui/material';

const Payment: React.FC = () => {
    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ marginTop: 8 }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Page de Paiement
                </Typography>
                <TextField
                    label="Numéro de carte"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Date d'expiration"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="CVC"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" sx={{ marginTop: 3 }}>
                    Payer
                </Button>
            </Box>
        </Container>
    );
};

export default Payment;