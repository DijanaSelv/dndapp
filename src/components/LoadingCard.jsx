import classes from "../pages/homepage/HomePage.module.css";

import { Card } from "antd";
import Meta from "antd/es/card/Meta";

const LoadingCard = () => {
  /*   const actions =
    type === "created"
      ? [
          <Link to={`/Campaigns/${campaign.id}/info`}>
            <InfoCircleOutlined key="info" />
          </Link>,
          <Link to={`/Campaigns/${campaign.id}/play`}>
            <ArrowRightOutlined key="play" />
          </Link>,

          <CloseOutlined key="delete" onClick={deleteButtonHandler} />,
        ]
      : [
          <Link to={`/Campaigns/${campaign.id}/info`}>
            <InfoCircleOutlined key="info" />
          </Link>,
          <Link to={`/Campaigns/${campaign.id}/play`}>
            <ArrowRightOutlined key="play" />
          </Link>,
          <CloseOutlined key="leave" onClick={leaveCampaignButtonHandler} />,
        ]; */

  return (
    <Card
      loading="true"
      cover={<div className={classes.coverDiv}></div>}
      /* actions={actions} */
    >
      <Meta title="title" description={"description"} />
    </Card>
  );
};

export default LoadingCard;
