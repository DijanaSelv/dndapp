export const getItems = async (searchedItemUrl, options = {}) => {
  try {
    const response = await fetch("https://www.dnd5eapi.co" + searchedItemUrl, {
      /* this is so that abort controller can work */
      signal: options.signal,
    });
    if (!response.ok) {
      throw new Error("Something went wrong.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // Ignore abort errors (they're expected)
    if (error.name === "AbortError") return;

    console.error(error.message);
  }
};

export const createItemObjectForShop = (itemData) => {
  const item = {
    amount: "",
    id: itemData.index,
    name: itemData.name,
    price: itemData.cost?.quantity
      ? { [itemData.cost.unit]: itemData.cost.quantity }
      : "N/A",
    url: itemData.url,
  };

  return item;
};
