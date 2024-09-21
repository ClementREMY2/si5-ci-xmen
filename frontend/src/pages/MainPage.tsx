import {BottomNavigation, BottomNavigationAction, Box, Paper} from "@mui/material";
import React, {useMemo} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {privateRoutes} from "../utils/Routes.ts";

export default function MainPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const changeRoute = useMemo(() => (_event: React.SyntheticEvent, value: string) => {
        navigate(value);
    }, [navigate]);

    return (
        <Box display={"flex"} flexDirection={"column"} height={"100%"} overflow={"unset"}>
            <Box height={"100%"} overflow={"auto"}>
                <Outlet/> {/* This is where the child routes will be rendered */}
            </Box>
            <Paper elevation={3}>
                <BottomNavigation showLabels value={location.pathname} onChange={changeRoute}>
                    <BottomNavigationAction label={"Home"} value={privateRoutes.home}/>
                    <BottomNavigationAction label={"Events"} value={privateRoutes.events}/>
                    <BottomNavigationAction label={"Profile"} value={privateRoutes.profile}/>
                </BottomNavigation>
            </Paper>
        </Box>
    );
}