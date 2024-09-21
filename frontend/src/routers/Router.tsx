import React from "react";
import {createBrowserRouter, Navigate} from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import NotFound from "../pages/NotFoundPage.tsx";
import PageTemplate from "../pages/PageTemplate.tsx";
import {privateRoutes, publicRoutes} from "../utils/Routes.ts";
import RouterContent from "./RouterContent.tsx";

const renderPage = (page: React.ReactNode) => <PageTemplate>{page}</PageTemplate>;

const getDefaultRedirection = () => privateRoutes.home;

const getRedirection = (route?: string) => <Navigate replace to={route ?? getDefaultRedirection()}/>;

export const router = createBrowserRouter([
    {path: publicRoutes.base, element: getRedirection()},
    {
        element: <RouterContent/>,
        children: [
            {path: publicRoutes.login, element: renderPage(<LoginPage/>)},
            {path: privateRoutes.home, element: renderPage(<HomePage/>)},
            {path: publicRoutes.notFound, element: renderPage(<NotFound/>)}
        ]
    },
    {path: publicRoutes.all, element: getRedirection(publicRoutes.notFound)} // Go to 404 page if no route matches, this should always be the last route
])