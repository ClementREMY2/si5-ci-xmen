import {
    Box,
    Paper,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Modal,
    IconButton,
    Button,
  } from "@mui/material";
  import React, { useState, useMemo } from "react";
  import { Outlet, useLocation, useNavigate } from "react-router-dom";
  import RemoveIcon from "@mui/icons-material/Remove";
  import AddIcon from "@mui/icons-material/Add";
  import "../index.css";

const tablesData = [
    { id: 101, seats: 2, status: "En cours", event: "Avisto", color: "" },
    { id: 102, seats: 4, status: "Réservée", event: "Avisto", color: "" },
    { id: 103, seats: 5, status: "Réservée", event: "Avisto", color: "" },
    { id: 104, seats: 5, status: "Réservée", event: "Avisto", color: "" },
    { id: 105, seats: 6, status: "Occupée", event: "Aucun", color: "" },
    { id: 106, seats: 2, status: "Occupée", event: "Aucun", color: "" },
    { id: 107, seats: 6, status: "Occupée", event: "SAP", color: "" },
    { id: 108, seats: 4, status: "Libre", event: "Avisto", color: "" },
    { id: 109, seats: 8, status: "Prête", event: "SAP", color: "" },
  ];

  interface Table {
    id: number;
    seats: number;
    status: string;
    event: string;
    color: string;
  }
  
  const applyTableColors = (tables: Table[]) => {
    return tables.map((table) => {
      if (table.status === "En cours") {
        table.color = "var(--waiting-table)";
      } else if (table.status === "Réservée") {
        table.color = "var(--booked-table)";
      } else if (table.status === "Occupée") {
        table.color = "var(--in-use-table)";
      } else if (table.status === "Libre") {
        table.color = "var(--free-table)";
      } else if (table.status === "Prête") {
        table.color = "var(--ready-table)";
      } else {
        table.color = "#9e9e9e";
      }
      return table;
    });
  };

export default function HomePage() {
    const [selectedEvent, setSelectedEvent] = useState("Tous");
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [seats, setSeats] = useState(4); 
    const [status, setStatus] = useState("Libre"); 
    const navigate = useNavigate();
    const location = useLocation();
    const [openModalType, setOpenModalType] = useState<"orderModal" | "reservedModal" | null>(null);


    applyTableColors(tablesData);

    const handleTableClick = (table: Table) => {
      setSelectedTable(table);
      if (table.status === "Libre") {
        setSeats(table.seats);
        setStatus(table.status);
        setOpenModalType("reservedModal");
      }
      else {
        setStatus(table.status);
        setOpenModalType("orderModal");
      }
    }

    const isBookTablePage = location.pathname.startsWith("/bookTable");

    const handleCloseModal = () => {
      tablesData.forEach((table) => {
        if (table.id === selectedTable?.id) {
          table.status = status;
          table.seats = seats;
          applyTableColors(tablesData);
        }
      });
      setSelectedTable(null);
    };

    const incrementSeats = () => setSeats((prev) => Math.min(prev + 1, 10));
    const decrementSeats = () => setSeats((prev) => Math.max(prev - 1, 1));

  
    const filteredTables = useMemo(() => {
      if (selectedEvent === "Tous") {
        return tablesData;
      }
      return tablesData.filter((table) => table.event === selectedEvent);
    }, [selectedEvent]);

    return (
      <Box display={"flex"} flexDirection={"column"} height={"100%"} overflow={"unset"}>
        <Box height={"100%"} overflow={"auto"} padding={2}>
          <Paper
            sx={{
              padding: 2,
              backgroundColor: "#f5a623",
              color: "#000",
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            <Typography variant="h4">RESTAURANTS DES AMIS</Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
              <Typography variant="subtitle1">Heure : 19h34</Typography>
              <Typography variant="subtitle1">Date : 09/09/2024</Typography>
            </Box>
          </Paper>
  
            {!isBookTablePage && (
            <>
            {/* Event Selector */}
            <Box sx={{ marginY: 2 }}>
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

          
            <Grid container spacing={3} justifyContent="center">
              {filteredTables.map((table) => (
                <Grid
                  item xs={12} sm={6} md={4} key={table.id}
                  onClick={() => handleTableClick(table)}
                  style={{ cursor: "grab" }}
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
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6">TABLE {table.id}</Typography>
                    <Typography variant="body2">Nombre : {table.seats}</Typography>
                    <Typography variant="body2">État : {table.status}</Typography>
                    <Typography variant="body2">Événement : {table.event}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}
  
          {}
          <Outlet />
        </Box>

        {}
        <Modal open={openModalType === "reservedModal" && !!selectedTable} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Réserver Table {selectedTable?.id}
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

            <Button
              variant="contained"
              color="error"
              sx={{ mt: 3, width: '100%' }}
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
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Table {selectedTable?.id}
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: "#FFA500", color: "#000", mb: 1, width: '100%' }}
            >
              MODIFIER TABLE
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#FFA500", color: "#000", mb: 1, width: '100%' }}
            >
              COMMANDER
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#FFA500", color: "#000", width: '100%' }}
            >
              PAIEMENT
            </Button>
          </Box>
        </Modal>
      </Box>
    );
}