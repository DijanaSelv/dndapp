import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { signOutUser } from "../app/actions/userActions";
import { Link, NavLink } from "react-router-dom";

import classes from "./MainNav.module.css";
import { LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Skeleton } from "antd";
import { useEffect, useState } from "react";
import {
  getCurrentCampaign,
  getRoles,
  getUserData,
} from "../app/actions/databaseActions";
import { rolesSliceActions } from "../app/rolesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBook,
  faDiceD20,
  faInfo,
  faPencil,
  faShop,
  faUserLarge,
  faHouse,
  faHatWizard,
  faDragon,
  faBullhorn,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { uiSliceActions } from "../app/uiSlice";

const MainNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const campaignId = params.campaignId;

  const { uid, firstName } = useSelector((state) => state.userSlice.user);
  const { requestSuccess } = useSelector((state) => state.uiSlice);
  const { currentCampaign } = useSelector((state) => state.campaignSlice);

  const [isCollapsed, setIsCollapsed] = useState(false);

  //if a campaign is accessed, fetch roles. If not clear the roles.
  useEffect(() => {
    if (params.campaignId) {
      dispatch(getRoles(uid, params.campaignId));
      uid && dispatch(getCurrentCampaign(uid, params.campaignId));
    }
    if (!params.campaignId) {
      dispatch(rolesSliceActions.resetRoles());
    }
    if (requestSuccess) {
      dispatch(getUserData(uid));
    }

    dispatch(uiSliceActions.resetRequestState());
  }, [params.campaignId, uid, requestSuccess]);

  const logoutClickHandler = (e) => {
    e.preventDefault();
    dispatch(signOutUser());
    navigate("/");
  };

  const collapseMenu = () => {
    setIsCollapsed((prev) => !prev);
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

  const mainMenu = [
    {
      name: "Home",
      link: "/",
      icon: faHouse,
    },
    {
      name: "Campaigns",
      link: "/campaigns/",
      icon: faDragon,
      dropdownContent: [
        {
          name: "Created",
          link: "/campaigns/?created",
        },
        {
          name: "Joined",
          link: "/campaigns/?joined",
        },
      ],
    },
    {
      name: "Characters",
      link: "/characters/",
      icon: faHatWizard,
    },
    {
      name: "Announcements",
      link: "/announcements/",
      icon: faBullhorn,
    },
  ];

  return (
    <div className={classes.navWrapper}>
      <button className={classes.sidebarButton} onClick={collapseMenu}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          className={isCollapsed ? classes.collapsedSidebarButton : ""}
        />
      </button>
      <div
        className={`${classes.mainNav} ${classes.collapse} ${
          isCollapsed ? classes.collapsed : classes.expanded
        }`}
        id="mainNav"
      >
        <div className={classes.mainMenu}>
          <div className={classes.welcomeLogo}>
            <Link className={classes.titleLink}>
              <div className={classes.appLogo}>
                <FontAwesomeIcon
                  icon={faDiceD20}
                  className={`${classes.logoIcon}`}
                />
                <h1
                  className={`${classes.collapse} ${
                    isCollapsed ? classes.collapsed : classes.expanded
                  } ${classes.title}`}
                >
                  {" "}
                  Di&Di{" "}
                </h1>
              </div>
            </Link>
          </div>

          <div className={classes.navLinks}>
            {mainMenu.map((item) => (
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  isActive
                    ? ` ${classes.activeNavLink} ${classes.navLink} `
                    : `${classes.navLink}`
                }
              >
                <div className={classes.navLinkContent}>
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={classes.menuIcon}
                  />
                  <div className={classes.navLink}>
                    <span className={` ${classes.menuName}`}>{item.name}</span>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          account settings
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
              <DownOutlined style={{ color: "#3a9fd6", paddingLeft: "10px" }} />
            </div>
          </Dropdown>
        </div>
      </div>
      {/*  {params.campaignId && (
          <div className={classes.campaignNavBackground}>
            <div className={`${classes.mainNav} ${classes.campaignNav}`}>
              <div className={classes.navLinks}>
                <NavLink
                  to={`/Campaigns/${campaignId}/play`}
                  className={({ isActive }) =>
                    isActive
                      ? ` ${classes.activeNavLink} ${classes.navLink} ${classes.campaignNavLink} ${classes.campaignPlayLink}`
                      : `${classes.navLink} ${classes.campaignNavLink} ${classes.campaignPlayLink}`
                  }
                  end
                >
                  {currentCampaign.title}
                </NavLink>
              </div>
              <div className={classes.navLinks}>
                <NavLink
                  to={`/Campaigns/${campaignId}/info`}
                  className={({ isActive }) =>
                    isActive
                      ? ` ${classes.activeNavLink} ${classes.navLink} ${classes.campaignNavLink}`
                      : `${classes.navLink} ${classes.campaignNavLink}`
                  }
                >
                  <FontAwesomeIcon className={classes.icon} icon={faInfo} />
                </NavLink>

                {currentCampaign && currentCampaign.members[uid]?.character && (
                  <NavLink
                    to={`/Campaigns/${campaignId}/play/character/${currentCampaign.members[uid].character}`}
                    className={({ isActive }) =>
                      isActive
                        ? ` ${classes.activeNavLink} ${classes.navLink} ${classes.campaignNavLink}`
                        : `${classes.navLink} ${classes.campaignNavLink}`
                    }
                  >
                    <FontAwesomeIcon
                      className={classes.icon}
                      icon={faUserLarge}
                    />
                  </NavLink>
                )}

                <NavLink
                  to={`/Campaigns/${campaignId}/play/shops`}
                  className={({ isActive }) =>
                    isActive
                      ? ` ${classes.activeNavLink} ${classes.navLink} ${classes.campaignNavLink}`
                      : `${classes.navLink} ${classes.campaignNavLink}`
                  }
                >
                  <FontAwesomeIcon className={classes.icon} icon={faShop} />
                </NavLink>
                <NavLink
                  to={`/Campaigns/${params.campaignId}/play/${uid}/combat`}
                  className={({ isActive }) =>
                    isActive
                      ? ` ${classes.activeNavLink} ${classes.navLink} ${classes.campaignNavLink}`
                      : `${classes.navLink} ${classes.campaignNavLink}`
                  }
                >
                  <FontAwesomeIcon className={classes.icon} icon={faDiceD20} />
                </NavLink>
                <NavLink
                  to={`/Campaigns/${campaignId}/play/notes`}
                  className={({ isActive }) =>
                    isActive
                      ? ` ${classes.activeNavLink} ${classes.navLink} ${classes.campaignNavLink}`
                      : `${classes.navLink} ${classes.campaignNavLink}`
                  }
                >
                  <FontAwesomeIcon className={classes.icon} icon={faPencil} />
                </NavLink>

                <NavLink
                  className={`${classes.navLink} ${classes.campaignNavLink}`}
                >
                  Log
                </NavLink>
              </div>
            </div>
          </div>
        )} */}
    </div>
  );
};

export default MainNav;
