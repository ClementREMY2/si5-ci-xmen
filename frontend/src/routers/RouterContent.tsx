import {Box, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {Outlet} from "react-router-dom";
import PageTemplate from "../pages/PageTemplate.tsx";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ffb347"
        },
        secondary: {
            main: "#f50057"
        },
        background: {
            default: "#1a1a1a"
        }
    }
});

export default function RouterContent() {
    return (
        <ThemeProvider theme={theme}>
            <Box display={"flex"} height={"100%"}>
                <CssBaseline/>
                <PageTemplate>
                    <Outlet/> {/* This is where the child routes will be rendered */}
                </PageTemplate>
            </Box>
        </ThemeProvider>
    );
}
