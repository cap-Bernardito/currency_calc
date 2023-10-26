import React, {
  MouseEventHandler,
  Reducer,
  useCallback,
  useMemo,
  useReducer,
} from "react";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button, TextField } from "@mui/material";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

import { Actions, CurrencyUnion, StateSchema } from "../../types/types";

import css from "./form.module.scss";

const numRegex = /^[1-9]{1}[0-9]{0,6}[.]?[0-9]{0,2}$/;

const getValidNumber = (value: string, prevValue: string) => {
  if (/^0\.00/.test(value)) {
    return value.replace(/^0\.00/, "");
  }

  // 0.xx, 0.x
  if (/^[0]{1}[.][0-9]{0,2}$/.test(value)) {
    return value;
  }

  if (value.length === 0) {
    return value;
  }

  if (value.length === 1) {
    return value;
  }

  if (numRegex.test(value)) {
    return value;
  }

  return prevValue;
};

const rubToСurrency = (
  data: StateSchema,
  multiplier: number,
  isInverse = false,
) => {
  // Рубли в валюту (RUB -> USD) считаем по цене price_purchase
  // const countRUB = 100;
  // const countUSD = countRUB / state.USD.price_purchase
  const { currencies, currencyWant } = data;
  const price = Number(currencies[currencyWant].price_purchase);

  return isInverse
    ? (multiplier * price).toFixed(2)
    : (multiplier / price).toFixed(2);
};

const currencyToRub = (
  data: StateSchema,
  multiplier: number,
  isInverse = false,
) => {
  // Валюта в рубли (USD -> RUB) считаем по цене price_pay
  // const countUSD = 10;
  // const countRUB = countUSD * state.USD.price_pay
  const { currencies, currencyAvailable } = data;
  const price = Number(currencies[currencyAvailable].price_pay);

  return isInverse
    ? (multiplier / price).toFixed(2)
    : (multiplier * price).toFixed(2);
};

const currencyToСurrency = (
  data: StateSchema,
  multiplier: number,
  isInverse = false,
) => {
  // Валюта в валюту - сначала валюту в рубли по цене price_pay, потом рубли в валюту по цене price_purchase
  // const countUSD = 10;
  // const countEUR = countUSD * state.USD.price_pay / state.EUR.price_purchase
  const { currencies, currencyAvailable, currencyWant } = data;

  if (!isInverse) {
    const price_pay = Number(currencies[currencyAvailable].price_pay);
    const price_purchase = Number(currencies[currencyWant].price_purchase);
    const priceRub = multiplier * price_pay;

    return (priceRub / price_purchase).toFixed(2);
  }

  const price_pay = Number(currencies[currencyWant].price_pay);
  const price_purchase = Number(currencies[currencyAvailable].price_purchase);
  const priceRub = multiplier * price_pay;

  return (priceRub / price_purchase).toFixed(2);
};

const getCalculator = (state: StateSchema) => {
  const fromIsRub = state.currencyAvailable === "RUB";
  const toIsRub = state.currencyWant === "RUB";

  if (fromIsRub) {
    console.log("Calc: rubToСurrency");

    return rubToСurrency;
  }

  if (toIsRub) {
    console.log("Calc: currencyToRub");
    return currencyToRub;
  }

  console.log("Calc: currencyToСurrency");
  return currencyToСurrency;
};

const reducer: Reducer<StateSchema, Actions> = (state, action) => {
  switch (action.type) {
    case `switch`: {
      const { availableCount, currencyAvailable, currencyWant, wantCount } =
        state;
      const newState = {
        ...state,
        availableCount: wantCount,
        wantCount: availableCount,
        currencyAvailable: currencyWant,
        currencyWant: currencyAvailable,
      };

      const calc = getCalculator(newState);

      newState.wantCount = calc(newState, Number(newState.availableCount));

      return newState;
    }

    case `currencyAvailable`: {
      const newState = {
        ...state,
        currencyAvailable: action.payload,
      };

      const calc = getCalculator(newState);

      newState.wantCount = calc(newState, Number(newState.availableCount));

      return newState;
    }
    case `currencyWant`: {
      const newState = {
        ...state,
        currencyWant: action.payload,
      };

      const calc = getCalculator(newState);

      newState.wantCount = calc(newState, Number(newState.availableCount));

      return newState;
    }
    case `availableCount`: {
      const newState = {
        ...state,
        availableCount: action.payload,
      };

      const calc = getCalculator(newState);

      newState.wantCount = calc(newState, Number(action.payload));

      return newState;
    }
    case `wantCount`: {
      const newState = {
        ...state,
        wantCount: action.payload,
      };

      const calc = getCalculator(newState);

      newState.availableCount = calc(newState, Number(action.payload), true);

      return newState;
    }
    default:
      return state;
  }
};

export const Form: React.FC<{ initialState: StateSchema }> = ({
  initialState,
}) => {
  const [state, dispatch] = useReducer<
    Reducer<StateSchema, Actions>,
    StateSchema
  >(reducer, initialState, (initialState) => ({
    currencyAvailable: initialState.currencyAvailable,
    currencyWant: initialState.currencyWant,
    availableCount: initialState.availableCount,
    wantCount: initialState.wantCount,
    currencies: initialState.currencies,
  }));

  const handleChangeMoney = useCallback((event: SelectChangeEvent) => {
    // TODO: Доделать
    console.log(event.target.value as string);
  }, []);

  const handleSwitcherClick: MouseEventHandler = useCallback((event) => {
    event.preventDefault();

    dispatch({ type: "switch" });
  }, []);

  const handleChangeAvailable = useCallback((event: SelectChangeEvent) => {
    dispatch({
      type: "currencyAvailable",
      payload: event.target.value as CurrencyUnion,
    });
  }, []);

  const handleChangeWant = useCallback((event: SelectChangeEvent) => {
    dispatch({
      type: "currencyWant",
      payload: event.target.value as CurrencyUnion,
    });
  }, []);

  const handleChangeAvailableCount = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "availableCount",
        payload: getValidNumber(event.target.value, state.availableCount),
      });
    },
    [state.availableCount],
  );

  const handleChangeWantCount = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "wantCount",
        payload: getValidNumber(event.target.value, state.wantCount),
      });
    },
    [state.wantCount],
  );

  const currencyAvailableItems = useMemo(
    () =>
      Object.keys(state.currencies)
        .filter((item) => item !== state.currencyWant)
        .map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        )),
    [state.currencies, state.currencyWant],
  );

  const currencyWantItems = useMemo(
    () =>
      Object.keys(state.currencies)
        .filter((item) => item !== state.currencyAvailable)
        .map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        )),
    [state.currencies, state.currencyAvailable],
  );

  return (
    <form className={css.root} aria-label="Конвертировать валюту">
      <div className={css["header"]}>
        <div className={css["header__title"]}>Калькулятор</div>
        <div className={css["header__moneytype"]}>
          <FormControl fullWidth>
            <Select
              id="money"
              value={"Наличные"}
              onChange={handleChangeMoney}
              data-testid="money"
            >
              <MenuItem value="Наличные">Наличные</MenuItem>
              <MenuItem value="Безналичные">Безналичные</MenuItem>
              <MenuItem value="Мобильный банк">Мобильный банк</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={css["row"]}>
        <div className={css["row__item"]}>
          <TextField
            id="available_count"
            label="У меня есть"
            variant="outlined"
            value={state.availableCount || "0.00"}
            onChange={handleChangeAvailableCount}
          />
        </div>
        <div className={css["row__item"]}>
          <FormControl fullWidth>
            <Select
              data-testid="available"
              id="available"
              value={state.currencyAvailable}
              onChange={handleChangeAvailable}
            >
              {currencyAvailableItems}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={css["switcher"]}>
        <Button className={css["switcher__btn"]} onClick={handleSwitcherClick}>
          {<SyncAltIcon />}
        </Button>
      </div>
      <div className={css["row"]}>
        <div className={css["row__item"]}>
          <TextField
            id="want_count"
            label="Хочу купить"
            variant="outlined"
            value={state.wantCount || "0.00"}
            onChange={handleChangeWantCount}
          />
        </div>
        <div className={css["row__item"]}>
          <FormControl fullWidth>
            <Select
              data-testid="want"
              id="want"
              value={state.currencyWant}
              onChange={handleChangeWant}
            >
              {currencyWantItems}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className={css["info"]}>
        Предварительный расчет. Курсы могут меняться в течение дня.
      </div>
    </form>
  );
};
