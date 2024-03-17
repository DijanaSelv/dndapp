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

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);

  // **FORM VALIDATION from useValidate HOOK
  const {
    inputValue: email,
    isValid: emailIsValid,
    isError: emailIsError,
    resetInput: emailResetInput,
    inputBlurHandler: emailInputBlurHandler,
    valueChangeHandler: emailValueChangeHandler,
  } = useValidate((value) => value.includes("@") && value.includes("."));

  const {
    inputValue: password,
    isValid: passwordIsValid,
    isError: passwordIsError,
    resetInput: passwordResetInput,
    inputBlurHandler: passwordInputBlurHandler,
    valueChangeHandler: passwordValueChangeHandler,
  } = useValidate((value) => value.length >= 6);

  // **Redux hooks**
  const { notification, isLoading, requestSuccess, requestFailed } =
    useSelector((state) => state.uiSlice);
  const dispatch = useDispatch();

  const navigate = useNavigate(); // ! remove if not used
  const { isLoggedIn } = useSelector((state) => state.userSlice); // !remove if not used

  const formIsValid = useMemo(
    () => emailIsValid && passwordIsValid,
    [emailIsValid, passwordIsValid]
  );

  // **Event handlers**

  // Login user
  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(persistenceChange(rememberMe));

    dispatch(loginUserAction(email, password));
  };

  // Change sign in persistence
  const rememberMeHandler = (e) => {
    setRememberMe(e.target.checked);
  };

  useEffect(() => {
    if (requestSuccess) {
      console.log("request success");
      dispatch(uiSliceActions.resetRequestState());
    } else if (requestFailed) {
      emailResetInput();
      passwordResetInput();
      dispatch(uiSliceActions.resetRequestState());
    }
  }, [requestFailed, requestSuccess]);

  return (
    <div className={classes.content}>
      <div className={classes.logAndSignWindow}>
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
          <form className={classes.form} onSubmit={loginHandler}>
            <div className={classes.inputDiv}>
              <span>Email:</span>
              <Input
                name="email"
                placeholder="email"
                value={email}
                onBlur={emailInputBlurHandler}
                onChange={emailValueChangeHandler}
              />
              {emailIsError && (
                <p style={{ color: "red", fontSize: "0.7rem" }}>
                  Please enter a valid email.
                </p>
              )}
            </div>
            <div className={classes.inputDiv}>
              <span>Password:</span>
              <Input
                name="password"
                placeholder="password"
                type="password"
                value={password}
                onBlur={passwordInputBlurHandler}
                onChange={passwordValueChangeHandler}
              />
              {passwordIsError && (
                <p style={{ color: "red", fontSize: "0.7rem" }}>
                  Password must be at least 6 characters long.
                </p>
              )}
            </div>
            {/*             <Checkbox onChange={rememberMeHandler} checked={rememberMe}>
              Remember me
            </Checkbox> */}
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={!formIsValid}
            >
              Log in
            </Button>
          </form>
          <div className={classes.notMember}>
            <p>Not a member yet?</p>
            <p>
              <Link to="/Signup">Sign up here!</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
