import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { signOutUser } from "../app/actions/userActions";
import { Link, NavLink } from "react-router-dom";

import classes from "./MainNav.module.css";
import { LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useEffect } from "react";
import { getRoles } from "../app/actions/databaseActions";
import { rolesSliceActions } from "../app/rolesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons";

const MainNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const campaignId = params.campaignId;

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

  const items = [
    {
      label: <Link>My Account</Link>,
      key: "0",
    },

    {
      label: <Link>Help</Link>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: (
        <Link onClick={logoutClickHandler}>
          <LogoutOutlined /> Log Out
        </Link>
      ),
      key: "3",
      danger: true,
    },
  ];

  return (
    <>
      {uid && (
        <div className={classes.background}>
          <div className={classes.mainNav}>
            <div className={classes.welcomeLogo}>
              <Link className={classes.titleLink}>
                <div className={classes.appLogo}>
                  <FontAwesomeIcon icon={faDiceD20} className={classes.icon} />
                  <h1 className={classes.title}> Di & Di </h1>
                </div>
                <p className={classes.subtitle}>
                  A web app for your RPG campaigns
                </p>
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
                </div>
              )}

              {firstName && (
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  className={classes.navLink}
                >
                  <div>
                    Hi, {firstName}!{" "}
                    <DownOutlined style={{ color: "#3a9fd6" }} />{" "}
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
          {params.campaignId && (
            <div className={classes.campaignNavBackground}>
              <div className={classes.mainNav}>
                <div className={classes.navLinks}>
                  <NavLink
                    to={`/Campaigns/${params.type}/${campaignId}/info`}
                    className={`${classes.navLink} ${classes.campaignNavLink}`}
                  >
                    Info
                  </NavLink>
                  <NavLink
                    to={`/Campaigns/${params.type}/${campaignId}/play`}
                    className={`${classes.navLink} ${classes.campaignNavLink}`}
                  >
                    Play
                  </NavLink>
                  <NavLink
                    to={`/Campaigns/${params.type}/${campaignId}/play/shops`}
                    className={`${classes.navLink} ${classes.campaignNavLink}`}
                  >
                    Shops
                  </NavLink>
                  {/*               <NavLink
            className={`${classes.navLink} ${classes.campaignNavLink}`}
          >
            Combat
          </NavLink>
          <NavLink
            className={`${classes.navLink} ${classes.campaignNavLink}`}
          >
            Log
          </NavLink>
          <NavLink
            className={`${classes.navLink} ${classes.campaignNavLink}`}
          >
            Notes
          </NavLink> */}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MainNav;
