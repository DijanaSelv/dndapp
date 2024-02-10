import { Button } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { CopyToClipboard } from "react-copy-to-clipboard";
//TODO: add to clipboard functionality for the join code

const CampaignInfoPage = () => {
  const params = useParams();

  const { createdCampaigns, joinedCampaigns } = useSelector(
    (state) => state.campaignSliceReducer
  );

  const campaign =
    params.type === "created"
      ? createdCampaigns[params.campaignId]
      : joinedCampaigns[params.campaignId];

  return (
    <div>
      <img src={campaign.image} style={{ maxHeight: "500px" }} />
      <h1>{campaign.title}</h1>
      <div>{campaign.description}</div>
      <div>Share this code for players to join: ${campaign.joinCode}</div>
      <Button type="primary">Play</Button>
    </div>
  );
};

export default CampaignInfoPage;
