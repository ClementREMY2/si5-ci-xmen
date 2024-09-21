import {createBrowserRouter, Navigate} from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import NotFound from "../pages/NotFoundPage.tsx";
import {privateRoutes, publicRoutes} from "../utils/Routes.ts";

const getDefaultRedirection = () => privateRoutes.home;

const getRedirection = (route?: string) => <Navigate replace to={route ?? getDefaultRedirection()}/>;

export const router = createBrowserRouter([
    {path: publicRoutes.base, element: getRedirection()},
    {path: publicRoutes.login, element: <LoginPage/>},
    {path: privateRoutes.home, element: <HomePage/>},
    {path: publicRoutes.notFound, element: <NotFound/>},
    {path: publicRoutes.all, element: getRedirection(publicRoutes.notFound)} // Go to 404 page if no route matches, this should always be the last route
])