import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import NotificationBox from "../../components/NotificationBox";

import { loginUserAction } from "../../app/actions/userActions";
import { useValidate } from "../../app/hooks/useValidate";
import { useEffect } from "react";
import { uiSliceActions } from "../../app/uiSlice";
import { useState, useMemo } from "react";
import { persistenceChange } from "../../app/actions/userActions";
import classes from "./LoginPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";

const Login = () => {
  const [displayForm, setDisplayForm] = useState("login");

  const { notification } = useSelector((state) => state.uiSlice);

  return (
    <div className={classes.content}>
      <div
        className={`${classes.logAndSignWindow} ${
          displayForm === "signup" && classes.signupWindow
        }`}
      >
        <img src="https://cdn.pixabay.com/photo/2021/02/16/16/22/d-d-6021557_1280.png" />
        <div className={classes.formContent}>
          {notification && <NotificationBox />}
          <div className={classes.logoDiv}>
            <div className={classes.appLogo}>
              <FontAwesomeIcon icon={faDiceD20} className={classes.icon} />
              <h1 className={classes.title}> Di & Di </h1>
            </div>
            <p className={classes.subtitle}>A web app for your RPG campaigns</p>
          </div>
          {displayForm === "login" ? <LoginForm /> : <SignupForm />}
          {displayForm === "login" ? (
            <div className={classes.notMember}>
              <p>Not a member yet?</p>
              <p>
                <Link onClick={() => setDisplayForm("signup")}>
                  Sign up here!
                </Link>
              </p>
            </div>
          ) : (
            <div className={classes.alreadyMember}>
              <p>Already a member?</p>
              <p>
                <Link onClick={() => setDisplayForm("login")}>
                  Log in here!
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
