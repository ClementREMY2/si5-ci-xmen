import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BookTablePage() {
    const { tableId } = useParams(); // Récupère l'ID de la table à partir de l'URL
    const navigate = useNavigate();
    const [seats, setSeats] = useState(4); // Nombre de places par défaut
    const [status, setStatus] = useState('Libre');
    const [event, setEvent] = useState('AVISTO');

    // Gérer l'incrément et décrément du nombre de sièges
    const incrementSeats = () => setSeats((prev) => Math.min(prev + 1, 10)); // Limite max de sièges à 10
    const decrementSeats = () => setSeats((prev) => Math.max(prev - 1, 1)); // Limite min de sièges à 1

    return (
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 5 }}>
            {/* Retour à la liste des tables */}
            <Box 
                position="absolute" 
                top={16} 
                left={16} 
                onClick={() => navigate('/')} 
                sx={{ cursor: 'pointer' }}
            >
                <IconButton color="primary">
                    <ArrowBackIcon />
                </IconButton>
            </Box>

            <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, width: '100%', textAlign: 'center', backgroundColor: '#FFA726', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                    Table {tableId}
                </Typography>

                <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        Nombre : {seats}
                    </Typography>
                    <IconButton size="small" onClick={decrementSeats}>
                        <RemoveIcon />
                    </IconButton>
                    <IconButton size="small" onClick={incrementSeats}>
                        <AddIcon />
                    </IconButton>
                </Box>

                <Box mt={2}>
                    <FormControl fullWidth>
                        <InputLabel>État</InputLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="Libre">Libre</MenuItem>
                            <MenuItem value="Occupée">Occupée</MenuItem>
                            <MenuItem value="Réservée">Réservée</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box mt={2}>
                    <FormControl fullWidth>
                        <InputLabel>Événement</InputLabel>
                        <Select
                            value={event}
                            onChange={(e) => setEvent(e.target.value)}
                        >
                            <MenuItem value="AVISTO">AVISTO</MenuItem>
                            <MenuItem value="SAP">SAP</MenuItem>
                            <MenuItem value="Autre">Autre</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Button 
                    variant="contained" 
                    color="error" 
                    sx={{ mt: 3, width: '100%' }}
                    onClick={() => alert('Table réservée!')}
                >
                    RÉSERVER
                </Button>
            </Paper>
        </Box>
    );
}
