import {Box, MenuItem, TextField} from "@mui/material";
import {Table, TableStatusEnum} from "../../interfaces/Table.ts";

interface ReservationMainContentProps {
    reservation: Table;
    handleChange: (key: string, value: string | number | undefined) => void;
    width?: string | number;
}

export default function ReservationMainContent({
    reservation,
    handleChange,
    width
}: Readonly<ReservationMainContentProps>) {
    return (
        <Box width={width ?? "70%"} marginX={"auto"}>
            <TextField label={"Number"} type={"number"} value={reservation.nbPeople} variant={"outlined"}
                       onChange={e => handleChange("nbPeople", e.target.value)}
                       margin={"normal"} slotProps={{htmlInput: {min: 1}}} required fullWidth/>
            <TextField label={"Status"} select value={reservation.status} variant={"outlined"}
                       onChange={e => handleChange("status", e.target.value)}
                       margin={"normal"} required fullWidth>
                <MenuItem value={TableStatusEnum.OCCUPIED}>Occupied</MenuItem>
                <MenuItem value={TableStatusEnum.RESERVED}>Reserved</MenuItem>
            </TextField>
            <TextField label={"Event"} select value={reservation.event ?? "None"} variant={"outlined"}
                       onChange={e => handleChange("event", e.target.value === "None" ? undefined : e.target.value)}
                       margin={"normal"} required fullWidth>
                <MenuItem value={"None"}>None</MenuItem>
                <MenuItem value={"Avisto"}>Avisto</MenuItem>
                <MenuItem value={"SAP"}>SAP</MenuItem>
            </TextField>
        </Box>
    );
}