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
    <>
      {notification && <NotificationBox />}
      <form onSubmit={loginHandler}>
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
            Password must at least 6 characters long.
          </p>
        )}
        <Checkbox onChange={rememberMeHandler} checked={rememberMe}>
          Remember me
        </Checkbox>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          disabled={!formIsValid}
        >
          Log in
        </Button>
      </form>

      <p>Not a member yet?</p>
      <Link to="/Signup">Sign up here!</Link>
    </>
  );
};

export default Login;
