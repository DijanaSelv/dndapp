import { notification } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const NotificationBox = () => {
  const notificationData = useSelector((state) => state.uiSlice.notification);

  const { type, message, description } = notificationData;
  let notificationBox;
  const dispatch = useDispatch();

  useEffect(() => {
    if (notification[type]) {
      notificationBox = notification[type]({
        message: message,
        description: description,
        duration: 3,
      });
    }
  }, [type, message, description]);

  return <>{notificationBox}</>;
};

export default NotificationBox;
