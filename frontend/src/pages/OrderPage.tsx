import {Box, Button} from "@mui/material";
import React from "react";
import ActionCardGeneric from "../components/generics/ActionCardGeneric.tsx";
import BackNavPageGeneric from "../components/generics/BackNavPageGeneric.tsx";
import MenuList from "../components/order/MenuList.tsx";

export default function OrderPage() {
    const card: React.ReactNode = (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <ActionCardGeneric
                title={"Table 108"}
                leftTitle={"Avisto"}
                rightTitle={"0 €"}
                mainContent={<MenuList/>}
                buttons={[<Button variant={"contained"} sx={{width: "200px"}}>Order</Button>]}
            />
        </Box>
    );

    return <BackNavPageGeneric title={"Order"} readyTables={2} children={card}/>;
}