import { useState } from "react";

export const useValidate = (validateValue) => {
  const [inputValue, setInputValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isValid = validateValue(inputValue);
  const isError = !isValid && isTouched;

  const valueChangeHandler = (event) => {
    setInputValue(event.target.value);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const resetInput = () => {
    setInputValue("");
    setIsTouched(false);
  };
  //reset function we reset the value and the is touched

  return {
    inputValue,
    isTouched,
    isValid,
    isError,
    resetInput,
    inputBlurHandler,
    valueChangeHandler,
  };
};
