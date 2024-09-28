import { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
    Box,
    Button,
    FormControl,
    Grid2,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    Typography
} from "@mui/material";
import {useMemo, useState} from "react";
import {generatePath, Outlet, useNavigate} from "react-router-dom";
import "../index.css";
import {privateRoutes} from "../utils/Routes.ts";
import { getTables } from "../services/diningService.ts"
import { Table, TableStatusEnum, TableWithOrderDto } from "../interfaces/Table.ts"

/*
const tablesData = [
    {id: 101, seats: 2, status: "En cours", event: "Avisto", color: ""},
    {id: 102, seats: 4, status: "Réservée", event: "Avisto", color: ""},
    {id: 103, seats: 5, status: "Réservée", event: "Avisto", color: ""},
    {id: 104, seats: 5, status: "Réservée", event: "Avisto", color: ""},
    {id: 105, seats: 6, status: "Occupée", event: "Aucun", color: ""},
    {id: 106, seats: 2, status: "Occupée", event: "Aucun", color: ""},
    {id: 107, seats: 6, status: "Occupée", event: "SAP", color: ""},
    {id: 108, seats: 4, status: "Libre", event: "Avisto", color: ""},
    {id: 109, seats: 8, status: "Prête", event: "SAP", color: ""}
];
*/


export const transformTableData = (dto: TableWithOrderDto[]): Table[] => {
    return dto.map((tableDto) => {
      // Détermine le statut de la table en fonction de la propriété 'taken' et de la logique business
      let status: TableStatusEnum;
      if (!tableDto.taken) {
        status = TableStatusEnum.AVAILABLE;
      } else if (tableDto.tableOrderId) {
        status = TableStatusEnum.ORDER_IN_PROGRESS;
      } else {
        status = TableStatusEnum.OCCUPIED;
      }
  
      const table: Table = {
        id: tableDto._id,           // Correspond à l'ID dans le back-end
        table: tableDto.number ?? 0,     // Le numéro de la table
        nbPeople: 4,                // Fixe ou à calculer si tu as des données (ici, j'utilise un nombre fictif)
        status: status,             // Le statut déterminé plus haut
        event: '',
        color: ''                // Aucune info sur l'événement, donc vide pour l'instant
      };
  
      return table;
    });
};


const applyTableColors = (tables: Table[]) => {
    tables.map((table) => {
        if (table.status === TableStatusEnum.ORDER_IN_PROGRESS) {
            table.color = "var(--waiting-table)";
        } else if (table.status === TableStatusEnum.RESERVED) {
            table.color = "var(--booked-table)";
        } else if (table.status === TableStatusEnum.OCCUPIED) {
            table.color = "var(--in-use-table)";
        } else if (table.status === TableStatusEnum.AVAILABLE) {
            table.color = "var(--free-table)";
        } else if (table.status === TableStatusEnum.ORDER_READY) {
            table.color = "var(--ready-table)";
        } else {
            table.color = "#9e9e9e";
        }
        const tablesCopy = tables;
        return tablesCopy;
    });
};

export default function HomePage() {
    const navigate = useNavigate();

    const [selectedEvent, setSelectedEvent] = useState("Tous");
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [seats, setSeats] = useState(4);
    const [status, setStatus] = useState("Libre");
    const [openModalType, setOpenModalType] = useState<"orderModal" | "reservedModal" | null>(null);

    const [tables, setTables] = useState<Table[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                let dataDTO = await getTables();
                const dataFront = transformTableData(dataDTO);
                setTables(dataFront);
            } catch (error: any) {
                setError('Erreur lors de la récupération des tables.');
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    /*
    if (loading) {
        return <p>Chargement des tables...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
        */

    applyTableColors(tables);

    const handleTableClick = (table: Table) => {
        setSelectedTable(table);
        if (table.status === TableStatusEnum.AVAILABLE) {
            setSeats(4);
            setStatus(table.status);
            setOpenModalType("reservedModal");
        } else {
            setStatus(table.status);
            setOpenModalType("orderModal");
        }
    };

    const handleCloseModal = () => {
        tables.forEach((table) => {
            if (table.id === selectedTable?.id) {
                table.status = status as TableStatusEnum;
                applyTableColors(tables);
            }
        });
        setSelectedTable(null);
    };

    const incrementSeats = () => setSeats((prev) => Math.min(prev + 1, 10));
    const decrementSeats = () => setSeats((prev) => Math.max(prev - 1, 1));


    const filteredTables = useMemo(() => {
        return selectedEvent === "Tous" 
            ? tables 
            : tables.filter((table) => table.event === selectedEvent);
    }, [selectedEvent, tables]);   
    
    return (
        <Box display={"flex"} flexDirection={"column"} height={"100%"} overflow={"unset"}>
            <Box height={"100%"} overflow={"auto"} padding={2}>
                <Paper
                    sx={{
                        padding: 2,
                        backgroundColor: "#f5a623",
                        color: "#000",
                        textAlign: "center",
                        marginBottom: 2
                    }}
                >
                    <Typography variant="h4">RESTAURANTS DES AMIS</Typography>
                    <Box sx={{display: "flex", justifyContent: "space-between", marginTop: 1}}>
                        <Typography variant="subtitle1">Heure : 19h34</Typography>
                        <Typography variant="subtitle1">Date : 09/09/2024</Typography>
                    </Box>
                </Paper>

                {(
                    <>
                        {/* Event Selector */}
                        <Box sx={{marginY: 2}}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel>Événement</InputLabel>
                                <Select
                                    label="Événement"
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                >
                                    <MenuItem value="Tous">Tous</MenuItem>
                                    <MenuItem value="Avisto">Avisto</MenuItem>
                                    <MenuItem value="SAP">SAP</MenuItem>
                                    <MenuItem value="Aucun">Aucun</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>


                        <Grid2 container spacing={3} justifyContent="center">
                            {filteredTables.map((table) => (
                                <Grid2 size={4} onClick={() => handleTableClick(table) } 
                                    //style={{ cursor: table.status === "Libre" ? "pointer" : "not-allowed" }}
                                >
                                    <Paper
                                        sx={{
                                            padding: 2,
                                            textAlign: "center",
                                            backgroundColor: table.color,
                                            height: "100px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            borderRadius: 2
                                        }}
                                    >
                                        <Typography variant="h6">TABLE {table.id}</Typography>
                                        <Typography variant="body2">Nombre : {4}</Typography>
                                        <Typography variant="body2">État : {table.status}</Typography>
                                        <Typography variant="body2">Événement : {table.event}</Typography>
                                    </Paper>
                                </Grid2>
                            ))}
                        </Grid2>
                    </>
                )}

                {}
                <Outlet/>
            </Box>

            {}
            <Modal open={openModalType === "reservedModal" && !!selectedTable} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">
                        Réserver Table {selectedTable?.id}
                    </Typography>

                    <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="body1" sx={{mr: 2}}>
                            Nombre : {seats}
                        </Typography>
                        <IconButton size="small" onClick={decrementSeats}>
                            <RemoveIcon/>
                        </IconButton>
                        <IconButton size="small" onClick={incrementSeats}>
                            <AddIcon/>
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

                    <Button
                        variant="contained"
                        color="error"
                        sx={{mt: 3, width: "100%"}}
                        onClick={() => {
                            handleCloseModal();
                        }}
                    >
                        RÉSERVER
                    </Button>
                </Box>
            </Modal>

            {}
            <Modal open={openModalType === "orderModal" && !!selectedTable} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 300,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Typography variant="h6" sx={{mb: 2}}>
                        Table {selectedTable?.id}
                    </Typography>
                    <Button
                        onClick={() => navigate(generatePath(privateRoutes.reserveTable, {table: selectedTable?.id}))}
                        variant="contained"
                        sx={{bgcolor: "#FFA500", color: "#000", mb: 1, width: "100%"}}
                    >
                        MODIFIER TABLE
                    </Button>
                    <Button
                        onClick={() => navigate(generatePath(privateRoutes.orderTable, {table: selectedTable?.id}))}
                        variant="contained"
                        sx={{bgcolor: "#FFA500", color: "#000", mb: 1, width: "100%"}}
                    >
                        COMMANDER
                    </Button>
                    <Button
                        onClick={() => navigate(generatePath(privateRoutes.payment, {table: selectedTable?.id}))}
                        variant="contained"
                        sx={{bgcolor: "#FFA500", color: "#000", width: "100%"}}
                    >
                        PAIEMENT
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}