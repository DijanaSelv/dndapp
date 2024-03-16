import { Link, useParams } from "react-router-dom";
import classes from "./CampaginPlayPage.module.css";
import { useSelector } from "react-redux";
import PlayCampaignCard from "../../components/PlayCampaignCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfo,
  faShop,
  faDiceD20,
  faBook,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

const CampaignPlayPage = () => {
  const params = useParams();

  const { createdCampaigns, joinedCampaigns } = useSelector(
    (state) => state.campaignSlice
  );

  const campaign =
    params.type === "created"
      ? createdCampaigns[params.campaignId]
      : joinedCampaigns[params.campaignId];

  return (
    <>
      <h1 className={classes.campaignTitle}>{campaign.title}</h1>

      <ul className={classes.cardsList}>
        <PlayCampaignCard
          goTo={`/Campaigns/${params.type}/${params.campaignId}/info`}
          cardFor="Info"
          image={<FontAwesomeIcon className={classes.icon} icon={faInfo} />}
          description="General campaign info."
        />
        <PlayCampaignCard
          goTo={`/Campaigns/${params.type}/${params.campaignId}/play/shops`}
          cardFor="Shops"
          image={<FontAwesomeIcon className={classes.icon} icon={faShop} />}
          description="You can buy and sell items."
        />
        <PlayCampaignCard
          goTo={`/Campaigns/${params.type}/${params.campaignId}/play/combat`}
          cardFor="Combat"
          image={<FontAwesomeIcon className={classes.icon} icon={faDiceD20} />}
          description="Fight!"
        />
        <PlayCampaignCard
          goTo={`/Campaigns/${params.type}/${params.campaignId}/play/log`}
          cardFor="Log"
          image={<FontAwesomeIcon className={classes.icon} icon={faBook} />}
          description="Campaign lore and progress."
        />
        <PlayCampaignCard
          goTo={`/Campaigns/${params.type}/${params.campaignId}/play/notes`}
          cardFor="Notes"
          image={<FontAwesomeIcon className={classes.icon} icon={faPencil} />}
          description="Your personal notes."
        />
        {/*         <PlayCampaignCard
          goTo={`/Campaigns/${params.type}/${params.campaignId}/play/shops`}
          cardFor="Shops"
          image={<FontAwesomeIcon className={classes.icon} icon={faShop} />}
          description="You can buy and sell items."
        />
        <PlayCampaignCard
          goTo={`/Campaigns/${params.type}/${params.campaignId}/play/shops`}
          cardFor="Shops"
          image={<FontAwesomeIcon className={classes.icon} icon={faShop} />}
          description="You can buy and sell items."
        /> */}
      </ul>
      {/*       <Link to={`/Campaigns/${params.type}/${params.campaignId}/info`}>
        <div>Info</div>
      </Link>
      <Link to={`/Campaigns/${params.type}/${params.campaignId}/play/shops`}>
        <div>Shops</div>
      </Link>
      <Link>
        <div>Combat</div>
      </Link>
      <Link>
        <div>Log</div>
      </Link>
      <Link>
        <div>Notes</div>
      </Link>
      <Link>
        <div>My character</div>
      </Link>
      <Link>
        <div>Inventory</div>
      </Link> */}
    </>
  );
};

export default CampaignPlayPage;
