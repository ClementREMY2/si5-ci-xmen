import "react-toastify/dist/ReactToastify.css";
import "moment/locale/fr.js";
import {Box, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {Outlet} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import PageTemplate from "../pages/PageTemplate.tsx";

moment.locale("fr");

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
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"fr"}>
                <Box display={"flex"} height={"100%"}>
                    <CssBaseline/>
                    <ToastContainer position={"top-center"} theme={"dark"} closeOnClick/>
                    <PageTemplate>
                        <Outlet/> {/* This is where the child routes will be rendered */}
                    </PageTemplate>
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
}
