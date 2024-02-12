import { Link } from "react-router-dom";
import CampaignListItem from "../../components/CampaignListItem";
import CharacterListItem from "../../components/CharacterListItem";
import {
  PlusCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCampaignsData } from "../../app/actions/databaseActions";
import { Spin, Card } from "antd";
import { motion } from "framer-motion";

import "./HomePage.css";
import Meta from "antd/es/card/Meta";

const Home = () => {
  const { createdCampaigns, joinedCampaigns } = useSeslector(
    (state) => state.campaignSliceReducer
  );
  const dispatch = useDispatch();
  const {
    created: createdCampaignsFromUser,
    joined: joinedCampaignsFromUsers,
  } = useSelector((state) => state.userSliceReducer.user.campaigns);
  const { isLoading } = useSelector((state) => state.uiSliceReducer);

  useEffect(() => {
    if (createdCampaignsFromUser) {
      const createdCampaignsIds = Object.values(createdCampaignsFromUser);
      dispatch(getCampaignsData(createdCampaignsIds, "created"));
    }
    if (joinedCampaignsFromUsers) {
      const joinedCampaignsIds = Object.values(joinedCampaignsFromUsers);
      dispatch(getCampaignsData(joinedCampaignsIds, "joined"));
    }
  }, [createdCampaignsFromUser, joinedCampaignsFromUsers]);
  /* const campaigns = [
    {
      id: "dsvnkds;fjklndsfkl;j",
      name: "The path of the Dragon",
      description:
        "The mighty Jabronies find themselves in the realm of Sarkaan in search for their lost companion - Brodvar. Will they find their way to him in time to save his life? Will they defeat Sarkaan?",
      image:
        "https://cdn.pixabay.com/photo/2023/08/02/09/43/golden-kingdom-8164867_1280.png",
      DM: "BpkDkfPAZ5QM8EWGOWFLbYg5DPr1",
      players: ["1RFoQ4U3usRPC66kkAdrqV4bay22", "2JvjD9bbpuUPYMLcs5nrMNfyIaA2"],
      campaignAdmin: ["2JvjD9bbpuUPYMLcs5nrMNfyIaA2"],
      status: "active",
    },
    {
      id: "ghfhhgcvhgc;fjklndsfkl;j",
      name: "Rise of the Shadows",
      description:
        "A mysterious force is spreading darkness across the lands. The Fellowship of the Shattered Sword must rise to face this new threat. Can they uncover the source of the shadows and save the realm?",
      image:
        "https://cdn.pixabay.com/photo/2023/09/01/17/04/fantasy-6295249_1280.jpg",
      DM: "XjvHg4pROwD9wN6SLqE7Zi39aCt2",
      players: [
        "4fgHkDnqU9G8l3aRjkWQqYvlCv23",
        "9ZplQWq2zExrNvXJD5MkrPq34aA1",
        "7YgtEr3lVnK9IOpPklxMpa43gTt2",
      ],
      campaignAdmin: ["4fgHkDnqU9G8l3aRjkWQqYvlCv23"],
      status: "inactive",
    },
    {
      id: "kldshjf;lkdsfjhkldfsj",
      name: "The Enchanted Isles",
      description:
        "The adventurers embark on a perilous journey to the Enchanted Isles in search of ancient artifacts that can tip the balance in the war against the dragon lords. Will they survive the treacherous waters and magical challenges?",
      image:
        "https://cdn.pixabay.com/photo/2023/03/28/17/33/fantasy-5105664_1280.jpg",
      DM: "RstDkGFAiE9pZK2NHWGFOErlsLm2",
      players: [
        "3AvjL9bbrD4UPYMLcs5nrMNfyIaA2",
        "6QWeU2DdVqUPYMLcs5nrMNfyIaA2",
        "2JvjD9bbpuUPYMLcs5nrMNfyIaA2",
      ],
      campaignAdmin: ["RstDkGFAiE9pZK2NHWGFOErlsLm2"],
      status: "active",
    },

    {
      id: "ldkshf;ldkjfhg;lkjds",
      name: "Echoes of Eternity",
      description:
        "An ancient artifact has resurfaced, and its power threatens to unravel the fabric of reality. The chosen few must venture into the unknown to prevent disaster.",
      image:
        "https://cdn.pixabay.com/photo/2021/09/27/10/56/fantasy-6653709_1280.jpg",
      DM: "Hv8G3RlqDnJKLmVzyEMWpNwE21n2",
      players: ["5lkHJ9Dp34AyuKskrDvzAsvFgFv2", "8bvPqkOplH9vMLcs5nrMNfyIaA2"],
      campaignAdmin: ["5lkHJ9Dp34AyuKskrDvzAsvFgFv2"],
      status: "active",
    },
    {
      id: "fdskjfh;ldsjf;lkdsjf",
      name: "Shadows Over Eldoria",
      description:
        "Eldoria is gripped by darkness as a malevolent force rises. Heroes must unite to face the shadowy threat that threatens to consume the world.",
      image:
        "https://cdn.pixabay.com/photo/2023/09/20/08/56/dark-6598844_1280.jpg",
      DM: "RfklJ9q8zxcvbKl2NHWGFOErlsLm2",
      players: [
        "4sdfHkDnqU9G8l3aRjkWQqYvlCv23",
        "9ZplQWq2zExrNvXJD5MkrPq34aA1",
        "1lkJdG3lVnK9IOpPklxMpa43gTt2",
      ],
      campaignAdmin: ["4sdfHkDnqU9G8l3aRjkWQqYvlCv23"],
      status: "inactive",
    },
  ]; */

  const characters = [
    {
      id: "chls;dkfds;l;kjkhfkjdsh",
      name: "Karra",
      race: "Corae",
      class: "Ranger",
      level: "10",
      image: "🐺",
    },
    {
      id: "chkdfgjndslkfgndf;lgk",
      name: "Lorelei Moonshadow",
      race: "Elf",
      class: "Wizard",
      level: "12",
      image: "🧙‍♂️",
    },
    {
      id: "nkjdvfndskjn",
      name: "Finnian Stormcaller",
      race: "Human",
      class: "Sorcerer",
      level: "9",
      image: "🧙‍♂️",
    },
    {
      name: "Gideon Ironfist",
      race: "Dwarf",
      class: "Fighter",
      level: "8",
      image: "🦄",
    },
  ];

  //TODO: loading icon when fetching the campaigns and characters and everything else
  return (
    <div className="content">
      <div></div>
      <div className="createdCampaignsSection">
        <div className="createdCampaignsHeader">
          <h2>Created Campaigns</h2>
          <Link to="/NewCampaign">
            Create a new campaign <PlusCircleOutlined />
          </Link>
        </div>
        {isLoading && <Spin />}
        <ul>
          {Object.keys(createdCampaigns).length !== 0 ? (
            Object.values(createdCampaigns).map((campaign) => (
              <CampaignListItem
                key={campaign.id}
                campaign={campaign}
                type={campaign.type}
              />
            ))
          ) : (
            <p>
              You haven't created any campaigns yet.{" "}
              <Link to="/NewCampaign">Create one here.</Link>
            </p>
          )}
        </ul>
      </div>
      <div>
        <h2>Joined Campaigns</h2>
        <ul>
          {Object.keys(joinedCampaigns).length !== 0 && !isLoading ? (
            Object.values(joinedCampaigns).map((campaign) => (
              <CampaignListItem
                key={campaign.id}
                campaign={campaign}
                type={campaign.type}
              />
            ))
          ) : (
            <p>You haven't joined any campaigns yet. </p>
          )}
        </ul>
      </div>
      <div>
        <h2>Characters</h2>
        <Link to="/NewCharacter">
          New Character
          <PlusCircleOutlined style={{ fontSize: "2rem", color: "green" }} />
        </Link>
        <ul>
          {/* {characters.map((character) => (
            <CharacterListItem character={character} />
          ))} */}
        </ul>
      </div>
    </div>
  );
};

export default Home;
