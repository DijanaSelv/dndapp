import { Button } from "antd";

const CharacterListItem = ({ character }) => {
  return (
    <div key={character.id}>
      <h4>
        {character.image} {character.name}
      </h4>
      <span>
        {character.race}, {character.class}
      </span>
      <Button type="primary">View</Button>
    </div>
  );
};

export default CharacterListItem;
