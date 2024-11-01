import "./App.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {RouterProvider} from "react-router-dom";
import {router} from "./routers/Router.tsx";

export default function App() {
    return <RouterProvider router={router}/>;
}
