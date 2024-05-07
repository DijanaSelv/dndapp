import { Input, Button, Select, Radio, Checkbox } from "antd";
import { Form } from "react-router-dom";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { getItems } from "../../app/actions/dndApiActions";

const NewCharacterPage = () => {
  const { TextArea } = Input;
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

  const createCharacterHandler = (e) => {
    e.preventDefault();
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
          <Input
            addonBefore="Name"
            placeholder="The name of your character"
          ></Input>
          <p>Race</p>
          <Select
            placeholder="Select a race"
            options={optionsData.races}
            style={{ width: "250px" }}
            onSelect={(value) => console.log(value)}
          />
          <p>Class</p>
          <Select
            placeholder="Select a class"
            options={optionsData.classes}
            style={{ width: "250px" }}
            onSelect={(value) => findSubclassesHandler(value)}
          />
          {/* TODO:on change class reset subclass if it was selected */}
          {optionsData.subClasses.length != 0 && (
            <Select
              placeholder="Subclass (optional)"
              options={optionsData.subClasses}
              style={{ width: "250px" }}
              onSelect={(value) => console.log(value)}
            />
          )}
          <h3>Physical appearance</h3>
          <Input addonBefore="Height"></Input>
          <Input addonBefore="Weight"></Input>
          <Input addonBefore="Age"></Input>
          <Input addonBefore="Eyes"></Input>
          <Input addonBefore="Skin"></Input>
          <Input addonBefore="Hair"></Input>
          <p>Any other pshysical peculiarities?</p>
          <TextArea placeholder="describe your character"></TextArea>
        </>
      ),
    },

    {
      key: "2",
      label: "Specs",
      children: (
        <>
          <h3>Ability Scores</h3>
          <Input
            addonBefore="Strength"
            placeholder="The name of your character"
            type="number"
          ></Input>
          <Input addonBefore="Dexterity" type="number"></Input>
          <Input addonBefore="Constitution" type="number"></Input>
          <Input addonBefore="Intelligence" type="number"></Input>
          <Input addonBefore="Wisdom" type="number"></Input>
          <Input addonBefore="Charisma" type="number"></Input>

          <h3>Proficiencies</h3>

          {/* ovie kje bidat clickable to expand the radio buttons for every section */}
          <p>Skills</p>
          <Checkbox.Group options={optionsData.proficiencies.skills} />
          <p>Tools & Kits</p>
          <Checkbox.Group options={optionsData.proficiencies.tools} />
          <p>Armor</p>
          <Checkbox.Group options={optionsData.proficiencies.armor} />
          <p>Supplies</p>
          <Checkbox.Group options={optionsData.proficiencies.supplies} />
          <p>Saving Throws</p>
          <Checkbox.Group options={optionsData.proficiencies.savingThrows} />
          <p>Weapons & Instruments</p>
          <Checkbox.Group
            options={optionsData.proficiencies.weaponsInstruments}
          />

          <h3>Languages</h3>
          <Checkbox.Group options={optionsData.languages} />
        </>
      ),
    },
    {
      key: "3",
      label: "Spells",
      children: (
        <>
          <Select
            placeholder="School of Magic"
            options={optionsData.magicSchools}
            style={{ width: "250px" }}
            onSelect={(value) => console.log(value)}
          />
        </>
      ),
    },
    {
      key: "4",
      label: "Bio",
      children: (
        <>
          <p>Alignment</p>
          <Select
            placeholder="Select alignment"
            options={optionsData.alignments}
            style={{ width: "250px" }}
            onSelect={(value) => console.log(value)}
          />
          <p>Backstory</p>
          <TextArea placeholder="describe your character"></TextArea>
          <p>Personality</p>
          <TextArea placeholder="describe your character"></TextArea>
          <p>Ideals</p>
          <TextArea placeholder="describe your character"></TextArea>
          <p>Bonds</p>
          <TextArea placeholder="describe your character"></TextArea>
          <p>Flaws</p>
          <TextArea placeholder="describe your character"></TextArea>
          <p>Allies & Organizations</p>
          <TextArea placeholder="describe your character"></TextArea>
          <Input addonBefore="Image"></Input>
          <Button
            type="primary"
            htmlType="submit"
            onClick={createCharacterHandler}
          >
            Submit
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <h3>Create new character</h3>
      <Form>
        <Tabs defaultActiveKey="1" items={items} />
        <Button danger>Cancel</Button>
      </Form>
    </>
  );
};

export default NewCharacterPage;
