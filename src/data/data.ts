import { StateSchema, CurrencyDTO } from "../components/form";

const data: CurrencyDTO[] = [
  {
    code: "RUB",
    price_pay: 1,
    price_purchase: 1,
  },
  {
    code: "USD",
    price_pay: 90,
    price_purchase: 95,
  },
  {
    code: "EUR",
    price_pay: 100,
    price_purchase: 110,
  },
];

export const convertedData = data.reduce(
  (acc, item) => {
    return { ...acc, [item.code]: item };
  },
  {} as StateSchema["currencies"],
);
