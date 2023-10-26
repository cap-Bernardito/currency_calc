import { StateSchema } from "../types/types";

const data = [
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const convertedData: StateSchema["currencies"] = data.reduce(
  (acc, item) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    acc[item.code] = item;

    return acc;
  },
  {},
);
