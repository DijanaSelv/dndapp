import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRightOutlined, CloseOutlined } from "@ant-design/icons";

import CharacterCard from "./CharacterCard";

const CharacterCardsContainer = () => {
  const characters = useSelector((state) => state.userSlice.user.characters);

  return (
    <>
      {characters &&
        Object.keys(characters).map((cid) => {
          const actions = [
            <Link to={`/Characters/${cid}`}>
              <ArrowRightOutlined key="view" />
            </Link>,
            {
              /* <CloseOutlined key="delete" onClick={deleteButtonHandler} /> */
            },
          ];

          return <CharacterCard cid={cid} />;
        })}
    </>
  );
};

export default CharacterCardsContainer;
