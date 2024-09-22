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
    const [currentDateTime, setCurrentDateTime] = useState<string>(new Date().toLocaleString());
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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleTipChange = (value: number) => {
        setTip(prevTip => Math.max(0, prevTip + value));
    };

    const calculateMaxTotal = () => {
        const maxTotal = items.reduce((sum, item) => sum + (item.price * item.ordered), 0);
        setMaxTotalPrice(maxTotal);
    };

    useEffect(() => {
        calculateMaxTotal();
    }, []);

    useEffect(() => {
        const total = items.reduce((sum, item) => sum + (item.price * item.remaining), 0);
        setTotalItemsPrice(total);

        if (isTotalChecked) {
            setTotalToDisplay(maxTotalPrice);
        }
    }, [items, isTotalChecked, maxTotalPrice]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setIsTotalChecked(isChecked);

        if (isChecked) {
            setTotalToDisplay(maxTotalPrice);
        } else {
            setTotalToDisplay(0);
            setItems(prevItems => prevItems.map(item => ({ ...item, remaining: item.ordered })));
        }
    };

    const handleItemQuantityChange = (index: number, change: number) => {
        if (isTotalChecked) return;

        setItems(prevItems => {
            return prevItems.map((item, idx) => {
                if (idx === index) {
                    const newRemaining = Math.max(0, Math.min(item.remaining + change, item.ordered));
                    if (change > 0) {
                        const priceAdjustment = item.price;
                        setTotalToDisplay(prevTotal => prevTotal - priceAdjustment);
                    } else if (change < 0) {
                        const priceAdjustment = item.price;
                        setTotalToDisplay(prevTotal => prevTotal + priceAdjustment);
                    }
                    return { ...item, remaining: newRemaining };
                }
                return item;
            });
        });
    };

    const handlePayment = () => {
        navigate('/home');
    };

    const totalToPay = totalToDisplay + tip;

    return (
        <Box sx={{ backgroundColor: '#FFB74D', height: '100vh', padding: '16px', color: 'black' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Button variant="text" sx={{ fontSize: '18px', color: 'black' }}>Paiement</Button>
                <Typography variant="h6" sx={{ color: 'black' }}>{currentDateTime}</Typography>
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
                <Button
                    variant="contained"
                    color="error"
                    sx={{ width: '48%' }}
                    onClick={handlePayment}
                    disabled={totalToDisplay !== maxTotalPrice} // Désactiver le bouton si totalToDisplay != maxTotalPrice
                >
                    PAYER {totalToPay} €
                </Button>
            </Box>
        </Box>
    );
};

export default PaymentPage;