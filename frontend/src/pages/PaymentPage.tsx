import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';

const PaymentPage: React.FC = () => {
    const [tip, setTip] = useState<number>(0);
    const [totalItemsPrice, setTotalItemsPrice] = useState<number>(0);
    const [maxTotalPrice, setMaxTotalPrice] = useState<number>(0);
    const [isTotalChecked, setIsTotalChecked] = useState<boolean>(false);
    const [totalToDisplay, setTotalToDisplay] = useState<number>(0);
    const navigate = useNavigate();

    const [items, setItems] = useState([
        { name: 'Coca-cola', price: 3, remaining: 2, ordered: 2 },
        { name: 'Ice Tea', price: 3, remaining: 1, ordered: 1 },
        { name: 'Orangina', price: 3, remaining: 1, ordered: 1 },
        { name: 'Salade César', price: 7, remaining: 2, ordered: 2 },
        { name: 'Charcuterie', price: 8, remaining: 1, ordered: 1 },
        { name: 'Pâtes bolognaise', price: 12, remaining: 1, ordered: 1 },
        { name: 'Pâtes carbonara', price: 12, remaining: 1, ordered: 1 },
        { name: 'Escalope veau', price: 14, remaining: 1, ordered: 1 },
        { name: 'Loup + frites', price: 15, remaining: 1, ordered: 1 },
        { name: 'Fondant chocolat', price: 7, remaining: 2, ordered: 2 },
    ]);


    // Fonction pour mettre à jour le pourboire
    const handleTipChange = (value: number) => {
        setTip(prevTip => Math.max(0, prevTip + value));
    };
    // Fonction pour calculer le total maximal possible
    const calculateMaxTotal = () => {
        const maxTotal = items.reduce((sum, item) => sum + (item.price * item.ordered), 0);
        setMaxTotalPrice(maxTotal);
    };

    // Calculer le maxTotal une seule fois lors du chargement
    useEffect(() => {
        calculateMaxTotal();
    }, []); // Appelé uniquement lors du premier rendu

    // Fonction pour calculer le total des articles commandés
    useEffect(() => {
        const total = items.reduce((sum, item) => sum + (item.price * item.remaining), 0);
        setTotalItemsPrice(total);

        // Si la checkbox est cochée, mettre à jour le total affiché
        if (isTotalChecked) {
            setTotalToDisplay(maxTotalPrice);
        }
    }, [items, isTotalChecked, maxTotalPrice]); // Inclure maxTotalPrice ici


    // Gestionnaire de la checkbox "Payer le total"
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setIsTotalChecked(isChecked);

        // Si cochée, le total devient le maxTotalPrice
        if (isChecked) {
            setTotalToDisplay(maxTotalPrice);
        } else {
            // Ne pas réinitialiser les quantités ici
            setTotalToDisplay(0);
            //pour chaque item.remaining, = item.ordered correspondant
            setItems(prevItems => {
                return prevItems.map(item => {
                    return { ...item, remaining: item.ordered };
                });
            });
        }
    };

    const handleItemQuantityChange = (index: number, change: number) => {
        if (isTotalChecked) return; // Ne rien faire si la checkbox est cochée

        setItems(prevItems => {
            return prevItems.map((item, idx) => {
                if (idx === index) {
                    const newRemaining = Math.max(0, Math.min(item.remaining + change, item.ordered));
                    // Si on augmente la quantité, on diminue le total à afficher
                    if (change > 0) {
                        const priceAdjustment = item.price; // Prix à soustraire
                        setTotalToDisplay(prevTotal => prevTotal - priceAdjustment);
                    } else if (change < 0) {
                        // Si on diminue la quantité, on ajoute le prix au total à afficher
                        const priceAdjustment = item.price; // Prix à ajouter
                        setTotalToDisplay(prevTotal => prevTotal + priceAdjustment);
                    }
                    return { ...item, remaining: newRemaining };
                }
                return item;
            });
        });
    };

    // Gestionnaire de paiement
    const handlePayment = () => {
        // Logique de traitement du paiement
        navigate('/home');
    };

    // Calcul du total à payer (prix des articles + pourboire)
    const totalToPay = totalToDisplay + tip;

    //TODO : Changer le nombre de notifs
    return (
        <Box sx={{ backgroundColor: '#FFB74D', height: '100vh', padding: '16px', color: 'black' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Button variant="text" sx={{ fontSize: '18px', color: 'black' }}>Paiement</Button>
                <Typography variant="h6" sx={{ color: 'black' }}>09/09/2024 - 21h05</Typography>
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
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>Table 108</Typography>
                <Typography variant="h6" sx={{ color: 'black' }}>{totalToDisplay} € / {maxTotalPrice} €</Typography>
            </Box>

            {/* Payment checkbox */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <FormControlLabel
                    control={<Checkbox checked={isTotalChecked} onChange={handleCheckboxChange} />}
                    label="Payer le total"
                    sx={{ color: 'black' }}
                />
            </Box>

            {/* Items list */}
            <Grid container spacing={1}>
                {items.map((item, index) => (
                    <Grid item xs={12} key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFE0B2', padding: '8px', borderRadius: '4px' }}>
                            <Box>
                                <Typography sx={{ color: 'black' }}>{item.name}</Typography>
                                {/* Rendu dynamique du nombre restant */}
                                <Typography variant="body2" sx={{ color: 'black' }}>
                                    Restant : {isTotalChecked ? 0 : item.remaining}
                                </Typography>
                            </Box>
                            <Typography sx={{ color: 'black' }}>{item.ordered}</Typography>
                            <Box>
                                <IconButton
                                    size="small"
                                    onClick={() => handleItemQuantityChange(index, 1)}
                                    disabled={isTotalChecked || item.remaining >= item.ordered}
                                >
                                    <AddCircleOutlineIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleItemQuantityChange(index, -1)}
                                    disabled={isTotalChecked || item.remaining <= 0}
                                >
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
                    <Typography sx={{ marginRight: '8px', color: 'black' }}>Pourboire : {tip} €</Typography>
                    <IconButton onClick={() => handleTipChange(-1)} size="small">
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                    <IconButton onClick={() => handleTipChange(1)} size="small">
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Box>
                <Button variant="contained" color="error" sx={{ width: '48%' }} onClick={handlePayment}>
                    PAYER {totalToPay} €
                </Button>
            </Box>
        </Box>
    );
};

export default PaymentPage;