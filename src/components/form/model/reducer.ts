import { Reducer } from "react";
import { getCalculator } from "../lib/calculator";
import { StateSchema } from "components/form/model/types";
import { Actions } from "./types";

export const currencyReducer: Reducer<StateSchema, Actions> = (
  state,
  action,
) => {
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
