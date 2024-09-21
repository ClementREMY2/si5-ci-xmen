import {
    Box,
    Paper,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    BottomNavigation,
    BottomNavigationAction,
  } from "@mui/material";
  import React, { useState, useMemo } from "react";
  import { Outlet, useLocation, useNavigate } from "react-router-dom";
  import HomeIcon from "@mui/icons-material/Home";
  import EventIcon from "@mui/icons-material/Event";
  import AccountCircleIcon from "@mui/icons-material/AccountCircle";
  import { privateRoutes } from "../utils/Routes.ts";
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
  
  for (let i = 0; i < tablesData.length; i++) {
    if (tablesData[i].status === "En cours") {
      tablesData[i].color = "var(--waiting-table)";
    } else if (tablesData[i].status === "Réservée") {
      tablesData[i].color = "var(--booked-table)";
    } else if (tablesData[i].status === "Occupée") {
      tablesData[i].color = "var(--in-use-table)";
    } else if (tablesData[i].status === "Libre") {
      tablesData[i].color = "var(--free-table)";
    } else if (tablesData[i].status === "Prête") {
      tablesData[i].color = "var(--ready-table)";
    } else {
      tablesData[i].color = "#9e9e9e";
    }
  }
  
  export default function MainPage() {
    const [selectedEvent, setSelectedEvent] = useState("Tous");
    const navigate = useNavigate();
    const location = useLocation();
  
    const changeRoute = useMemo(
      () => (_event: React.SyntheticEvent, value: string) => {
        navigate(value);
      },
      [navigate]
    );
  
    // Filtrer les tables en fonction de l'événement sélectionné
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
  
          {/* Table Grid */}
          <Grid 
            container 
            spacing={-5} 
            sx={{ 
              marginX: "auto", 
              maxWidth: "1200px", 
            }}
          >
            {filteredTables.map((table) => (
              <Grid 
                xs={12} 
                sm={6} 
                md={4} 
                key={table.id}
                display="flex"
                justifyContent="center"
                margin={1}
              >
                <Paper
                  sx={{
                    padding: 1,
                    textAlign: "center",
                    backgroundColor: table.color,
                    height: "100px",
                    width: "100%", 
                    maxWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    color: "black",
                    border: "1px solid black",
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
  
          {/* Render Child Routes */}
          <Outlet />
        </Box>
  
        {/* Bottom Navigation */}
        <Paper elevation={3}>
          <BottomNavigation showLabels value={location.pathname} onChange={changeRoute}>
            <BottomNavigationAction label="Home" value={privateRoutes.home} icon={<HomeIcon />} />
            <BottomNavigationAction label="Events" value={privateRoutes.events} icon={<EventIcon />} />
            <BottomNavigationAction label="Profile" value={privateRoutes.profile} icon={<AccountCircleIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
    );
  }
  