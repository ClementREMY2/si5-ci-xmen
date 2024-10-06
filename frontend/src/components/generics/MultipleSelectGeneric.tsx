import {FormControl, InputLabel, OutlinedInput, Select, SxProps} from "@mui/material";
import React from "react";

interface MultipleSelectGenericProps<T> {
    label: string;
    items: T[];
    selectedValues: T[];
    onChange?: (value: string | T[]) => void;
    renderItem: (item: T) => React.ReactElement;
    renderValues?: (value: T[]) => React.ReactElement;
    readonly?: boolean;
    disabled?: boolean;
    formControlSx?: SxProps;
}

export default function MultipleSelectGeneric<T>({
    label,
    items,
    selectedValues,
    onChange = () => {},
    renderItem,
    renderValues,
    readonly,
    disabled,
    formControlSx
}: Readonly<MultipleSelectGenericProps<T>>) {
    return (
        <FormControl margin={"dense"} sx={{...formControlSx}}>
            <InputLabel id={"label"}>{label}</InputLabel>
            <Select
                labelId={"label"}
                multiple
                readOnly={readonly}
                disabled={disabled}
                value={selectedValues}
                onChange={(event) => onChange(event.target.value)}
                input={<OutlinedInput label={label}/>}
                renderValue={renderValues}
                variant={"outlined"}>
                {items.map(item => renderItem(item))}
            </Select>
        </FormControl>
    );
}