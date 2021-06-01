import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Login";

// Home
import Home from "../pages/Home";
import ModuleData from "../pages/Home/ModuleData";


const authProtectedRoutes = [
  // Dashbaord
  { path: "/", component: Home },
  { path: "/data/:id", component: ModuleData },

  // this route should be at the end of all other routes
  /* { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }, */
];

const publicRoutes = [
  { path: "/login", component: Login },
];

export { authProtectedRoutes, publicRoutes };
