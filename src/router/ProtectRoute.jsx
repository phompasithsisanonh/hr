import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    // ยังไม่ login → กลับหน้า login
    return <Navigate to="/login" replace />;
  }

  if (userInfo.role !== "CHR") {
    // login แล้วแต่ไม่ใช่ HR → ไปหน้าอื่น
    return <Navigate to="/unauthorized" replace />;
  }

  // role = "CHR" ถึงจะเข้าได้
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

export default ProtectRoute;
