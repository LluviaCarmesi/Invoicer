import { Home } from "./components/home/Home";
import Login from "./components/login/Login";
import Transaction from "./components/transaction/Transaction";
import Settings from "./components/settings/Settings";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/transaction",
        element: <Transaction />
    },
    {
        path: "/settings",
        element: <Settings />
    }
];

export default AppRoutes;
