import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useValidate } from "../app/hooks/useValidate";
import { loginUserAction } from "../app/actions/userActions";
import { uiSliceActions } from "../app/uiSlice";
import { Button, Input } from "antd";
import classes from "../pages/loginpage/LoginPage.module.css";

const LoginForm = () => {
  // **Redux hooks**
  const { notification, isLoading, requestSuccess, requestFailed } =
    useSelector((state) => state.uiSlice);
  const dispatch = useDispatch();

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

  const formIsValid = useMemo(
    () => emailIsValid && passwordIsValid,
    [emailIsValid, passwordIsValid]
  );

  const loginHandler = (e) => {
    e.preventDefault();
    /*     dispatch(persistenceChange(rememberMe)); */

    dispatch(loginUserAction(email, password));
  };

  return (
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
      <Button
        type="primary"
        htmlType="submit"
        loading={isLoading}
        disabled={!formIsValid}
      >
        Log in
      </Button>
    </form>
  );
};

export default LoginForm;
