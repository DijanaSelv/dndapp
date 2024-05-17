import { Button, Form, Input } from "antd";
import { useValidate } from "../../app/hooks/useValidate";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { uiSliceActions } from "../../app/uiSlice";
import NotificationBox from "../../components/NotificationBox";
import STATIC_SHOPS from "../../app/STATIC_SHOPS";
import {
  createNewCampaign,
  getCampaignsData,
} from "../../app/actions/databaseActions";
import CancelModal from "../../components/CancelModal";
import classes from "./NewCampaignPage.module.css";

const NewCampaignPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { TextArea } = Input;
  const { isLoading } = useSelector((state) => state.uiSlice);
  const { createdCampaigns } = useSelector((state) => state.campaignSlice);
  const { uid } = useSelector((state) => state.userSlice.user);
  const { requestSuccess, requestFailed, notification, fetchedCampaigns } =
    useSelector((state) => state.uiSlice);

  const [showModal, setShowModal] = useState(false);
  const [newCampaingId, setNewCampaignId] = useState();

  useEffect(() => {
    newCampaingId && navigate(`/Campaigns/${newCampaingId}/info`);
  }, [createdCampaigns]);

  useEffect(() => {
    if (requestSuccess) {
      dispatch(getCampaignsData([newCampaingId], "created"));
    }
    dispatch(uiSliceActions.resetRequestState());
    dispatch(uiSliceActions.changeLoading(false));
  }, [requestSuccess, requestFailed, fetchedCampaigns]);

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

  const createCampaignHandler = async (e) => {
    e.preventDefault();

    const roles = {
      creator: true,
      dm: true,
    };
    const newCampaignData = {
      id: nanoid(9),
      joinCode: nanoid(12),
      title,
      location,
      image: image
        ? image
        : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/13372255-837c-4b0a-a477-0be04dd57d0e/demfbcb-00cf205d-ea36-4fd3-b785-2f0b4a7546c3.png/v1/fill/w_1212,h_660,q_70,strp/landscape_by_huyztr_demfbcb-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9Njk3IiwicGF0aCI6IlwvZlwvMTMzNzIyNTUtODM3Yy00YjBhLWE0NzctMGJlMDRkZDU3ZDBlXC9kZW1mYmNiLTAwY2YyMDVkLWVhMzYtNGZkMy1iNzg1LTJmMGI0YTc1NDZjMy5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.jRPEE2K0ChsBCPx8reZfhnC5VxNOx0xsSNFC02YKv-E",
      description,
      shops: STATIC_SHOPS,
      members: { [uid]: { roles } },
    };

    setNewCampaignId(newCampaignData.id);
    dispatch(createNewCampaign(uid, newCampaignData));
  };

  const cancelPageHandler = () => {
    if (title || image || location || description) {
      setShowModal(true);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={classes.content}>
      {notification && <NotificationBox />}
      <CancelModal showModal={showModal} setShowModal={setShowModal} />
      <h2>Create a new campaign</h2>
      <Form>
        <h3> Title*</h3>
        <p>What is the name of your campaign?</p>
        <Input
          placeholder={titleIsError && "Title is requred"}
          onBlur={titleBlurHandler}
          onChange={titleChangeHandler}
          status={titleIsError ? "error" : ""}
        ></Input>
        <h3> Location*</h3>
        <p>Where is your story taking place?</p>
        <Input
          placeholder={locationIsError && "Location is requred"}
          onBlur={locationBlurHandler}
          onChange={locationChangeHandler}
          status={locationIsError ? "error" : ""}
        ></Input>
        <h3> Image</h3>
        <p>
          Pick a cover image for your campaign if you want. If not we'll pick
          for you.
        </p>
        <Input
          addonBefore="image url:"
          onBlur={imageBlurHandler}
          onChange={imageChangeHandler}
        ></Input>

        <h3> Summary *</h3>
        <p>
          Add a brief description for your campaign. Or not brief. Whatever.
        </p>
        <TextArea
          placeholder={
            descriptionIsError && "Tell us something about your campaign"
          }
          autoSize={{
            minRows: 2,
            maxRows: 10,
          }}
          onBlur={descriptionBlurHandler}
          onChange={descriptionChangeHandler}
          status={descriptionIsError ? "error" : ""}
          style={{ whiteSpace: "pre-wrap" }}
        ></TextArea>
        <div className={classes.buttonContainer}>
          <Button
            disabled={!formIsValid}
            type="primary"
            htmlType="submit"
            onClick={createCampaignHandler}
            loading={isLoading}
          >
            Submit
          </Button>
          <Button type="primary" danger onClick={cancelPageHandler}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewCampaignPage;
