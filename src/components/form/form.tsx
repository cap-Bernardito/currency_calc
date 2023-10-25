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

  if (numRegex.test(value)) {
    return value;
  }

  return prevValue;
};

const initialState: StateSchema = {
  currencyAvailable: "USD",
  currencyWant: "EUR",
  availableCount: "0.00",
  wantCount: "0.00",
  currencies: {
    RUB: {
      USD: {
        code: "USD",
        rate: 0.010694553171457,
      },
      EUR: {
        code: "EUR",
        rate: 0.010053096561203,
      },
    },
    USD: {
      EUR: {
        code: "EUR",
        rate: 0.94002025143366,
      },
      RUB: {
        code: "RUB",
        rate: 93.505542865405,
      },
    },
    EUR: {
      USD: {
        code: "USD",
        rate: 1.0638068684955,
      },
      RUB: {
        code: "RUB",
        rate: 99.471838742619,
      },
    },
  },
};

const calc = (data: StateSchema, multiplier: number) => {
  const {
    currencies,
    currencyAvailable: currencyAvailable,
    currencyWant: currencyWant,
  } = data;
  const rate = Number(currencies[currencyAvailable][currencyWant]!.rate);

  return (rate * multiplier).toFixed(2);
};

const calcInverse = (data: StateSchema, multiplier: number) => {
  const {
    currencies,
    currencyAvailable: currencyAvailable,
    currencyWant: currencyWant,
  } = data;
  const rate = Number(currencies[currencyAvailable][currencyWant]!.rate);

  return (multiplier / rate).toFixed(2);
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

      return newState;
    }

    case `currencyAvailable`: {
      const newState = {
        ...state,
        currencyAvailable: action.payload,
      };

      newState.wantCount = calc(newState, Number(newState.availableCount));

      return newState;
    }
    case `currencyWant`: {
      const newState = {
        ...state,
        currencyWant: action.payload,
      };

      newState.wantCount = calc(newState, Number(newState.availableCount));

      return newState;
    }
    case `availableCount`: {
      const newState = {
        ...state,
        availableCount: action.payload,
      };

      newState.wantCount = calc(newState, Number(action.payload));

      return newState;
    }
    case `wantCount`: {
      const newState = {
        ...state,
        wantCount: action.payload,
      };

      newState.availableCount = calcInverse(newState, Number(action.payload));

      return newState;
    }
    default:
      return state;
  }
};

export const Form = () => {
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
    <form className={css.root}>
      <div className={css["header"]}>
        <div className={css["header__title"]}>Калькулятор</div>
        <div className={css["header__moneytype"]}>
          <FormControl fullWidth>
            <Select id="money" value={"Наличные"} onChange={handleChangeMoney}>
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
