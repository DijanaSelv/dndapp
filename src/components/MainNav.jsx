import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Space } from "antd";
import { useNavigate, useParams } from "react-router";
import { signOutUser } from "../app/actions/userActions";
import { Link, NavLink } from "react-router-dom";

import classes from "./MainNav.module.css";
import { LogoutOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { getRoles } from "../app/actions/databaseActions";
import { rolesSliceActions } from "../app/rolesSlice";

const MainNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { uid, firstName } = useSelector((state) => state.userSlice.user);

  useEffect(() => {
    if (params.campaignId) {
      dispatch(getRoles(uid, params.campaignId));
    }
    if (!params.campaignId) {
      dispatch(rolesSliceActions.resetRoles());
    }
  }, [params.campaignId]);

  const logoutClickHandler = (e) => {
    e.preventDefault();
    dispatch(signOutUser());
    navigate("/");
  };

  const dropdownItems = [
    {
      key: "1",
      label: (
        <NavLink to="/" className={classes.navLink}>
          My Account
        </NavLink>
      ),
    },
    {
      key: "2",
      label: (
        <Button className={classes.button} onClick={logoutClickHandler}>
          <LogoutOutlined /> Log Out
        </Button>
      ),
      danger: true,
    },
  ];

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
              <NavLink to="/" className={classes.navLink}>
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
          {/* 
          {firstName && (
            <Dropdown menu={{ dropdownItems }}>
              <Space>Hello, {firstName}!</Space>
            </Dropdown>
          )} */}
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
