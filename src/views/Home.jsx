import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);
  if (userInfo.role === "CHR") {
    return <Navigate to="/hr/dashboard" replace />;
  }
};

export default Home;
