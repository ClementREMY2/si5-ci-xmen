import {Box, Card, CardContent, Stack, Typography} from "@mui/material";
import React, {useMemo} from "react";

interface ActionCardGenericProps {
    title: string;
    leftTitle?: string;
    rightTitle?: string;
    mainContent?: React.ReactNode;
    buttons?: React.ReactElement[];
    minWidth?: string | number;
    minHeight?: string | number;
}

export default function ActionCardGeneric({
    title,
    leftTitle,
    rightTitle,
    mainContent,
    buttons,
    minWidth,
    minHeight
}: Readonly<ActionCardGenericProps>) {
    const cardSx = useMemo(() => ({
        minWidth: minWidth ?? "50%",
        minHeight: minHeight ?? "30%",
        maxWidth: "95%",
        maxHeight: "95%",
        borderRadius: 5
    }), [minWidth, minHeight]);

    return (
        <Card sx={cardSx}>
            <CardContent sx={{display: "flex", flexDirection: "column", height: "100%"}}>
                <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} position={"relative"}>
                    {leftTitle &&
                        <Typography variant={"h6"} sx={{position: "absolute", left: 0}}>{leftTitle}</Typography>}
                    <Typography variant={"h4"}>{title}</Typography>
                    {rightTitle &&
                        <Typography variant={"h6"} sx={{position: "absolute", right: 0}}>{rightTitle}</Typography>}
                </Stack>
                <Box flexGrow={1} overflow={"auto"}>
                    {mainContent}
                </Box>
                <Stack direction={"row"} justifyContent={"space-around"} alignItems={"center"} paddingTop={2}>
                    {buttons}
                </Stack>
            </CardContent>
        </Card>
    );
}