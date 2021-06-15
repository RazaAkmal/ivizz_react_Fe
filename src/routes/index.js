import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Login";

// Home
import Home from "../pages/Home";
import ModuleData from "../pages/DataPages/ModuleData";
import DetailedData from "../pages/DataPages/DetailedData";


const authProtectedRoutes = [
  // Dashbaord
  { path: "/", component: Home },
  { path: "/data/:name/:id", component: ModuleData },
  { path: "/data/:name/:id/area/:camId", component: DetailedData },

  // this route should be at the end of all other routes
  /* { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }, */
];

const publicRoutes = [
  { path: "/login", component: Login },
];

export { authProtectedRoutes, publicRoutes };
