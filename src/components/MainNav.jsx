import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { signOutUser } from "../app/actions/userActions";
import { Link, NavLink } from "react-router-dom";

import classes from "./MainNav.module.css";
import {
  LogoutOutlined,
  DownOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Dropdown, Skeleton } from "antd";
import { useEffect } from "react";
import { getCurrentCampaign, getRoles } from "../app/actions/databaseActions";
import { rolesSliceActions } from "../app/rolesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons";
import { uiSliceActions } from "../app/uiSlice";

const MainNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const campaignId = params.campaignId;

  const { uid, firstName } = useSelector((state) => state.userSlice.user);

  //if a campaign is accessed, fetch roles. If not clear the roles.
  useEffect(() => {
    if (params.campaignId) {
      dispatch(getRoles(uid, params.campaignId));
      uid && dispatch(getCurrentCampaign(uid, params.campaignId));
    }
    if (!params.campaignId) {
      dispatch(rolesSliceActions.resetRoles());
    }
    dispatch(uiSliceActions.resetRequestState());
  }, [params.campaignId, uid]);

  const logoutClickHandler = (e) => {
    e.preventDefault();
    dispatch(signOutUser());
    navigate("/");
  };

  //dropdown profile menu
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
            <div className={classes.navLinks}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? ` ${classes.activeNavLink} ${classes.navLink} `
                    : `${classes.navLink} `
                }
                end
              >
                Home
              </NavLink>
              {/*                   <NavLink
                    to="/announcements"
                    className={({ isActive }) =>
                      isActive
                        ? ` ${classes.activeNavLink} ${classes.navLink} `
                        : `${classes.navLink} `
                    }
                  >
                    Announcements
                  </NavLink> */}
            </div>

            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              className={classes.navLink}
            >
              <div>
                {" "}
                {firstName ? (
                  `Hi, ${firstName}!`
                ) : (
                  <Skeleton.Input active size="small" />
                )}
                <DownOutlined
                  style={{ color: "#3a9fd6", paddingLeft: "10px" }}
                />
              </div>
            </Dropdown>
          </div>
        </div>
        {params.campaignId && (
          <div className={classes.campaignNavBackground}>
            <div className={classes.mainNav}>
              <div className={classes.navLinks}>
                <NavLink
                  to={`/Campaigns/${campaignId}/play`}
                  className={({ isActive }) =>
                    isActive
                      ? ` ${classes.activeNavLink} ${classes.navLink} ${classes.campaignNavLink}`
                      : `${classes.navLink} ${classes.campaignNavLink}`
                  }
                  end
                >
                  Play
                </NavLink>
                <NavLink
                  to={`/Campaigns/${campaignId}/info`}
                  className={({ isActive }) =>
                    isActive
                      ? ` ${classes.activeNavLink} ${classes.navLink} ${classes.campaignNavLink}`
                      : `${classes.navLink} ${classes.campaignNavLink}`
                  }
                >
                  Info
                </NavLink>
                <NavLink
                  to={`/Campaigns/${campaignId}/play/shops`}
                  className={({ isActive }) =>
                    isActive
                      ? ` ${classes.activeNavLink} ${classes.navLink} ${classes.campaignNavLink}`
                      : `${classes.navLink} ${classes.campaignNavLink}`
                  }
                >
                  Shops
                </NavLink>
                <NavLink
                  to={`/Campaigns/${campaignId}/play/notes`}
                  className={({ isActive }) =>
                    isActive
                      ? ` ${classes.activeNavLink} ${classes.navLink} ${classes.campaignNavLink}`
                      : `${classes.navLink} ${classes.campaignNavLink}`
                  }
                >
                  Notes
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
    </>
  );
};

export default MainNav;
