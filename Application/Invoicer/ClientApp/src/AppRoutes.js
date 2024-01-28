import { Home } from "./components/home/Home";
import Login from "./components/login/Login";
import Transaction from "./components/transaction/Transaction";
import Settings from "./components/settings/Settings";
import PrintTransaction from "./components/transaction/PrintTransaction";

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
        path: "/print-transaction",
        element: <PrintTransaction />
    },
    {
        path: "/settings",
        element: <Settings />
    }
];

export default AppRoutes;
