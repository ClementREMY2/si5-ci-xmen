import {ArrowBack} from "@mui/icons-material";
import {AppBar, Avatar, Box, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import {green} from "@mui/material/colors";
import moment from "moment";
import React, {useEffect} from "react";

interface BackNavPageGenericProps {
    title: string;
    readyTables: number;
    children?: React.ReactNode;
}

export default function BackNavPageGeneric({title, readyTables, children}: Readonly<BackNavPageGenericProps>) {
    const [date, setDate] = React.useState(moment(new Date()));

    // Update the date every second
    useEffect(() => {
        const interval = setInterval(() => {
            setDate(moment(new Date()));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box display={"flex"} flexDirection={"column"} height={"100%"} overflow={"unset"}>
            <AppBar position={"sticky"} elevation={3}>
                <Toolbar>
                    <IconButton edge={"start"} aria-label={"Back arrow"} sx={{mr: 2}}>
                        <ArrowBack fontSize={"large"}/>
                    </IconButton>
                    <Typography variant={"h3"} sx={{flexGrow: 1}}>{title}</Typography>
                    <Stack alignItems={"center"}>
                        <Typography variant={"h6"}>{date.format("DD/MM/YYYY")}</Typography>
                        <Typography variant={"h6"}>{date.format("HH")}h{date.format("mm")}</Typography>
                    </Stack>
                    <IconButton edge={"end"} aria-label={"Number of ready tables"} sx={{ml: 2}}>
                        <Avatar sx={{bgcolor: green[500]}}>{readyTables}</Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box height={"100%"} overflow={"auto"}>
                {children}
            </Box>
        </Box>
    );
}