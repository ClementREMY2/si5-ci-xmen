import {Box, Button, MenuItem, TextField} from "@mui/material";
import React from "react";
import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";

export default function ReservationPage() {
    const mainContent = (
        <Box width={"70%"} marginX={"auto"}>
            <TextField label={"Number"} type={"number"} margin={"normal"} variant={"outlined"} required
                       fullWidth/>
            <TextField label={"Status"} select margin={"normal"} variant={"outlined"} required
                       fullWidth>
                <MenuItem value={"Occupied"}>Occupied</MenuItem>
                <MenuItem value={"Reserved"}>Reserved</MenuItem>
            </TextField>
            <TextField label={"Number"} select margin={"normal"} variant={"outlined"} required
                       fullWidth>
                <MenuItem value={"Aucun"}>Aucun</MenuItem>
                <MenuItem value={"Avisto"}>Avisto</MenuItem>
                <MenuItem value={"SAP"}>SAP</MenuItem>
            </TextField>
        </Box>
    );

    const card: React.ReactNode = (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <ActionCardGeneric
                title={"Table 108"}
                mainContent={mainContent}
                buttons={[<Button variant={"contained"} sx={{width: "200px"}}>Reserve</Button>]}
            />
        </Box>
    );

    return <BackNavPageGeneric title={"Reservation"} readyTables={1} children={card}/>;
}