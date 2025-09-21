import { Outlet } from "react-router-dom";
import MainNav from "../components/MainNav";
import classes from "./homepage/HomePage.module.css";
import TopMenu from "../components/TopMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const Root = () => {
  return (
    <>
      <MainNav />
      <main className={classes.mainWrapper}>
        <TopMenu title="Top Menu Title">
          <FontAwesomeIcon icon={faBook} />
        </TopMenu>
        <Outlet />
      </main>
    </>
  );
};

export default Root;
