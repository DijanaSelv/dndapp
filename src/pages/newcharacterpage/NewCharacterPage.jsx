import {
  Input,
  Button,
  Select,
  Checkbox,
  Tabs,
  Form,
  InputNumber,
  Collapse,
} from "antd";
import { useEffect, useState } from "react";
import { getItems } from "../../app/actions/dndApiActions";
import { useForm } from "antd/es/form/Form";

//css classes distinguish from the dnd character classes
import cssClasses from "./NewCharacterPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { createCharacter } from "../../app/actions/databaseActions";
import { useNavigate } from "react-router";
import { currencyToCopper } from "../../app/actions/uitls";

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
    values["gold"] = currencyToCopper(values["gold"]);
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

  const collapseItems = [
    {
      key: "skills",
      label: "Skills",
      children: (
        <Form.Item name="skills">
          <Checkbox.Group
            className={cssClasses.checkboxGroupContainer}
            options={optionsData.proficiencies.skills}
          />
        </Form.Item>
      ),
    },
    {
      key: "tools",
      label: "Tools & Kits",
      children: (
        <Form.Item name="tools">
          <Checkbox.Group
            className={cssClasses.checkboxGroupContainer}
            options={optionsData.proficiencies.tools}
          />
        </Form.Item>
      ),
    },
    {
      key: "armor",
      label: "Armor",
      children: (
        <Form.Item name="armor">
          <Checkbox.Group
            className={cssClasses.checkboxGroupContainer}
            options={optionsData.proficiencies.armor}
          />
        </Form.Item>
      ),
    },
    {
      key: "supplies",
      label: "Supplies",
      children: (
        <Form.Item name="supplies">
          <Checkbox.Group
            className={cssClasses.checkboxGroupContainer}
            options={optionsData.proficiencies.supplies}
          />
        </Form.Item>
      ),
    },
    {
      key: "saving throws",
      label: "Saving Throws",
      children: (
        <Form.Item name="saving throws">
          <Checkbox.Group
            className={cssClasses.checkboxGroupContainer}
            options={optionsData.proficiencies.savingThrows}
          />
        </Form.Item>
      ),
    },
    {
      key: "weapons",
      label: "Weapons & Instruments",
      children: (
        <Form.Item name="weapons">
          <Checkbox.Group
            className={cssClasses.checkboxGroupContainer}
            options={optionsData.proficiencies.weaponsInstruments}
          />
        </Form.Item>
      ),
    },
    {
      key: "languages",
      label: "Languages",
      children: (
        <Form.Item name="languages">
          <Checkbox.Group
            className={cssClasses.checkboxGroupContainer}
            options={optionsData.languages}
          />
        </Form.Item>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "General",
      children: (
        <>
          <div className={cssClasses.nameRaceClassContainer}>
            {" "}
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please name your character",
                },
              ]}
            >
              <h3>* Name</h3>
              <Input placeholder="The name of your character"></Input>
            </Form.Item>
            <Form.Item
              name="race"
              rules={[
                {
                  required: true,
                  message: "Please pick a race",
                },
              ]}
            >
              <h3>* Race</h3>
              <Select placeholder="Select a race" options={optionsData.races} />
            </Form.Item>
            <Form.Item
              name="class"
              rules={[
                {
                  required: true,
                  message: "Please pick a class",
                },
              ]}
            >
              <h3>* Class</h3>
              <Select
                placeholder="Select a class"
                options={optionsData.classes}

                /* onSelect={(value) => findSubclassesHandler(value)} */
              />
            </Form.Item>
          </div>

          {/* The database only has one subclass per class */}
          {/* {optionsData.subClasses.length != 0 && (
            <Form.Item name="subclass" label="Subclass:">
              <Select
                placeholder="Subclass (optional)"
                options={optionsData.subClasses}
                style={{ width: "250px" }}
              />
            </Form.Item>
          )} */}
          <h3>Physical appearance:</h3>
          <div className={cssClasses.physicalAppearanceContainer}>
            {" "}
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
          </div>
          <h3>Any other physical peculiarities?</h3>
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
          <div className={cssClasses.abilityScoresContainer}>
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
          </div>

          <h3>Proficiencies:</h3>
          <Collapse items={collapseItems} />
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

              /* onSelect={(value) => console.log(value)} */
            />
          </Form.Item>

          <Form.Item name="gold" label="Starting gold:">
            <Input addonBefore="gp" type="number"></Input>
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
          gold: 50,
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
