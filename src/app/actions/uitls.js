export const currencyToCopper = (gp = 0, sp = 0, cp = 0) => {
  const copperCurrency = gp * 100 + sp * 10 + cp;
  return copperCurrency;
};

export const currencyForDisplay = (value) => {
  const gp = Math.floor(value / 100) || 0;
  const sp = Math.floor((value % 100) / 10) || 0;
  const cp = value % 10 || 0;

  return { gp, sp, cp };
};

export const currencyForShopDisplay = (value) => {
  let gp = Math.floor(value / 100) || 0;
  let sp = Math.floor((value % 100) / 10) || 0;
  let cp = value % 10 || 0;

  if (gp && sp && !cp) {
    sp += 10 * gp;
    gp = 0;
  }

  if ((gp || sp) && cp) {
    cp = value;
    gp = 0;
    sp = 0;
  }

  return { gp, sp, cp };
};

/*  currency will be stored as cp, and converted to the rest for display
    copper *1
    silver *10
    gold  *100 
    platinum *1000 */
