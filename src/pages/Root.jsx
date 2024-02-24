import { Outlet } from "react-router-dom";
import MainNav from "../components/MainNav";
import classes from './homepage/HomePage.module.css';

const Root = () => {
  return (
    <>
      <MainNav />
      <main className={classes.mainWrapper}>
        <Outlet />
      </main>
    </>
  );
};

export default Root;
