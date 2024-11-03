import {createBrowserRouter, Navigate} from "react-router-dom";
import EventPage from "../pages/EventPage.tsx";
import EventsPage from "../pages/EventsPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import MainPage from "../pages/MainPage.tsx";
import NotFound from "../pages/NotFoundPage.tsx";
import OrderPage from "../pages/OrderPage.tsx";
import PaymentPage from "../pages/PaymentPage.tsx";
import GroupTablePage from "../pages/GroupTablePage.tsx";
import SideGroupPage from "../pages/SideGroupePage.tsx";
import {privateRoutes, publicRoutes} from "../utils/Routes.ts";
import RouterContent from "./RouterContent.tsx";
import { PopupProvider } from '../components/PopupContext'; // Importer le PopupProvider
import ProfilePage from "../pages/ProfilePage.tsx";
import PersonalPage from "../pages/PersonalPage.tsx";
import TablePage from "../pages/TablePage.tsx";


const getDefaultRedirection = () => privateRoutes.home;

const getRedirection = (route?: string) => <Navigate replace to={route ?? getDefaultRedirection()} />;

export const router = createBrowserRouter([
    {
        element: <PopupProvider><RouterContent /></PopupProvider>,
        children: [
            { path: publicRoutes.login, element: <LoginPage /> },
            // Redirect to home page if no route is specified
            {
                element: <MainPage />,
                children: [
                    { path: privateRoutes.home, element: <HomePage /> },
                    { path: privateRoutes.events, element: <EventsPage /> },
                    { path: privateRoutes.profile, element: <ProfilePage /> }
                ]
            },
            { path: privateRoutes.orderTable, element: <GroupTablePage /> },
            { path: privateRoutes.orderTable, element: <OrderPage /> },
            { path: privateRoutes.payment, element: <PaymentPage /> },
            { path: privateRoutes.paymentEvent, element: <PaymentPage /> },
            {path: privateRoutes.paymentPoc, element: <PaymentPage />},
            { path: privateRoutes.event, element: <EventPage /> },
            { path: privateRoutes.personalPage, element: <PersonalPage /> },
            { path: publicRoutes.notFound, element: <NotFound /> },
            { path: privateRoutes.multiPage, element: <GroupTablePage /> },
            { path: privateRoutes.table, element: <TablePage />},
        ]
    },
    { path: publicRoutes.all, element: getRedirection(publicRoutes.notFound) } // Go to 404 page if no route matches, this should always be the last route
]);