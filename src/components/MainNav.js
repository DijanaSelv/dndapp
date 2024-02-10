import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { useNavigate } from "react-router";
import { loggedInUser, signOutUser } from "../app/actions/userActions";
import { Link } from "react-router-dom";

const MainNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { uid, firstName } = useSelector(
    (state) => state.userSliceReducer.user
  );

  const logoutClickHandler = (e) => {
    e.preventDefault();
    dispatch(signOutUser());
    navigate("/");
  };

  return (
    <>
      <p> Di & Di Page </p>
      {firstName && <p>{firstName} you are logged in.</p>}

      {uid && (
        <>
          <Link to="/">
            <Button>Home</Button>
          </Link>
          <Button type="primary" onClick={logoutClickHandler}>
            log out
          </Button>
        </>
      )}
    </>
  );
};

export default MainNav;
