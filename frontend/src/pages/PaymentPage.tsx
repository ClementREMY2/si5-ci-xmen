import React, { useState } from 'react';
import { Box, Typography, Grid, Button, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate

const PaymentPage: React.FC = () => {
    const [tip, setTip] = useState<number>(3);
    const navigate = useNavigate(); // Initialisation du hook useNavigate

    const items = [
        { name: 'Coca-cola', remaining: 0, ordered: 2 },
        { name: 'Ice Tea', remaining: 0, ordered: 1 },
        { name: 'Orangina', remaining: 0, ordered: 1 },
        { name: 'Salade César', remaining: 0, ordered: 2 },
        { name: 'Charcuterie', remaining: 0, ordered: 1 },
        { name: 'Pâtes bolognaise', remaining: 0, ordered: 1 },
        { name: 'Pâtes carbonara', remaining: 0, ordered: 1 },
        { name: 'Escalope veau', remaining: 0, ordered: 1 },
        { name: 'Loup + frites', remaining: 0, ordered: 1 },
        { name: 'Fondant chocolat', remaining: 0, ordered: 2 },
    ];

    const handleTipChange = (value: number) => {
        setTip(prevTip => Math.max(0, prevTip + value));
    };

    // Gestionnaire de paiement
    const handlePayment = () => {
        // Logique de traitement du paiement (simulation ou réel)

        // Après le traitement du paiement, redirige l'utilisateur vers la page d'accueil
        navigate('/home');
    };

    return (
        <Box sx={{ backgroundColor: '#FFB74D', height: '100vh', padding: '16px' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Button variant="text" sx={{ fontSize: '18px', color: 'black' }}>Paiement</Button>
                <Typography variant="h6">09/09/2024 - 21h05</Typography>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: '#00E676',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontSize: '18px'
                    }}
                >
                    0
                </Box>
            </Box>

            {/* Table and Payment Info */}
            <Box sx={{ textAlign: 'center', marginBottom: '16px' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Table 108</Typography>
                <Typography variant="h6">0 € / 97 €</Typography>
            </Box>

            {/* Payment checkbox */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Payer le total"
                />
            </Box>

            {/* Items list */}
            <Grid container spacing={1}>
                {items.map((item, index) => (
                    <Grid item xs={12} key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFE0B2', padding: '8px', borderRadius: '4px' }}>
                            <Box>
                                <Typography>{item.name}</Typography>
                                <Typography variant="body2" color="text.secondary">Restant : {item.remaining}</Typography>
                            </Box>
                            <Typography>{item.ordered}</Typography>
                            <Box>
                                <IconButton size="small">
                                    <AddCircleOutlineIcon />
                                </IconButton>
                                <IconButton size="small">
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Tip and payment */}
            <Box sx={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ marginRight: '8px' }}>Pourboire : {tip} €</Typography>
                    <IconButton onClick={() => handleTipChange(-1)} size="small">
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                    <IconButton onClick={() => handleTipChange(1)} size="small">
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Box>
                <Button variant="contained" color="error" sx={{ width: '48%' }} onClick={handlePayment}>
                    PAYER 100 €
                </Button>
            </Box>
        </Box>
    );
};

export default PaymentPage;