export const getItem = async (searchedItemUrl) => {
  try {
    const response = await fetch("https://www.dnd5eapi.co" + searchedItemUrl);
    if (!response.ok) {
      throw new Error("Something went wrong.");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error.message);
  }
};
