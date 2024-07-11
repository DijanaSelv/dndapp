import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { signUpUserAction } from "../app/actions/userActions";
import { useValidate } from "../app/hooks/useValidate";
import { uiSliceActions } from "../app/uiSlice";
import { Input, Select, Button } from "antd";
import classes from "../pages/loginpage/LoginPage.module.css";

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notification, requestSuccess, requestFailed, isLoading } =
    useSelector((state) => state.uiSlice);
  //on Signup redirect user to login page and reset notification and sign up state
  useEffect(() => {
    if (requestSuccess) {
      navigate("/Login");
    }
    if (requestFailed) {
      emailResetInput();
      passwordResetInput();
      confirmPasswordResetInput();
    }
    dispatch(uiSliceActions.resetRequestState());
  }, [requestSuccess, requestFailed]);

  //VALIDATION

  const {
    inputValue: firstName,

    isValid: firstNameIsValid,
    isError: firstNameIsError,
    resetInput: firstNameResetInput,
    inputBlurHandler: firstNameInputBlurHandler,
    valueChangeHandler: firstNameValueChangeHandler,
  } = useValidate((value) => value.trim() !== "");
  const {
    inputValue: lastName,

    isValid: lastNameIsValid,
    isError: lastNameIsError,
    resetInput: lastNameResetInput,
    inputBlurHandler: lastNameInputBlurHandler,
    valueChangeHandler: lastNameValueChangeHandler,
  } = useValidate((value) => value.trim !== "");
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
  const {
    inputValue: confirmPassword,
    isTouched: confirmPasswordIsTouched,
    isValid: confirmPasswordIsValid,
    isError: confirmPasswordIsError,
    resetInput: confirmPasswordResetInput,
    inputBlurHandler: confirmPasswordInputBlurHandler,
    valueChangeHandler: confirmPasswordValueChangeHandler,
  } = useValidate((value) => value.length >= 6);

  const experienceRef = useRef();

  const handleChange = (value) => {
    experienceRef.current = value;
  };

  let formIsValid = false;
  let passwordsNotSame = false;

  if (password !== confirmPassword) {
    passwordsNotSame = true;
  }

  if (
    firstNameIsValid &&
    lastNameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    confirmPasswordIsValid &&
    !passwordsNotSame
  ) {
    formIsValid = true;
  }

  //SIGN UP
  const signupHandler = (e) => {
    e.preventDefault();

    const user = {
      firstName,
      lastName,
      email,
      experience:
        experienceRef.current !== undefined ? experienceRef.current : "/",
      memeberSince: Date.now(),
    };

    dispatch(signUpUserAction(user, password));
  };

  return (
    <form className={classes.form} onSubmit={signupHandler}>
      <div className={classes.inputDiv}>
        <span>First Name: *</span>
        <Input
          placeholder="First Name"
          onBlur={firstNameInputBlurHandler}
          onChange={firstNameValueChangeHandler}
          value={firstName}
        />
        {firstNameIsError && (
          <p style={{ color: "red", fontSize: "0.7rem" }}>
            Please enter your first name.
          </p>
        )}
      </div>
      <div className={classes.inputDiv}>
        <span>Last Name: </span>
        <Input
          placeholder="Last Name"
          onBlur={lastNameInputBlurHandler}
          onChange={lastNameValueChangeHandler}
          value={lastName}
        />
        {lastNameIsError && (
          <p style={{ color: "red", fontSize: "0.7rem" }}>
            Please enter your last name.
          </p>
        )}
      </div>
      <div className={classes.inputDiv}>
        <span>Email: *</span>
        <Input
          placeholder="email"
          type="email"
          onBlur={emailInputBlurHandler}
          onChange={emailValueChangeHandler}
          value={email}
        />
        {emailIsError && (
          <p style={{ color: "red", fontSize: "0.7rem" }}>
            Please enter a valid email.
          </p>
        )}
      </div>
      <div className={classes.inputDiv}>
        <span>Password: *</span>
        <Input
          placeholder="password"
          type="password"
          onBlur={passwordInputBlurHandler}
          onChange={passwordValueChangeHandler}
          value={password}
        />
        {passwordIsError && (
          <p style={{ color: "red", fontSize: "0.7rem" }}>
            Password must at least 6 characters long.
          </p>
        )}
      </div>
      <div className={classes.inputDiv}>
        <span>Confirm Password: *</span>
        <Input
          placeholder="Confirm password"
          type="password"
          onBlur={confirmPasswordInputBlurHandler}
          onChange={confirmPasswordValueChangeHandler}
          value={confirmPassword}
        />
        {confirmPasswordIsError && (
          <p style={{ color: "red", fontSize: "0.7rem" }}>
            Password must at least 6 characters long.
          </p>
        )}
        {passwordsNotSame &&
          !confirmPasswordIsError &&
          confirmPasswordIsTouched && (
            <p style={{ color: "red", fontSize: "0.7rem" }}>
              Passwords must match.
            </p>
          )}
      </div>

      <Button
        disabled={!formIsValid}
        type="primary"
        htmlType="submit"
        loading={isLoading}
      >
        Sign up
      </Button>
    </form>
  );
};

export default SignupForm;
