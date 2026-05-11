import { Link } from "react-router-dom";
import classes from "./MainNav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const TopMenu = ({ title, children, breadcrumbs }) => {
  return (
    <div className={classes.topMenuWrapper}>
      <div>
        <div className={classes.breadcrumbDiv}>
          {breadcrumbs &&
            breadcrumbs.map((br, i) => (
              <React.Fragment key={`breadcrumb-lvl-${i + 1}`}>
                <Link
                  to={br.url || ""}
                  className={`${classes.breadcrumbLink} ${i == breadcrumbs.length - 1 ? classes.lastBreadcrumb : ""}`}
                >
                  {br.text}
                </Link>
                {i < breadcrumbs.length - 1 && (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={classes.chevron}
                  />
                )}
              </React.Fragment>
            ))}
        </div>
        {/* <h2>{title}</h2> */}
      </div>

      <div>{children}</div>
    </div>
  );
};

export default TopMenu;
