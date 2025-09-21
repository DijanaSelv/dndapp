import classes from "./MainNav.module.css";

const TopMenu = ({ title, children }) => {
  return (
    <div className={classes.topMenuWrapper}>
      <h2>{title}</h2>

      <div>{children}</div>
    </div>
  );
};

export default TopMenu;
