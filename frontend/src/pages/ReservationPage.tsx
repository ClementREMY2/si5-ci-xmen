import {Box, Button} from "@mui/material";
import React from "react";
import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import ReservationMainContent from "../components/reservation/ReservationMainContent.tsx";

export default function ReservationPage() {
    const card: React.ReactNode = (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <ActionCardGeneric
                title={"Table 108"}
                mainContent={<ReservationMainContent/>}
                buttons={[<Button variant={"contained"} sx={{width: "200px"}}>Reserve</Button>]}
            />
        </Box>
    );

    return <BackNavPageGeneric title={"Reservation"} readyTables={1} children={card}/>;
}