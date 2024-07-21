import { useSelector } from "react-redux";
import CharacterCard from "./CharacterCard";

const CharacterCardsContainer = () => {
  const characters = useSelector((state) => state.userSlice.user.characters);

  return (
    <>
      {characters &&
        Object.keys(characters).map((cid) => {
          return <CharacterCard cid={cid} key={cid} />;
        })}
    </>
  );
};

export default CharacterCardsContainer;
