import Test from "../HRpage/Test";
import Home from "../views/Home";
import Login from "../views/Login";
import Register from "../views/Register";

const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/test",
    element: <Test />,
  },
];
export default publicRoutes;
