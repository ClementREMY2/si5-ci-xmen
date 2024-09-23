import {Box, Paper, Stack, Typography} from "@mui/material";
import DateAndTimeGeneric from "./generics/DateAndTimeGeneric.tsx";

interface MainHeaderProps {
    width?: string | number;
}

export default function MainHeader({width}: Readonly<MainHeaderProps>) {
    return (
        <Paper elevation={3} sx={{backgroundColor: "#f5a623", color: "black", width}}>
            <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                <Stack>
                    <Typography variant={"h2"}>RESTAURANTS DES AMIS</Typography>
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <DateAndTimeGeneric displayDate displayDateLabel displayTime displayTimeLabel/>
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
}