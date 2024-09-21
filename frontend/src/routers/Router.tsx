import {createBrowserRouter} from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import {routesLinks} from "../utils/Routes.ts";

export const router = createBrowserRouter([
    {path: routesLinks.home, element: <HomePage/>}
])