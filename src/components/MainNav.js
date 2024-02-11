import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { useNavigate } from "react-router";
import { loggedInUser, signOutUser } from "../app/actions/userActions";
import { Link } from "react-router-dom";

import "./MainNav.css";

const MainNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { uid, firstName } = useSelector(
    (state) => state.userSliceReducer.user
  );

  const logoutClickHandler = (e) => {
    e.preventDefault();
    dispatch(signOutUser());
    navigate("/");
  };

  return (
    <div className="main_nav">
      <div className="welcomeLogo">
        <h1 className="title"> Di & Di </h1>
        {firstName && <h3 className="welcomeName">Hello, {firstName}!</h3>}
      </div>

      <div className="secondRow">
        <p>A web app for your RPG campaigns</p>
        {uid && (
          <div className="navLinks">
            <Button href="/" className="navLink">
              Home
            </Button>
            <Button to="/" className="navLink">
              Announcements
            </Button>
            <Button to="/" className="navLink ">
              My Account
            </Button>
            <Button
              className="navLink logoutButton"
              onClick={logoutClickHandler}
            >
              Log Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNav;
