import { StateSchema } from "components/form/model/types";

const rubToСurrency = (
  data: Pick<StateSchema, "currencies" | "currencyWant">,
  amount: number,
  isInverse = false,
) => {
  // Рубли в валюту (RUB -> USD) считаем по цене price_purchase
  // const countRUB = 100;
  // const countUSD = countRUB / state.USD.price_purchase
  const { currencies, currencyWant } = data;
  const price = Number(currencies[currencyWant].price_purchase);

  return isInverse ? (amount * price).toFixed(2) : (amount / price).toFixed(2);
};

const currencyToRub = (
  data: Pick<StateSchema, "currencies" | "currencyAvailable">,
  amount: number,
  isInverse = false,
) => {
  // Валюта в рубли (USD -> RUB) считаем по цене price_pay
  // const countUSD = 10;
  // const countRUB = countUSD * state.USD.price_pay
  const { currencies, currencyAvailable } = data;
  const price = Number(currencies[currencyAvailable].price_pay);

  return isInverse ? (amount / price).toFixed(2) : (amount * price).toFixed(2);
};

const currencyToСurrency = (
  data: Pick<StateSchema, "currencies" | "currencyAvailable" | "currencyWant">,
  amount: number,
  isInverse = false,
) => {
  // Валюта в валюту - сначала валюту в рубли по цене price_pay, потом рубли в валюту по цене price_purchase
  // const countUSD = 10;
  // const countEUR = countUSD * state.USD.price_pay / state.EUR.price_purchase
  const { currencies, currencyAvailable, currencyWant } = data;

  if (!isInverse) {
    const price_pay = Number(currencies[currencyAvailable].price_pay);
    const price_purchase = Number(currencies[currencyWant].price_purchase);
    const priceRub = amount * price_pay;

    return (priceRub / price_purchase).toFixed(2);
  }

  const price_pay = Number(currencies[currencyWant].price_pay);
  const price_purchase = Number(currencies[currencyAvailable].price_purchase);
  const priceRub = amount * price_pay;

  return (priceRub / price_purchase).toFixed(2);
};

export const getCalculator = (
  state: Pick<StateSchema, "currencyAvailable" | "currencyWant">,
) => {
  const fromIsRub = state.currencyAvailable === "RUB";
  const toIsRub = state.currencyWant === "RUB";

  if (fromIsRub) {
    return rubToСurrency;
  }

  if (toIsRub) {
    return currencyToRub;
  }

  return currencyToСurrency;
};
