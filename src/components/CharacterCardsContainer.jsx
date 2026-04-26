import { useSelector, useDispatch } from "react-redux";
import CharacterCard from "./CharacterCard";
import { subscribeToCharacters } from "../app/actions/databaseActions";
import { useEffect, useState } from "react";
import LoadingCard from "./LoadingCard";

const CharacterCardsContainer = (uid) => {
  const characters = useSelector((state) => state.charactersSlice.characters);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.uiSlice);
  const [loadingCharacters, setLoadingCharacters] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const cleanup = dispatch(subscribeToCharacters(uid));
      setLoadingCharacters(false);
      return () => {
        if (typeof cleanup === "function") cleanup();
      };
    }
  }, [dispatch, isLoading]);

  return (
    <>
      {characters &&
        Object.values(characters).map((char) => {
          return <CharacterCard bordered char={char} />;
        })}
      {loadingCharacters && !characters && <LoadingCard />}
      {!loadingCharacters && !characters && (
        <div> No characters! Create a new one here! </div>
      )}
    </>
  );
};

export default CharacterCardsContainer;
