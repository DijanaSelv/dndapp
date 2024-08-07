import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

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
import { useForm } from "antd/es/form/Form";
import { nanoid } from "nanoid";
//css classes distinguish from the dnd character classes
import cssClasses from "./NewCharacterPage.module.css";

import { STARTING_GOLD } from "../../app/STATIC_STARTING_GOLD";
import { getItems } from "../../app/actions/dndApiActions";
import { createCharacter } from "../../app/actions/databaseActions";
import { currencyToCopper } from "../../app/actions/uitls";
import SpellsFormData from "../../components/SpellsFormData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import NewShopPage from "../newshoppage/NewShopPage";

const NewCharacterPage = () => {
  const { TextArea } = Input;
  const [form] = useForm();
  const navigate = useNavigate();
  const { uid } = useSelector((state) => state.userSlice.user);
  const { requestSuccess } = useSelector((state) => state.uiSlice);

  const [goldValueTooltip, setGoldValueTooltip] = useState(
    "Starting gold will be adjusted if you select your class"
  );

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
    spells: [],
    spellsData: [],
    spellsSelected: 0,
    proficiencies: {
      skills: [],
      tools: [],
      armor: [],
      supplies: [],
      savingThrows: [],
    },
    classSelected: null,
    levelSelected: 1,
    wisdomSelected: 10,
    charismaSelected: 10,
    equipment: [],
  });

  const [activeKey, setActiveKey] = useState(1);

  const changeTabHandler = (newTab) => {
    setActiveKey(newTab);
  };

  const onValuesChangeHandler = (changedValues) => {
    if (changedValues.class) {
      const classInput = changedValues.class;
      const updatedGold = STARTING_GOLD[classInput];
      form.setFieldsValue({ gold: updatedGold });
      setGoldValueTooltip(`This is the suggested amount for a ${classInput}`);

      //i need the state to pass the class to the spell cards component
      setOptionsData((prev) => ({ ...prev, classSelected: classInput }));
    }
    if (changedValues.level) {
      setOptionsData((prev) => ({
        ...prev,
        levelSelected: changedValues.level,
      }));
    }
    if (changedValues.wisdom) {
      setOptionsData((prev) => ({
        ...prev,
        wisdomSelected: changedValues.wisdom,
      }));
    }
    if (changedValues.charisma) {
      setOptionsData((prev) => ({
        ...prev,
        charismaSelected: changedValues.charisma,
      }));
    }
  };

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

  //ON SUBMIT
  const createCharacterHandler = (values) => {
    //JSON parse so that undefined variables are removed (firebase does not accept undefined)
    values["gold"] = currencyToCopper(values["gold"]);
    const equipment = optionsData.equipment;
    const data = { ...values, equipment };
    const dataToSave = JSON.parse(JSON.stringify(data));
    const id = nanoid(13);
    dispatch(createCharacter(dataToSave, uid, id));
  };

  const notSubmittedHandler = () => {
    setMessageContent("Please fill out all required fields.");
  };

  //fetch from api
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
      const spells = await getCategoryOptions("spells");

      setOptionsData((prev) => ({
        ...prev,
        races,
        subRaces,
        classes,
        alignments,
        languages,
        magicSchools,
        proficiencies,
        spells,
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
          spells,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllOptions();
  }, []);

  useEffect(() => {
    const fetchSpellsData = async () => {
      const spellsData = await Promise.all(
        optionsData.spells.map((spell) => getItems(spell.url))
      );
      return spellsData;
    };
    if (optionsData.spells.length !== 0) {
      const fetchData = async () => {
        const spellsData = await fetchSpellsData();

        setOptionsData((prev) => ({
          ...prev,
          spellsData,
        }));
      };
      fetchData();
    }
  }, [optionsData.spells]);

  useEffect(() => {
    requestSuccess && navigate("/");
  }, [requestSuccess]);

  useEffect(() => {}, []);

  //FORM CONTENT

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
      key: 1,
      label: <div onClick={() => changeTabHandler(1)}>General</div>,
      children: (
        <>
          <div className={cssClasses.nameRaceClassContainer}>
            {" "}
            <Form.Item
              name="name"
              label="Name:"
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
              <Select placeholder="Select a race" options={optionsData.races} />
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
      key: 2,
      label: (
        <div onClick={() => changeTabHandler(2)}>Abilities & Proficiencies</div>
      ),
      children: (
        <>
          <Form.Item
            className={cssClasses.levelForm}
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
            <Form.Item name="strength" label="Strength">
              <InputNumber min="1" max="20"></InputNumber>
            </Form.Item>
            <Form.Item name="dexterity" label="Dexterity">
              <InputNumber min="1" max="20"></InputNumber>
            </Form.Item>
            <Form.Item name="constitution" label="Constitution">
              <InputNumber min="1" max="20"></InputNumber>
            </Form.Item>
            <Form.Item name="intelligence" label="Intelligence">
              <InputNumber min="1" max="20"></InputNumber>
            </Form.Item>
            <Form.Item name="wisdom" label="Wisdom">
              <InputNumber min="1" max="20"></InputNumber>
            </Form.Item>
            <Form.Item name="charisma" label="Charisma">
              <InputNumber min="1" max="20"></InputNumber>
            </Form.Item>
          </div>

          <h3>Proficiencies:</h3>
          <Collapse items={collapseItems} />
        </>
      ),
    },
    {
      key: 3,
      label: <div onClick={() => changeTabHandler(3)}>Magic & Spells</div>,
      children: (
        <>
          {optionsData.levelSelected >= 2 &&
            optionsData.classSelected === "wizard" && (
              <div>
                <Form.Item
                  name="school"
                  label="Arcane Tradition:"
                  tooltip="On lvl. 2 Wizards choose a school of magic that will shape their spellcasting abilities."
                >
                  <Select
                    placeholder="School of Magic"
                    options={optionsData.magicSchools}
                  />
                </Form.Item>
              </div>
            )}

          {optionsData.spellsData && (
            <SpellsFormData
              spellsData={optionsData.spellsData}
              getFieldValue={form.getFieldValue}
              wisdomInput={optionsData.wisdomSelected}
              charismaInput={optionsData.charismaSelected}
              classInput={optionsData.classSelected}
              levelInput={optionsData.levelSelected}
              key="spellsForm"
            />
          )}
        </>
      ),
    },
    {
      key: 4,
      label: <div onClick={() => changeTabHandler(4)}>Biography</div>,
      children: (
        <div className={cssClasses.bioContainer}>
          <div className={cssClasses.bioFirstRow}>
            <Form.Item
              name="alignment"
              label="Alignment:"
              tooltip="ethical and moral compass"
            >
              <Select
                placeholder="Select alignment"
                options={optionsData.alignments}
              />
            </Form.Item>

            <Form.Item
              name="gold"
              label="Starting gold:"
              tooltip={goldValueTooltip}
            >
              <Input addonBefore="gp" type="number"></Input>
            </Form.Item>

            <Form.Item name="image" label="Image:">
              <Input addonBefore="Url:"></Input>
            </Form.Item>
          </div>

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
        </div>
      ),
    },
    {
      key: 5,
      label: <div onClick={() => changeTabHandler(5)}>Equipment</div>,
      children: (
        <Form.Item name="inventory">
          <NewShopPage
            characterEquipment={true}
            setOptionsData={setOptionsData}
          />
        </Form.Item>
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
        onValuesChange={onValuesChangeHandler}
      >
        <Tabs
          defaultActiveKey="1"
          items={items}
          activeKey={activeKey}
          /* onChange={(key = setActiveKey(key))} */
        />
        <div className={cssClasses.buttonsContainer}>
          {" "}
          {activeKey === 5 && (
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          )}
          {activeKey < 5 && (
            <Button onClick={() => changeTabHandler(activeKey + 1)}>
              Next <FontAwesomeIcon icon={faArrowRightLong} />
            </Button>
          )}
          {activeKey > 1 && (
            <Button onClick={() => changeTabHandler(activeKey - 1)}>
              <FontAwesomeIcon icon={faArrowLeftLong} />
              Back
            </Button>
          )}
        </div>
        <p>{messageContent}</p>
      </Form>
    </>
  );
};

export default NewCharacterPage;
