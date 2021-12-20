import React, { useEffect } from "react";
import logo from "../../images/logo.png";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserList from "../../components/UserList/UserList";
import AssetList from "../../components/AssetList/AssetList";
import AssignmentList from "../../components/AssignmentList/AssignmentList";
import ReportList from "../../components/ReportList/ReportList";
import RequestReturn from "../../components/RequestReturn/RequestReturn";

import "./Menu.css";
import AssetCreate from "../../components/Asset-create-page/AssetCreate";
import AssetEdit from "../../components/Asset-edit-page/AssetEdit";
import UserEdit from "../../components/User-edit-page/UserEdit";
import LoginPage from "../../components/LoginPage/LoginPage";
import HomePage from "../../components/HomePage/HomePage";
import UserCreate from "../../components/User-create-page/UserCreate";

import NoMatch from "../../components/NoMatch/404NotFound";
import AssignmentCreate from "../../components/Assignment-create-page/AssignmentCreate";
import AssignmentEdit from "../../components/Assignment-edit/AssignmentEdit";
import Server500 from "../../components/NoMatch/505Server";
import jwt_decode from "jwt-decode";
import Unauthorized from "../../components/NoMatch/401Unauthorized";

const Menu = ({ token, setToken }) => {
  const pathname = useLocation();
  useEffect(() => {
    let item_actives = document.querySelectorAll(".menu__item a");
    item_actives.forEach((item) =>
      item.addEventListener("click", function () {
        item_actives.forEach((item) => item.classList.remove("active"));
        item.classList.add("active");
      })
    );
  });
  const Home = () => {
    localStorage.setItem("page", "Home");
    return !token ? (
      <Navigate replace to="/login" />
    ) : (
      <HomePage token={token} setToken={setToken} />
    );
  };

  function User() {
    localStorage.setItem("page", "Manage User");
    if (!token) return <Navigate replace to="/login" />;
    else if (jwt_decode(token).firstTime) return <Home />;
    else return <UserList token={token} />;
  }

  function CreateUser() {
    localStorage.setItem("page", "Manage User > Create New User");
    if (!token) return <Navigate replace to="/login" />;
    else if (jwt_decode(token).firstTime) return <Home />;
    else return <UserCreate token={token} />;
  }

  function EditUser() {
    localStorage.setItem("page", "Manage User > Edit User");
    if (!token) return <Navigate replace to="/login" />;
    else if (jwt_decode(token).firstTime) return <Home />;
    else return <UserEdit token={token} />;
  }

  return (
    <div className="content__box">
      {token && jwt_decode(token).type === "ROLE_ADMIN" && (
        <div className="content__box--left">
          <div className="content__box--left__logo">
            <img className="logo__image" src={logo} alt="logo" />
            <p className="logo__title">Online Asset Management</p>
          </div>
          <div className="content__box--left__menu">
            <ul className="menu_box">
              <li className="menu__item">
                <Link
                  to="/"
                  className={
                    pathname.pathname === "/login" ||
                    pathname.pathname === "/" ||
                    pathname.pathname === "/home"
                      ? "active"
                      : ""
                  }
                >
                  Home
                </Link>
              </li>
              <li className="menu__item">
                <Link
                  to="/user"
                  className={
                    pathname.pathname === "/user" ||
                    pathname.pathname === "/create-user" ||
                    pathname.pathname.includes("/edit-user")
                      ? "active"
                      : ""
                  }
                >
                  Manage User
                </Link>
              </li>
              <li className="menu__item">
                <Link
                  to="/asset"
                  className={
                    pathname.pathname === "/asset" ||
                    pathname.pathname === "/create-asset" ||
                    pathname.pathname.includes("/edit-asset")
                      ? "active"
                      : ""
                  }
                >
                  Manage Asset
                </Link>
              </li>
              <li className="menu__item">
                <Link
                  to="/assignment"
                  className={
                    pathname.pathname === "/assignment" ||
                    pathname.pathname === "/create-assignment" ||
                    pathname.pathname.includes("/edit-assignment")
                      ? "active"
                      : ""
                  }
                >
                  Manage Assignment
                </Link>
              </li>
              <li className="menu__item">
                <Link
                  to="/request_return"
                  className={
                    pathname.pathname === "/request_return" ? "active" : ""
                  }
                >
                  Request for Returning
                </Link>
              </li>
              <li className="menu__item">
                <Link
                  to="/report"
                  className={pathname.pathname === "/report" ? "active" : ""}
                >
                  Report
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
      {token && jwt_decode(token).type === "ROLE_STAFF" && (
        <div className="content__box--left">
          <div className="content__box--left__logo">
            <img className="logo__image" src={logo} alt="logo" />
            <p className="logo__title">Online Asset Management</p>
          </div>
          <div className="content__box--left__menu">
            <ul className="menu_box">
              <li className="menu__item">
                <Link to="/" className="active">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route
          path="/asset"
          element={
            !token ? (
              <Navigate replace to="/login" />
            ) : jwt_decode(token).firstTime ? (
              <Home />
            ) : (
              <AssetList token={token} />
            )
          }
        />
        <Route
          path="/assignment"
          element={
            !token ? (
              <Navigate replace to="/login" />
            ) : jwt_decode(token).firstTime ? (
              <Home />
            ) : (
              <AssignmentList token={token} />
            )
          }
        />
        <Route
          path="/request_return"
          element={
            !token ? (
              <Navigate replace to="/login" />
            ) : jwt_decode(token).firstTime ? (
              <Home />
            ) : (
              <RequestReturn token={token} />
            )
          }
        />
        <Route
          path="/report"
          element={
            !token ? (
              <Navigate replace to="/login" />
            ) : jwt_decode(token).firstTime ? (
              <Home />
            ) : (
              <ReportList token={token} />
            )
          }
        />
        <Route path="/create-user" element={<CreateUser token={token} />} />
        <Route
          path="/edit-user/:staffCode"
          element={<EditUser token={token} />}
        />
        <Route
          path="/create-asset"
          element={
            !token ? (
              <Navigate replace to="/login" />
            ) : jwt_decode(token).firstTime ? (
              <Home />
            ) : (
              <AssetCreate token={token} />
            )
          }
        />
        <Route
          path="/edit-asset/:assetCode"
          element={
            !token ? (
              <Navigate replace to="/login" />
            ) : jwt_decode(token).firstTime ? (
              <Home />
            ) : (
              <AssetEdit token={token} />
            )
          }
        />
        <Route
          path="/create-assignment"
          element={
            !token ? (
              <Navigate replace to="/login" />
            ) : jwt_decode(token).firstTime ? (
              <Home />
            ) : (
              <AssignmentCreate token={token} />
            )
          }
        />
        <Route
          path="/edit-assignment/:assignmentID"
          element={
            !token ? (
              <Navigate replace to="/login" />
            ) : jwt_decode(token).firstTime ? (
              <Home />
            ) : (
              <AssignmentEdit token={token} />
            )
          }
        />
        <Route path="/unauthorized" element={<Unauthorized token={token} />} />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate replace to="/home" />
            ) : (
              <LoginPage setToken={setToken} />
            )
          }
        />
        <Route path="/server-500" element={<Server500 token={token} />} />
        <Route path="*" element={<NoMatch token={token} />} />
        <Route path="/" element={<Home token={token} />} />
      </Routes>
    </div>
  );
};

export default Menu;
