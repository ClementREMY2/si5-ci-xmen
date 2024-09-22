import {
    Box,
    Paper,
    BottomNavigation,
    BottomNavigationAction,
  } from "@mui/material";
  import React, { useMemo } from "react";
  import { Outlet, useLocation, useNavigate } from "react-router-dom";
  import HomeIcon from "@mui/icons-material/Home";
  import EventIcon from "@mui/icons-material/Event";
  import AccountCircleIcon from "@mui/icons-material/AccountCircle";
  import { privateRoutes } from "../utils/Routes.ts";
  

  export default function MainPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const changeRoute = useMemo(() => (_event: React.SyntheticEvent, value: string) => {
        navigate(value);
    }, [navigate])    
  
    return (
      <Box display={"flex"} flexDirection={"column"} height={"100%"} overflow={"unset"} maxWidth={1024} maxHeight={1366}>
        <Box height={"100%"} overflow={"auto"} padding={2}>
          <Outlet />
        </Box>

        {}
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
  