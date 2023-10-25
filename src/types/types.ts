type TupleToUnion<T extends unknown[]> = T[number];

export type Currencies = ["USD", "RUB", "EUR"];

export type CurrencyUnion = TupleToUnion<Currencies>;

export type FromToData = {
  code: CurrencyUnion;
  rate: number;
};

export type FromToAllData = Record<CurrencyUnion, FromToData>;

export type StateSchema = {
  currencyAvailable: CurrencyUnion;
  currencyWant: CurrencyUnion;
  availableCount: string;
  wantCount: string;
  currencies: Record<CurrencyUnion, Partial<FromToAllData>>;
};

// Actions
type CurrencyAvailableAction = {
  type: "currencyAvailable";
  payload: CurrencyUnion;
};

type CurrencyWantAction = {
  type: "currencyWant";
  payload: CurrencyUnion;
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
