import { Input, Button, Select, Checkbox, Tabs, Form, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { getItems } from "../../app/actions/dndApiActions";
import { useForm } from "antd/es/form/Form";

import cssClasses from "./NewCharacterPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { createCharacter } from "../../app/actions/databaseActions";
import { useNavigate } from "react-router";

const NewCharacterPage = () => {
  const { TextArea } = Input;
  const [form] = useForm();
  const navigate = useNavigate();
  const { uid } = useSelector((state) => state.userSlice.user);
  const { requestSuccess } = useSelector((state) => state.uiSlice);

  const [messageContent, setMessageContent] = useState("");
  const dispatch = useDispatch();
  const [optionsData, setOptionsData] = useState({
    races: [],
    subRaces: [],
    classes: [],
    subClasses: [],
    alignments: [],
    languages: [],
    magicSchools: [],
    proficiencies: {
      skills: [],
      tools: [],
      armor: [],
      supplies: [],
      savingThrows: [],
    },
  });

  //VALIDATION RULES

  const abilityScoreRules = {
    required: true,
    type: "number",
    min: 1,
    max: 20,
    transform: (value) => {
      return value ? Number(value) : undefined;
    },
    message: "must be between 1 and 20",
  };

  const createCharacterHandler = (values) => {
    //JSON parse so that undefined variables are removed (firebase does not accept undefined)
    const data = JSON.parse(JSON.stringify(values));
    console.log(data);
    const id = nanoid(13);
    dispatch(createCharacter(data, uid, id));
  };

  const notSubmittedHandler = () => {
    setMessageContent("Please fill out all required fields.");
  };

  const getCategoryOptions = async (category) => {
    let data = [];
    const apiData = await getItems(`/api/${category}`);

    for (const element of apiData.results) {
      data.push({
        value: element.index,
        label: element.name,
        url: element.url,
      });
    }

    return data;
  };

  const getAllOptions = async () => {
    try {
      const races = await getCategoryOptions("races");
      const subRaces = await getCategoryOptions("subraces");
      const classes = await getCategoryOptions("classes");
      const alignments = await getCategoryOptions("alignments");
      const languages = await getCategoryOptions("languages");
      const magicSchools = await getCategoryOptions("magic-schools");
      const proficiencies = await getCategoryOptions("proficiencies");

      setOptionsData((prev) => ({
        ...prev,
        races,
        subRaces,
        classes,
        alignments,
        languages,
        magicSchools,
        proficiencies,
      }));

      const armor = [];
      const tools = [];
      const skills = [];
      const savingThrows = [];
      const other = [];
      const weaponsInstruments = [];
      const supplies = [];

      for (const proficiency of proficiencies) {
        const value = proficiency.value;
        if (
          value.includes("armor") ||
          value.includes("mail") ||
          value.includes("shirt")
        ) {
          armor.push(proficiency);
        } else if (value.includes("skill")) {
          skills.push(proficiency);
        } else if (value.includes("tools") || value.includes("kit")) {
          tools.push(proficiency);
        } else if (value.includes("supplies")) {
          supplies.push(proficiency);
        } else if (value.includes("throw")) {
          savingThrows.push(proficiency);
        } else if (
          value.includes("vehicles") ||
          value.includes("utensils") ||
          value.includes("set")
        ) {
          other.push(proficiency);
        } else {
          weaponsInstruments.push(proficiency);
        }
      }
      setOptionsData((prev) => ({
        ...prev,
        proficiencies: {
          armor,
          skills,
          tools,
          savingThrows,
          other,
          weaponsInstruments,
          supplies,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllOptions();
    requestSuccess && navigate("/");
  }, [requestSuccess]);

  const findSubclassesHandler = async (classValue) => {
    form.setFieldValue("subclass", undefined);
    const subclassesData = await getCategoryOptions(
      `classes/${classValue}/subclasses`
    );
    subclassesData.length != 0 &&
      setOptionsData((prev) => ({
        ...prev,
        subClasses: subclassesData,
      }));
  };

  const items = [
    {
      key: "1",
      label: "General",
      children: (
        <>
          <Form.Item
            name="name"
            label="Name:"
            style={{ width: "250px" }}
            rules={[
              {
                required: true,
                message: "Please name your character",
              },
            ]}
          >
            <Input placeholder="The name of your character"></Input>
          </Form.Item>

          <Form.Item
            name="race"
            label="Race:"
            rules={[
              {
                required: true,
                message: "Please pick a race",
              },
            ]}
          >
            <Select
              placeholder="Select a race"
              options={optionsData.races}
              style={{ width: "250px" }}
            />
          </Form.Item>

          <Form.Item
            name="class"
            label="Class:"
            rules={[
              {
                required: true,
                message: "Please pick a class",
              },
            ]}
          >
            <Select
              placeholder="Select a class"
              options={optionsData.classes}
              style={{ width: "250px" }}
              onSelect={(value) => findSubclassesHandler(value)}
            />
          </Form.Item>

          {optionsData.subClasses.length != 0 && (
            <Form.Item name="subclass" label="Subclass:">
              <Select
                placeholder="Subclass (optional)"
                options={optionsData.subClasses}
                style={{ width: "250px" }}
              />
            </Form.Item>
          )}
          <p>Physical appearance:</p>
          <Form.Item name="height">
            <Input addonBefore="Height"></Input>
          </Form.Item>
          <Form.Item name="weight">
            <Input addonBefore="Weight"></Input>
          </Form.Item>
          <Form.Item name="age">
            <Input addonBefore="Age"></Input>
          </Form.Item>
          <Form.Item name="eyes">
            <Input addonBefore="Eyes"></Input>
          </Form.Item>
          <Form.Item name="skin">
            <Input addonBefore="Skin"></Input>
          </Form.Item>
          <Form.Item name="hair">
            <Input addonBefore="Hair"></Input>
          </Form.Item>
          <p>Any other physical peculiarities?</p>
          <Form.Item name="physical description">
            <TextArea placeholder="describe your character"></TextArea>
          </Form.Item>
        </>
      ),
    },

    {
      key: "2",
      label: "Specs",
      children: (
        <>
          <Form.Item
            name="level"
            label="Level:"
            style={{ width: "250px" }}
            rules={[
              {
                required: true,
                message: "field mandatory",
              },
            ]}
          >
            <InputNumber min="1" max="20"></InputNumber>
          </Form.Item>
          <h3>Ability Scores:</h3>
          <Form.Item name="strength" rules={[abilityScoreRules]}>
            <Input addonBefore="Strength" type="number"></Input>
          </Form.Item>
          <Form.Item name="dexterity" rules={[abilityScoreRules]}>
            <Input addonBefore="Dexterity" type="number"></Input>
          </Form.Item>
          <Form.Item name="constitution" rules={[abilityScoreRules]}>
            <Input addonBefore="Constitution" type="number"></Input>
          </Form.Item>
          <Form.Item name="intelligence" rules={[abilityScoreRules]}>
            <Input addonBefore="Intelligence" type="number"></Input>
          </Form.Item>
          <Form.Item name="wisdom" rules={[abilityScoreRules]}>
            <Input addonBefore="Wisdom" type="number"></Input>
          </Form.Item>
          <Form.Item name="charisma" rules={[abilityScoreRules]}>
            <Input addonBefore="Charisma" type="number"></Input>
          </Form.Item>

          <h3>Proficiencies:</h3>

          {/* ovie kje bidat clickable to expand the radio buttons for every section */}

          <Form.Item name="skills" label="Skills:">
            <Checkbox.Group options={optionsData.proficiencies.skills} />
          </Form.Item>

          <Form.Item name="tools" label="Tools & Kits:">
            <Checkbox.Group options={optionsData.proficiencies.tools} />
          </Form.Item>

          <Form.Item name="armor" label="Armor:">
            <Checkbox.Group options={optionsData.proficiencies.armor} />
          </Form.Item>

          <Form.Item name="supplies" label="Supplies:">
            <Checkbox.Group options={optionsData.proficiencies.supplies} />
          </Form.Item>

          <Form.Item name="saving throws" label="Saving throws:">
            <Checkbox.Group options={optionsData.proficiencies.savingThrows} />
          </Form.Item>

          <Form.Item name="weapons" label="Weapons & Instruments:">
            <Checkbox.Group
              options={optionsData.proficiencies.weaponsInstruments}
            />
          </Form.Item>

          <Form.Item name="languages" label="Languages:">
            <Checkbox.Group options={optionsData.languages} />
          </Form.Item>
        </>
      ),
    },
    {
      key: "3",
      label: "Spells",
      children: (
        <>
          <Form.Item name="school">
            <Select
              placeholder="School of Magic"
              options={optionsData.magicSchools}
              style={{ width: "250px" }}
            />
          </Form.Item>
        </>
      ),
    },
    {
      key: "4",
      label: "Bio",
      children: (
        <>
          <Form.Item
            name="alignment"
            label="Alignment:"
            tooltip="ethical and moral compass"
          >
            <Select
              placeholder="Select alignment"
              options={optionsData.alignments}
              style={{ width: "250px" }}
              /* onSelect={(value) => console.log(value)} */
            />
          </Form.Item>

          {/* <p>Backstory</p> */}
          <Form.Item
            name="backstory"
            label="Backstory:"
            tooltip="your character's background"
          >
            <TextArea placeholder="describe your character"></TextArea>
          </Form.Item>

          <Form.Item name="personality" label="Personality:">
            <TextArea placeholder="describe your character"></TextArea>
          </Form.Item>

          <Form.Item name="ideals" label="Ideals:">
            <TextArea placeholder="describe your character"></TextArea>
          </Form.Item>

          <Form.Item name="bonds" label="Bonds:">
            <TextArea placeholder="describe your character"></TextArea>
          </Form.Item>

          <Form.Item name="flaws" label="Flaws:">
            <TextArea placeholder="describe your character"></TextArea>
          </Form.Item>

          <Form.Item name="allies" label="Allies & Organizations:">
            <TextArea placeholder="describe your character"></TextArea>
          </Form.Item>

          <Form.Item name="image">
            <Input addonBefore="Image"></Input>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <h2 className={cssClasses.title}>Create a new character</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={createCharacterHandler}
        onFinishFailed={notSubmittedHandler}
        className={cssClasses.characterForm}
        initialValues={{
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
          level: 1,
        }}
      >
        <Tabs defaultActiveKey="1" items={items} />
        <Button danger>Cancel</Button>
        <p>{messageContent}</p>
      </Form>
    </>
  );
};

export default NewCharacterPage;
