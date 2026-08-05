import { notification } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import classes from "./NotificationBox.module.css";

const NotificationBox = () => {
  const notificationData = useSelector((state) => state.uiSlice.notification);

  const { type, message, description } = notificationData;
  let notificationBox;

  useEffect(() => {
    if (notification[type]) {
      notificationBox = notification[type]({
        message: message,
        description: description,
        duration: 3,
        className: `${classes.notificationBox}`,
      });
    }
  }, [type, message, description]);

  return <>{notificationBox}</>;
};

export default NotificationBox;
