export const getItem = async (searchedItem) => {
  try {
    const response = await fetch("https://www.dnd5eapi.co/api/" + searchedItem);
    if (!response.ok) {
      throw new Error("Something went wrong.");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error.message);
  }
};
