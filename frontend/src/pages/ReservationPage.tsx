import {Box, Button} from "@mui/material";
import React, {useEffect} from "react";
import {generatePath, useNavigate, useParams} from "react-router-dom";
import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import ReservationMainContent from "../components/reservation/ReservationMainContent.tsx";
import {privateRoutes} from "../utils/Routes.ts";

export default function ReservationPage() {
    const navigate = useNavigate();
    const {table} = useParams();

    useEffect(() => {
        if (table === undefined || isNaN(parseFloat(table))) {
            console.warn("No table specified, redirecting to home page");
            navigate(privateRoutes.home);
        }
    }, [navigate, table]);

    const card: React.ReactNode = (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <ActionCardGeneric
                title={`Table ${table}`}
                mainContent={<ReservationMainContent/>}
                buttons={
                    <Button
                        onClick={() => navigate(generatePath(privateRoutes.orderTable, {table: table}))}
                        variant={"contained"}
                        sx={{width: "200px"}}>
                        Reserve
                    </Button>
                }
            />
        </Box>
    );

    return <BackNavPageGeneric title={"Reservation"} readyTables={1} children={card}/>;
}