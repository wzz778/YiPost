import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import { RouteObject } from "react-router-dom";
const Discover = lazy(() => import("@/views/discover"));
const Users = lazy(() => import("@/views/users"));
const Task = lazy(() => import("@/views/task"));
const StroeTemplate = lazy(
  () => import("@/views/discover/c-pages/StroeTemplate")
);
const AxiosTemplate = lazy(
  () => import("@/views/discover/c-pages/AxiosTemplate")
);
const Album = lazy(() => import("@/views/discover/c-pages/album"));

const UsersIndex = lazy(() => import("@/views/users/User/index"));
const LearnIndex = lazy(() => import("@/views/users/Learn/index"));
const DeptIndex = lazy(() => import("@/views/users/Dept/index"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/users" />,
  },
  {
    path: "/users",
    element: <Users />,
    children: [
      {
        path: "/users",
        element: <Navigate to="/users/user/index" />,
      },
      {
        path: "/users/user/index",
        element: <UsersIndex />,
      },
      {
        path: "/users/dept/index",
        element: <DeptIndex />,
      },
      {
        path: "/users/learn/index",
        element: <LearnIndex />,
      },
    ],
  },
  {
    path: "/discover",
    element: <Discover />,
    children: [
      {
        path: "/discover",
        element: <Navigate to="/discover/stroeTemplate" />,
      },
      {
        path: "/discover/stroeTemplate",
        element: <StroeTemplate />,
      },
      {
        path: "/discover/axiosTemplate",
        element: <AxiosTemplate />,
      },
      {
        path: "/discover/album",
        element: <Album />,
      },
    ],
  },
  {
    path: "/task",
    element: <Task />,
  },
];

export default routes;
