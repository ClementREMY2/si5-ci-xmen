import {Box} from "@mui/material";
import React from "react";

interface PageTemplateProps {
    children: React.ReactNode;
}

export default function PageTemplate({children}: Readonly<PageTemplateProps>) {
    return (
        <Box height={"100%"} width={"100%"} overflow={"auto"}>
            {children}
        </Box>
    );
}