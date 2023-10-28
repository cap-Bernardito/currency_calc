export type Currencies = ["USD", "RUB", "EUR"];

export type CurrenciesUnion = Currencies[number];

export type CurrencyDTO = {
  code: CurrenciesUnion;
  price_pay: number;
  price_purchase: number;
};

type MapCurrensiesDTO<T extends CurrencyDTO[]> = {
  [P in T[number]["code"]]: {
    code: P;
    price_pay: number;
    price_purchase: number;
  };
};

export type StateSchema = {
  currencyAvailable: CurrenciesUnion;
  currencyWant: CurrenciesUnion;
  availableCount: string;
  wantCount: string;
  currencies: MapCurrensiesDTO<CurrencyDTO[]>;
};

// Actions
type CurrencyAvailableAction = {
  type: "currencyAvailable";
  payload: CurrenciesUnion;
};

type CurrencyWantAction = {
  type: "currencyWant";
  payload: CurrenciesUnion;
};

type AvailableCount = {
  type: "availableCount";
  payload: string;
};

type WantCount = {
  type: "wantCount";
  payload: string;
};

type Switch = {
  type: "switch";
};

export type Actions =
  | CurrencyAvailableAction
  | CurrencyWantAction
  | AvailableCount
  | WantCount
  | Switch;
