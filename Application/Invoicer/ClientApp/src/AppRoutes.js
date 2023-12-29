import { Counter } from "./components/Counter";
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
        path: "/counter",
        element: <Counter />
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
