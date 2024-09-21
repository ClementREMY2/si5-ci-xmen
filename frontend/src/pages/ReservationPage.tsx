import {ArrowBack} from "@mui/icons-material";
import {AppBar, Avatar, Box, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import {green} from "@mui/material/colors";
import {Outlet} from "react-router-dom";

export default function ReservationPage() {
    return (
        <Box display={"flex"} flexDirection={"column"} height={"100%"} overflow={"unset"}>
            <AppBar position={"fixed"} elevation={3}>
                <Toolbar>
                    <IconButton edge={"start"} aria-label={"Back arrow"} sx={{mr: 2}}>
                        <ArrowBack fontSize={"large"}/>
                    </IconButton>
                    <Typography variant={"h4"} sx={{flexGrow: 1}}>Reservation</Typography>
                    <Stack alignItems={"center"}>
                        <Typography variant={"h6"}>01/01/2024</Typography>
                        <Typography variant={"h6"}>19h00</Typography>
                    </Stack>
                    <IconButton edge={"end"} aria-label={"Number of ready tables"} sx={{ml: 2}}>
                        <Avatar sx={{bgcolor: green[500]}}>1</Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box height={"100%"} overflow={"auto"}>
                <Outlet/> {/* This is where the child routes will be rendered */}
            </Box>
        </Box>
    );
}