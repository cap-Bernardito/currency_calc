import React from "react";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button, TextField } from "@mui/material";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

import { Actions, CurrenciesUnion, StateSchema } from "../model/types";
import { currencyReducer } from "../model/reducer";
import { getValidNumber } from "../lib/get-valid-number";

import css from "./form.module.scss";

export const Form: React.FC<{ initialState: StateSchema }> = ({
  initialState,
}) => {
  const [state, dispatch] = React.useReducer<
    React.Reducer<StateSchema, Actions>,
    StateSchema
  >(currencyReducer, initialState, (initialState) => ({
    currencyAvailable: initialState.currencyAvailable,
    currencyWant: initialState.currencyWant,
    availableCount: initialState.availableCount,
    wantCount: initialState.wantCount,
    currencies: initialState.currencies,
  }));

  const handleChangeMoney = React.useCallback((event: SelectChangeEvent) => {
    // TODO: Доделать
    console.log(event.target.value as string);
  }, []);

  const handleSwitcherClick: React.MouseEventHandler = React.useCallback(
    (event) => {
      event.preventDefault();

      dispatch({ type: "switch" });
    },
    [],
  );

  const handleChangeAvailable = React.useCallback(
    (event: SelectChangeEvent) => {
      dispatch({
        type: "currencyAvailable",
        payload: event.target.value as CurrenciesUnion,
      });
    },
    [],
  );

  const handleChangeWant = React.useCallback((event: SelectChangeEvent) => {
    dispatch({
      type: "currencyWant",
      payload: event.target.value as CurrenciesUnion,
    });
  }, []);

  const handleChangeAvailableCount = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "availableCount",
        payload: getValidNumber(event.target.value, state.availableCount),
      });
    },
    [state.availableCount],
  );

  const handleChangeWantCount = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "wantCount",
        payload: getValidNumber(event.target.value, state.wantCount),
      });
    },
    [state.wantCount],
  );

  const currencyAvailableItems = React.useMemo(
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

  const currencyWantItems = React.useMemo(
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
            value={state.availableCount}
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
            value={state.wantCount}
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
