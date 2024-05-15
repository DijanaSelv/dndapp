import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getCurrentCampaign,
  getMembers,
} from "../../app/actions/databaseActions";
import NotificationBox from "../../components/NotificationBox";

import { Button, Progress } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import classes from "./CampaignInfoPage.module.css";
import { uiSliceActions } from "../../app/uiSlice";

const CampaignInfoPage = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { currentCampaign } = useSelector((state) => state.campaignSlice);
  const { isLoading } = useSelector((state) => state.uiSlice);

  const { dm, player, creator, loremaster } = useSelector(
    (state) => state.rolesSlice
  );

  const [playerMembers, setPlayerMembers] = useState([]);
  const [dmMembers, setDmMembers] = useState();
  const [copy, setCopy] = useState({ value: "", copied: false });

  //when we open the page: 1. reach currentCampaign (fetched from MainNav). Display members as a separate thing, because we must find their names.
  const roles = [
    dm === true && "dm",
    player === true && "player",
    creator === true && "creator",
    loremaster === true && "loremaster",
  ].filter(Boolean);

  const showMembers = async () => {
    const playersData = await dispatch(
      getMembers(currentCampaign.id, "player")
    );
    const dmData = await dispatch(getMembers(currentCampaign.id, "dm"));

    setPlayerMembers(playersData);
    setDmMembers(dmData);
  };

  useEffect(() => {
    currentCampaign && showMembers();
  }, [currentCampaign]);

  return (
    <div className={classes.content}>
      {!currentCampaign?.id && isLoading && (
        <>
          <p className={classes.pageInfo}>Loading...</p>
          <Progress
            percent={100}
            status="active"
            showInfo={false}
            size="small"
            strokeColor={{ from: "#108ee9", to: "#87d068" }}
          />
        </>
      )}
      {/* check if dmMembers are fetched too, to avoid flicker when added late */}
      {currentCampaign?.id && dmMembers && (
        <>
          <div
            className={classes.header}
            style={{
              backgroundImage: `url(${currentCampaign.image})`,
            }}
          >
            <div className={classes.headerContent}>
              <Link to={`/Campaigns/${params.type}/${currentCampaign.id}/play`}>
                <h1 className={classes.title}>{currentCampaign.title}</h1>
              </Link>
            </div>
          </div>
          <div>
            <div className={classes.details}>
              <h3 className={classes.sectionTitle}>Players</h3>
              <div className={classes.playersInfo}>
                {" "}
                {dmMembers.length !== 0 && <p>DM : {dmMembers.join(", ")}</p>}
                {playerMembers.length !== 0 && (
                  <p>Players : {playerMembers.join(", ")}</p>
                )}
                {
                  <p>
                    Your role{roles.length > 1 ? "s" : ""} : {roles.join(", ")}
                  </p>
                }
              </div>
              <h3 className={classes.sectionTitle}>Description</h3>
              <div className={classes.description}>
                {currentCampaign.description}
              </div>
              {dm === true && (
                <div className={classes.join}>
                  <div className={classes.joinContent}>
                    {" "}
                    <p>Campaign code: </p>
                    <p className={classes.joinCode}>
                      {" "}
                      {currentCampaign.joinCode}{" "}
                    </p>{" "}
                    <p className={classes.info}>invite other members to join</p>
                  </div>
                  <div className={classes.copy}>
                    <CopyToClipboard
                      text={currentCampaign.joinCode}
                      onCopy={() =>
                        setCopy({
                          copied: true,
                          value: currentCampaign.joinCode,
                        })
                      }
                    >
                      <Button type={copy.copied ? "default" : "dashed"}>
                        {copy.copied ? <CheckOutlined /> : <CopyOutlined />}
                      </Button>
                    </CopyToClipboard>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {!isLoading && !currentCampaign && (
        <p className={classes.pageInfo}>Page not found...</p>
      )}
    </div>
  );
};

export default CampaignInfoPage;
