import {createBrowserRouter, Navigate} from "react-router-dom";
import EventsPage from "../pages/EventsPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import MainPage from "../pages/MainPage.tsx";
import NotFound from "../pages/NotFoundPage.tsx";
import OrderPage from "../pages/OrderPage.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";
import ReservationPage from "../pages/ReservationPage.tsx";
import {privateRoutes, publicRoutes} from "../utils/Routes.ts";
import RouterContent from "./RouterContent.tsx";

const getDefaultRedirection = () => privateRoutes.home;

const getRedirection = (route?: string) => <Navigate replace to={route ?? getDefaultRedirection()}/>;

export const router = createBrowserRouter([
    {
        element: <RouterContent/>,
        children: [
            {path: publicRoutes.login, element: <LoginPage/>},
            {path: privateRoutes.main, element: getRedirection()}, // Redirect to home page if no route is specified
            {
                element: <MainPage/>,
                children: [
                    {path: privateRoutes.home, element: <HomePage/>},
                    {path: privateRoutes.events, element: <EventsPage/>},
                    {path: privateRoutes.profile, element: <ProfilePage/>}
                ]
            },
            {path: privateRoutes.reservation, element: <ReservationPage/>},
            {path: privateRoutes.orderTable, element: <OrderPage/>},
            {path: publicRoutes.notFound, element: <NotFound/>}
        ]
    },
    {path: publicRoutes.all, element: getRedirection(publicRoutes.notFound)} // Go to 404 page if no route matches, this should always be the last route
])