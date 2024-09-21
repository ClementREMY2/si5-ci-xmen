import {Box, Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {privateRoutes} from "../utils/Routes.ts";

export default function NotFound() {
    return (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <Typography variant={"h1"} gutterBottom>404 - Page Not Found</Typography>
            <Typography gutterBottom>Sorry, the page you are looking for could not be found.</Typography>
            <Button component={Link} to={privateRoutes.home} variant={"outlined"}>Go back Home</Button>
        </Box>
    );
};