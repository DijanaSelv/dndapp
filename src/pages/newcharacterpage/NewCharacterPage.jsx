import { Input, Button, Select, Radio, Checkbox, Tabs, Form } from "antd";

import { useEffect, useState } from "react";
import { getItems } from "../../app/actions/dndApiActions";
import { useForm } from "antd/es/form/Form";

const NewCharacterPage = () => {
  const { TextArea } = Input;
  const [form] = useForm();
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
    type: "number",
    min: 1,
    max: 20,
    transform: (value) => {
      return value ? Number(value) : undefined;
    },
    message: "Must be between 1 and 20",
  };

  const createCharacterHandler = (values) => {
    console.log(values);
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
    console.log(optionsData);
  }, []);

  const findSubclassesHandler = async (classValue) => {
    form.setFieldValue("subclass", null);
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
          <h3>General</h3>
          <Form.Item name="name">
            <Input
              addonBefore="Name"
              placeholder="The name of your character"
            ></Input>
          </Form.Item>
          <p>Race</p>
          <Form.Item name="race">
            <Select
              placeholder="Select a race"
              options={optionsData.races}
              style={{ width: "250px" }}
              onSelect={(value) => console.log(value)}
            />
          </Form.Item>
          <p>Class</p>
          <Form.Item name="class">
            <Select
              placeholder="Select a class"
              options={optionsData.classes}
              style={{ width: "250px" }}
              onSelect={(value) => findSubclassesHandler(value)}
            />
          </Form.Item>
          {/* TODO:on change class reset subclass if it was selected */}
          {optionsData.subClasses.length != 0 && (
            <Form.Item name="subclass">
              <Select
                placeholder="Subclass (optional)"
                options={optionsData.subClasses}
                style={{ width: "250px" }}
              />
            </Form.Item>
          )}
          <h3>Physical appearance</h3>
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
          <p>Any other pshysical peculiarities?</p>
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
          <h3>Ability Scores</h3>
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

          <h3>Proficiencies</h3>

          {/* ovie kje bidat clickable to expand the radio buttons for every section */}
          <p>Skills</p>
          <Form.Item name="skills">
            <Checkbox.Group options={optionsData.proficiencies.skills} />
          </Form.Item>
          <p>Tools & Kits</p>
          <Form.Item name="tools">
            <Checkbox.Group options={optionsData.proficiencies.tools} />
          </Form.Item>
          <p>Armor</p>
          <Form.Item name="armor">
            <Checkbox.Group options={optionsData.proficiencies.armor} />
          </Form.Item>
          <p>Supplies</p>
          <Form.Item name="supplies">
            <Checkbox.Group options={optionsData.proficiencies.supplies} />
          </Form.Item>
          <p>Saving Throws</p>
          <Form.Item name="saving throws">
            <Checkbox.Group options={optionsData.proficiencies.savingThrows} />
          </Form.Item>
          <p>Weapons & Instruments</p>
          <Form.Item name="weapons">
            <Checkbox.Group
              options={optionsData.proficiencies.weaponsInstruments}
            />
          </Form.Item>

          <h3>Languages</h3>
          <Form.Item name="languages">
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
              onSelect={(value) => console.log(value)}
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
              onSelect={(value) => console.log(value)}
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

          <Form.Item name="avatar" label="Avatar:">
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
      <h3>Create new character</h3>
      <Form form={form} layout="vertical" onFinish={createCharacterHandler}>
        <Tabs defaultActiveKey="1" items={items} />
        <Button danger>Cancel</Button>
      </Form>
    </>
  );
};

export default NewCharacterPage;
