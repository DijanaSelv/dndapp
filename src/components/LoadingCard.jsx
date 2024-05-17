import classes from "../pages/homepage/HomePage.module.css";

import { Card } from "antd";
import Meta from "antd/es/card/Meta";

const LoadingCard = () => {
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
