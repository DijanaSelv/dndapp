import { Input, Button } from "antd";
import { Form } from "react-router-dom";

const NewCharacterPage = () => {
  const { TextArea } = Input;

  const createCharacterHandler = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <h3>Create new character</h3>
      <Form>
        <Input
          addonBefore="Name"
          placeholder="The name of your character"
        ></Input>
        <Input addonBefore="Race"></Input>
        <Input addonBefore="Class"></Input>
        <Input addonBefore="Sub-Class"></Input>
        <Input addonBefore="Level"></Input>

        <Input addonBefore="image" placeholder="Image url here"></Input>
        <p>Descirption</p>
        <TextArea placeholder="blurb for your campaign"></TextArea>
        <Button
          type="primary"
          htmlType="submit"
          onClick={createCharacterHandler}
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default NewCharacterPage;
