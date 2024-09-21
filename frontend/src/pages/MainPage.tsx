import {AccountCircle, Home, Today} from "@mui/icons-material";
import {AppBar, BottomNavigation, BottomNavigationAction, Box} from "@mui/material";
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
            <AppBar position={"sticky"} elevation={3}>
                <BottomNavigation value={location.pathname} onChange={changeRoute} showLabels>
                    <BottomNavigationAction label={"Home"} value={privateRoutes.home} icon={<Home/>}/>
                    <BottomNavigationAction label={"Events"} value={privateRoutes.events} icon={<Today/>}/>
                    <BottomNavigationAction label={"Profile"} value={privateRoutes.profile} icon={<AccountCircle/>}/>
                </BottomNavigation>
            </AppBar>
        </Box>
    );
}