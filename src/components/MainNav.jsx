import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { useNavigate } from "react-router";
import { signOutUser } from "../app/actions/userActions";
import { Link, NavLink } from "react-router-dom";

import classes from "./MainNav.module.css";
import { LogoutOutlined } from "@ant-design/icons";

const MainNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { uid, firstName } = useSelector((state) => state.userSlice.user);

  const logoutClickHandler = (e) => {
    e.preventDefault();
    dispatch(signOutUser());
    navigate("/");
  };

  return (
    <div className={classes.background}>
      <div className={classes.mainNav}>
        <div className={classes.welcomeLogo}>
          <Link className={classes.titleLink}>
            <h1 className={classes.title}> Di & Di </h1>
            <p className={classes.subtitle}>A web app for your RPG campaigns</p>
          </Link>
        </div>

        <div className={classes.secondRow}>
          {uid && (
            <div className={classes.navLinks}>
              {/* <NavLink href="/" className={classes.navLink}> */}
              <NavLink to="/" className={classes.navLink}>
                {" "}
                {/* //! Use 'to="url"' instead of 'href' */}
                {/* // $ using 'href' instead of 'to', might make the whole page reload. Also, 'to' is provided from the react router therefore it is a better approach to use it instead. */}
                Home
              </NavLink>
              <NavLink to="/" className={classes.navLink}>
                Announcements
              </NavLink>
              <NavLink to="/" className={classes.navLink}>
                My Account
              </NavLink>
            </div>
          )}

          {firstName && <h3>Hello, {firstName}!</h3>}
          {uid && (
            <Button className={classes.button} onClick={logoutClickHandler}>
              <LogoutOutlined /> Log Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainNav;
