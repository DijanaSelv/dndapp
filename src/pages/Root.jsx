import { Outlet } from "react-router-dom";
import MainNav from "../components/MainNav";

const Root = () => {
  return (
    <>
      <MainNav />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Root;
