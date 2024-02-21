import { Link, useNavigate } from "react-router-dom";
import { Input, Select, Button } from "antd";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import NotificationBox from "../../components/NotificationBox";
import { signUpUserAction } from "../../app/actions/userActions";

import { useValidate } from "../../app/hooks/useValidate";
import { uiSliceActions } from "../../app/uiSlice";

const Signup = () => {
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
  const submitHandler = (e) => {
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
    <>
      {notification && <NotificationBox />}
      <form onSubmit={submitHandler}>
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
        <Select
          defaultValue="Years of experience"
          onChange={handleChange}
          options={[
            {
              label: "less than 1",
              value: "<1",
            },
            {
              label: "1-4",
              value: "1-4",
            },
            {
              label: "5-9",
              value: "5-9",
            },
            {
              label: "10+",
              value: "10+",
            },
          ]}
        />

        <Button
          disabled={!formIsValid}
          type="primary"
          htmlType="submit"
          loading={isLoading}
        >
          Sign up
        </Button>
      </form>

      <p>Already a member?</p>
      <Link to="/">Log in here!</Link>
    </>
  );
};

export default Signup;
