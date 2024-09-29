import {AddCircle, RemoveCircle} from "@mui/icons-material";
import {IconButton, Stack} from "@mui/material";

interface QuantityButtonsGenericProps {
    addOne: () => void;
    addDisabled?: boolean;
    removeOne: () => void;
    removeDisabled?: boolean;
    hideEdgeStart?: boolean;
    hideEdgeEnd?: boolean;
}

export default function QuantityButtonsGeneric({
    removeOne,
    removeDisabled,
    hideEdgeStart,
    addOne,
    addDisabled,
    hideEdgeEnd
}: Readonly<QuantityButtonsGenericProps>) {
    return (
        <Stack direction={"row"}>
            <IconButton onClick={removeOne} disabled={removeDisabled} edge={hideEdgeStart ? "start" : false}
                        color={"primary"}>
                <RemoveCircle/>
            </IconButton>
            <IconButton onClick={addOne} disabled={addDisabled} edge={hideEdgeEnd ? "end" : false} color={"primary"}>
                <AddCircle/>
            </IconButton>
        </Stack>
    );
}