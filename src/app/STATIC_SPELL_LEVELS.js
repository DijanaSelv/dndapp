export const SPELLS_AVAILABLE = {
  bard: [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22,
  ],
  sorcerer: [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15,
  ],
  ranger: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
  wizard: [
    6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42,
    44,
  ],
};

//~~~~~~~~~~~~~~~~~~~~~CLASSES THAT PREPARE SPELLS FROM ALL AVAILABLE

//DRUID:
//PREPARE spells - wis mod + druid level. Can change on long rest.
//can change cantrips on lvl 4, 8, 12, 16, 19
//CLERIC: all spells available for which he has spell slots ( 3 cantrips).
//SPELLS TO PREAPRE - wis mod + cleric level. Can change prepared spells on long rest.
//CANTRIPS are not prepared but learnt
//On lvl 4, 8, 12,16, 19 they can replace a cantrip with a new one.

//PALADIN:
//PREPARES spells from available ones. Char mod + 1/2 paladin level rounded down (min 1 spell)

//BARD:
//KNOWS Spells There is a limit to how many spells they know. (SPELLS KNOWN)

//~~~~~~~~~~~~~~~~~~~LEARNS SPELLS

//SORCERER:
//SORCERY POINTS equal to its level, except lvl 1 has zero. lvl 2 has 2 point and so on.
//KNOWS SPELLS - Spells known from the available spells. slots used to cast them. (SPELLS KNOWN LIMIT)
//can use sorcery points to gain additional spell slots, or sacrifice spell slots to gain additional sorcery points.

//WARLOCK:
//KNOWS spells from the available list for the avialable level (spell slot level number). Can replace old spells with new on gained level.
//eldritch invocations available : /api/features/eldritch-invocations
//replenish slots on short or long rest

//RANGER:
//KNOWS from the list.
//can replace a spell with a new one on gain level

//~~~~~~~~~~~~~~~~LEARNS AND PREPARES SPELLS

//WIZARD: first level gets to learn 3 cantrips + 6 first level spells.
//KNOWS SPELLS - Each next level gets to learn + 2 new spells from available spell slot levels.
// wizard gets to PREPARE spells every long rest.
//on lvl 3 they can replace one cantrip with another.
//SPELLS  6 + (levelx2) + cantrips according to the table

export const SPELL_SLOTS = {
  //CANTRIPS (the first number is CANTRIPS KNOWN, not slots.)
  //applicable for: wizard, cleric
  wizard: {
    1: [3, 2],
    2: [3, 3],
    3: [3, 4, 2],
    4: [4, 4, 3],
    5: [4, 4, 3, 2],
    6: [4, 4, 3, 3],
    7: [4, 4, 3, 3, 1],
    8: [4, 4, 3, 3, 2],
    9: [4, 4, 3, 3, 3, 1],
    10: [5, 4, 3, 3, 3, 2],
    11: [5, 4, 3, 3, 3, 2, 1],
    12: [5, 4, 3, 3, 3, 2, 1],
    13: [5, 4, 3, 3, 3, 2, 1, 1],
    14: [5, 4, 3, 3, 3, 2, 1, 1],
    15: [5, 4, 3, 3, 3, 2, 1, 1, 1],
    16: [5, 4, 3, 3, 3, 2, 1, 1, 1],
    17: [5, 4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [5, 4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [5, 4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [5, 4, 3, 3, 3, 3, 2, 2, 1, 1],
  },
  cleric: {
    1: [3, 2],
    2: [3, 3],
    3: [3, 4, 2],
    4: [4, 4, 3],
    5: [4, 4, 3, 2],
    6: [4, 4, 3, 3],
    7: [4, 4, 3, 3, 1],
    8: [4, 4, 3, 3, 2],
    9: [4, 4, 3, 3, 3, 1],
    10: [5, 4, 3, 3, 3, 2],
    11: [5, 4, 3, 3, 3, 2, 1],
    12: [5, 4, 3, 3, 3, 2, 1],
    13: [5, 4, 3, 3, 3, 2, 1, 1],
    14: [5, 4, 3, 3, 3, 2, 1, 1],
    15: [5, 4, 3, 3, 3, 2, 1, 1, 1],
    16: [5, 4, 3, 3, 3, 2, 1, 1, 1],
    17: [5, 4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [5, 4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [5, 4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [5, 4, 3, 3, 3, 3, 2, 2, 1, 1],
  },

  druid: {
    1: [2, 2],
    2: [2, 3],
    3: [2, 4, 2],
    4: [3, 4, 3],
    5: [3, 4, 3, 2],
    6: [3, 4, 3, 3],
    7: [3, 4, 3, 3, 1],
    8: [3, 4, 3, 3, 2],
    9: [3, 4, 3, 3, 3, 1],
    10: [4, 4, 3, 3, 3, 2],
    11: [4, 4, 3, 3, 3, 2, 1],
    12: [4, 4, 3, 3, 3, 2, 1],
    13: [4, 4, 3, 3, 3, 2, 1, 1],
    14: [4, 4, 3, 3, 3, 2, 1, 1],
    15: [4, 4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 4, 3, 3, 3, 3, 2, 2, 1, 1],
  },
  bard: {
    1: [2, 2],
    2: [2, 3],
    3: [2, 4, 2],
    4: [3, 4, 3],
    5: [3, 4, 3, 2],
    6: [3, 4, 3, 3],
    7: [3, 4, 3, 3, 1],
    8: [3, 4, 3, 3, 2],
    9: [3, 4, 3, 3, 3, 1],
    10: [4, 4, 3, 3, 3, 2],
    11: [4, 4, 3, 3, 3, 2, 1],
    12: [4, 4, 3, 3, 3, 2, 1],
    13: [4, 4, 3, 3, 3, 2, 1, 1],
    14: [4, 4, 3, 3, 3, 2, 1, 1],
    15: [4, 4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 4, 3, 3, 3, 3, 2, 2, 1, 1],
  },
  sorcerer: {
    1: [4, 2],
    2: [4, 3],
    3: [4, 4, 2],
    4: [5, 4, 3],
    5: [5, 4, 3, 2],
    6: [5, 4, 3, 3],
    7: [5, 4, 3, 3, 1],
    8: [5, 4, 3, 3, 2],
    9: [5, 4, 3, 3, 3, 1],
    10: [6, 4, 3, 3, 3, 2],
    11: [6, 4, 3, 3, 3, 2, 1],
    12: [6, 4, 3, 3, 3, 2, 1],
    13: [6, 4, 3, 3, 3, 2, 1, 1],
    14: [6, 4, 3, 3, 3, 2, 1, 1],
    15: [6, 4, 3, 3, 3, 2, 1, 1, 1],
    16: [6, 4, 3, 3, 3, 2, 1, 1, 1],
    17: [6, 4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [6, 4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [6, 4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [6, 4, 3, 3, 3, 3, 2, 2, 1, 1],
  },
  warlock: {
    //for warlock there are no levels. The numbers signify [cantrips, spells, slots, slot level, invocations]
    1: [2, 2, 1, 1],
    2: [2, 3, 2, 1, 2],
    3: [2, 4, 2, 2, 2],
    4: [3, 5, 2, 2, 2],
    5: [3, 6, 2, 3, 3],
    6: [3, 7, 2, 3, 3],
    7: [3, 8, 2, 4, 4],
    8: [3, 9, 2, 4, 4],
    9: [3, 10, 2, 5, 5],
    10: [4, 10, 2, 5, 5],
    11: [4, 11, 3, 5, 6],
    12: [4, 11, 3, 5, 5],
    13: [4, 12, 3, 5, 6],
    14: [4, 12, 3, 5, 6],
    15: [4, 13, 3, 5, 7],
    16: [4, 13, 3, 5, 7],
    17: [4, 14, 4, 5, 7],
    18: [4, 14, 4, 5, 8],
    19: [4, 15, 4, 5, 8],
    20: [4, 15, 4, 5, 8],
  },
  ranger: {
    1: [0],
    2: [0, 2],
    3: [0, 3],
    4: [0, 3],
    5: [0, 4, 2],
    6: [0, 4, 2],
    7: [0, 4, 3],
    8: [0, 4, 3],
    9: [0, 4, 3, 2],
    10: [0, 4, 3, 2],
    11: [0, 4, 3, 3],
    12: [0, 4, 3, 3],
    13: [0, 4, 3, 3, 1],
    14: [0, 4, 3, 3, 1],
    15: [0, 4, 3, 3, 2],
    16: [0, 4, 3, 3, 2],
    17: [0, 4, 3, 3, 3],
    18: [0, 4, 3, 3, 3],
    19: [0, 4, 3, 3, 3, 1],
    20: [0, 4, 3, 3, 3, 1],
  },
  paladin: {
    1: [0],
    2: [0, 2],
    3: [0, 3],
    4: [0, 3],
    5: [0, 4, 2],
    6: [0, 4, 2],
    7: [0, 4, 3],
    8: [0, 4, 3],
    9: [0, 4, 3, 2],
    10: [0, 4, 3, 2],
    11: [0, 4, 3, 3],
    12: [0, 4, 3, 3],
    13: [0, 4, 3, 3, 1],
    14: [0, 4, 3, 3, 1],
    15: [0, 4, 3, 3, 2],
    16: [0, 4, 3, 3, 2],
    17: [0, 4, 3, 3, 3],
    18: [0, 4, 3, 3, 3],
    19: [0, 4, 3, 3, 3, 1],
    20: [0, 4, 3, 3, 3, 1],
  },
};

export const SPELLS_INSTRUCTION = {
  druid:
    "You learn cantrips that are avialable to you at all times. You can prepare spells from your class spell list and modify them every long rest. The number of prepapred spells depend on your Wisdom modifier and class level.",
  paladin:
    "Paladins get to learn spells when they reach level 2. You can prepare spells from your class spell list and modify them every long rest. The number of prepapred spells depend on your Charisma modifier and class level.",
  cleric:
    "You learn cantrips that are avialable to you at all times. You can prepare spells from your class spell list and modify them every long rest. The number of prepapred spells depend on your Wisdom modifier and class level.",
  bard: "You learn cantrips that are avialable to you at all times. You can prepare spells from your class spell list and modify them every long rest.",
  sorcerer:
    "You learn spells from you class spell list that are available for you to cast at all times. You can use sorcery points to gain additional spell slots, or sacrifice spell slots to gain additional sorcery points.",
  warlock:
    "You learn spells from your class spell list that are avialable for you to cast at all times. On a gained level you can replace old spells with new ones. You cast spells by using your spell slots avialable.",
  ranger:
    "The rangers get to learn new spells when they reach level 2. You learn spells from your class spell list that are available for you to cast at all times. On a gained level you can replace one old spell with a new one. ",
  wizard:
    "You learn spells from your class spell list. Then on every long break you prepare your spells that will be available for you to cast.",
};
