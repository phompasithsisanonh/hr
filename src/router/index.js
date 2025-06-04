import React from "react";
import MainLayout from "../layout/MainLayout";
import { privateRoutes } from "./privateRoutes";
import ProtectRoutes from "./ProtectRoute";

export const getRoutes = (role) => {
  privateRoutes.map((r) => {
    return (r.element = <ProtectRoutes route={r}>{r.element}</ProtectRoutes>);
  });
  return {
    path: "/",
    element: <MainLayout />,
    children: privateRoutes,
  };
};
