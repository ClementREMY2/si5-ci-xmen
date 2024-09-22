import {Box, MenuItem, TextField} from "@mui/material";

interface ReservationMainContentProps {
    width?: string | number;
}

export default function ReservationMainContent({width}: Readonly<ReservationMainContentProps>) {
    return (
        <Box width={width ?? "70%"} marginX={"auto"}>
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
}