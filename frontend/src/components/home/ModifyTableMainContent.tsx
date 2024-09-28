import {Box, MenuItem, TextField} from "@mui/material";
import {useMemo} from "react";
import {Table, TableStatusEnum} from "../../interfaces/Table.ts";
import {eventsMock} from "../../mocks/Event.ts";

interface ModifyTableMainContentProps {
    table: Table;
    handleChange: (key: keyof Table, value: string | number | undefined) => void;
}

const modifyStatusList = [TableStatusEnum.AVAILABLE, TableStatusEnum.RESERVED, TableStatusEnum.OCCUPIED];

export default function ModifyTableMainContent({table, handleChange}: Readonly<ModifyTableMainContentProps>) {
    const readonlyStatus = useMemo(() => !modifyStatusList.find(status => table.status === status), [table.status]);

    return (
        <Box width={"70%"} marginX={"auto"}>
            <TextField label={"Nombre"} type={"number"} value={table.nbPeople} variant={"outlined"}
                       onChange={e => handleChange("nbPeople", e.target.value)}
                       margin={"normal"} slotProps={{htmlInput: {min: 1}}} required fullWidth/>
            <TextField label={"État"} select value={table.status} variant={"outlined"}
                       onChange={e => handleChange("status", e.target.value)} margin={"normal"}
                       disabled={readonlyStatus} required fullWidth>
                {readonlyStatus
                    ? <MenuItem value={table.status}>{table.status}</MenuItem>
                    : modifyStatusList.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))
                }
            </TextField>
            <TextField label={"Événement"} select value={table.event ?? "Aucun"} variant={"outlined"}
                       onChange={e => handleChange("event", e.target.value === "Aucun" ? undefined : e.target.value)}
                       margin={"normal"} required fullWidth>
                <MenuItem value={"Aucun"}>Aucun</MenuItem>
                {eventsMock.map(event => (
                    <MenuItem key={event.id} value={event.name}>
                        {event.name}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
}