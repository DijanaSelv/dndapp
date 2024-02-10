import { Button, Form, Input } from "antd";
import { useValidate } from "../../app/hooks/useValidate";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { uiSliceActions } from "../../app/uiSlice";
import NotificationBox from "../../components/NotificationBox";
import { createNewCampaign } from "../../app/actions/databaseActions";

const NewCampaignPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { TextArea } = Input;
  const { isLoading } = useSelector((state) => state.uiSliceReducer);
  const { uid } = useSelector((state) => state.userSliceReducer.user);
  const { requestSuccess, requestFailed, notification } = useSelector(
    (state) => state.uiSliceReducer
  );

  useEffect(() => {
    if (requestSuccess) {
      //TODO: how do i navigate to the new campaign?
      navigate(`/Campaigns`);
    }
    if (requestFailed) {
    }
    dispatch(uiSliceActions.resetRequestState());
  }, [requestSuccess, requestFailed]);

  const {
    inputValue: title,
    isValid: titleIsValid,
    isError: titleIsError,
    inputBlurHandler: titleBlurHandler,
    valueChangeHandler: titleChangeHandler,
  } = useValidate((value) => value.trim() !== "");
  const {
    inputValue: location,
    isValid: locationIsValid,
    isError: locationIsError,
    inputBlurHandler: locationBlurHandler,
    valueChangeHandler: locationChangeHandler,
  } = useValidate((value) => value.trim() !== "");
  const {
    inputValue: description,
    isValid: descriptionIsValid,
    isError: descriptionIsError,
    inputBlurHandler: descriptionBlurHandler,
    valueChangeHandler: descriptionChangeHandler,
  } = useValidate((value) => value.trim() !== "");
  const {
    inputValue: image,
    inputBlurHandler: imageBlurHandler,
    valueChangeHandler: imageChangeHandler,
  } = useValidate((value) => true);

  let formIsValid = false;
  if (titleIsValid && locationIsValid && descriptionIsValid) {
    formIsValid = true;
  }

  const createCampaignHandler = (e) => {
    e.preventDefault();
    const newCampaignData = {
      id: nanoid(9),
      joinCode: nanoid(12),
      title,
      location,
      image: image
        ? image
        : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/13372255-837c-4b0a-a477-0be04dd57d0e/demfbcb-00cf205d-ea36-4fd3-b785-2f0b4a7546c3.png/v1/fill/w_1212,h_660,q_70,strp/landscape_by_huyztr_demfbcb-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9Njk3IiwicGF0aCI6IlwvZlwvMTMzNzIyNTUtODM3Yy00YjBhLWE0NzctMGJlMDRkZDU3ZDBlXC9kZW1mYmNiLTAwY2YyMDVkLWVhMzYtNGZkMy1iNzg1LTJmMGI0YTc1NDZjMy5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.jRPEE2K0ChsBCPx8reZfhnC5VxNOx0xsSNFC02YKv-E",
      DM: uid,
      description,
    };

    //action that sends the data to database
    dispatch(createNewCampaign(uid, newCampaignData));
    //navigate(`/Campaigns/created/${newCampaignData.id}/info`);
    //redirect to campaign info
  };

  return (
    <>
      {notification && <NotificationBox />}
      <h3>Create new campaign</h3>
      <Form>
        <Input
          addonBefore="Title"
          placeholder={
            titleIsError ? "Title is requred" : "The name of your campaign"
          }
          onBlur={titleBlurHandler}
          onChange={titleChangeHandler}
          status={titleIsError ? "error" : ""}
        ></Input>
        <Input
          addonBefore="image"
          placeholder="Image url here"
          onBlur={imageBlurHandler}
          onChange={imageChangeHandler}
        ></Input>
        <Input
          addonBefore="Location"
          placeholder={
            locationIsError
              ? "Location is requred"
              : "Where is your campaign set?"
          }
          onBlur={locationBlurHandler}
          onChange={locationChangeHandler}
          status={locationIsError ? "error" : ""}
        ></Input>

        <p>Descirption</p>
        <TextArea
          placeholder={
            descriptionIsError
              ? "Tell us something about your campaign"
              : "blurb for your campaign"
          }
          autoSize={{
            minRows: 2,
            maxRows: 10,
          }}
          onBlur={descriptionBlurHandler}
          onChange={descriptionChangeHandler}
          status={descriptionIsError ? "error" : ""}
        ></TextArea>
        <Button
          disabled={!formIsValid}
          type="primary"
          htmlType="submit"
          onClick={createCampaignHandler}
          loading={isLoading}
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default NewCampaignPage;
