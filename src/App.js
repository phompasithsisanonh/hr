import "./App.css";
import { useEffect, useState } from "react";
import publicRoutes from "./router/publicRoutes";
import { getRoutes } from "./router/index";
import Router from "./router/router";
import { useDispatch } from "react-redux";
import { get_user_info, check_token } from "./store/Reducer/Auth/auth";
import { useNavigate } from "react-router-dom";
import Loading from "./components/Loading";

function App() {
  const [allRoutes, setAllRoutes] = useState([...publicRoutes]);
  const [authChecked, setAuthChecked] = useState(false); // สถานะว่าเช็ค token แล้ว
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    const routes = getRoutes();
    setAllRoutes((prevRoutes) => [...prevRoutes, routes]);
  }, []);
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await dispatch(check_token()).unwrap(); // เช็ค token ผ่าน API
        await dispatch(get_user_info()); // ถ้าเช็คผ่าน โหลด user info ต่อ
      } catch (error) {
        navigate("/login"); // ถ้าเช็ค token ไม่ผ่าน กลับไปหน้า login
      } finally {
        setAuthChecked(true); // เช็ค token เสร็จแล้ว
      }
    };

    verifyToken();
  }, [dispatch, navigate]);

  // รอเช็ค token ก่อนค่อย render routes
  if (!authChecked) {
    return <Loading/>
  } else {
    return <Router allRoutes={allRoutes} />;
  }
}

export default App;
