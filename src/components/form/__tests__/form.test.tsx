import { screen, within, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { Form } from "../ui/form";
import { StateSchema } from "../model/types";

describe("Калькулятор", () => {
  const setup = (preState: Partial<StateSchema> = {}) => {
    const user = userEvent.setup();
    const initialState: StateSchema = {
      currencyAvailable: "USD",
      currencyWant: "EUR",
      availableCount: "0",
      wantCount: "0",
      currencies: {
        RUB: { code: "RUB", price_pay: 1, price_purchase: 1 },
        USD: { code: "USD", price_pay: 90, price_purchase: 95 },
        EUR: { code: "EUR", price_pay: 100, price_purchase: 110 },
      },
      ...preState,
    };
    render(<Form initialState={initialState} />);

    const calcForm = within(screen.getByRole("form"));
    const availableCountInput = calcForm.getByLabelText("У меня есть");
    const wantCountInput = calcForm.getByLabelText("Хочу купить");

    return {
      user,
      calcForm,
      availableCountInput,
      wantCountInput,
    };
  };

  describe("RUB -> currency", () => {
    it("есть 950 RUB, хочу ? (10.00) USD", async () => {
      const { user, calcForm, availableCountInput } = setup({
        currencyAvailable: "RUB",
        currencyWant: "USD",
      });

      await user.type(availableCountInput, "950");

      expect(calcForm.getByDisplayValue("10.00")).toBeInTheDocument();
    });

    it("есть ? (950.00) RUB, хочу 10 USD", async () => {
      const { user, calcForm, wantCountInput } = setup({
        currencyAvailable: "RUB",
        currencyWant: "USD",
      });

      await user.type(wantCountInput, "10");

      expect(calcForm.getByDisplayValue("950.00")).toBeInTheDocument();
    });
  });

  describe("currency -> RUB", () => {
    it("есть 10 USD, хочу ? (900.00) RUB", async () => {
      const { user, calcForm, availableCountInput } = setup({
        currencyAvailable: "USD",
        currencyWant: "RUB",
      });

      await user.type(availableCountInput, "10");

      expect(calcForm.getByDisplayValue("900.00")).toBeInTheDocument();
    });

    it("есть ? (10.00) USD, хочу 900 RUB", async () => {
      const { user, calcForm, wantCountInput } = setup({
        currencyAvailable: "USD",
        currencyWant: "RUB",
      });

      await user.type(wantCountInput, "900");

      expect(calcForm.getByDisplayValue("10.00")).toBeInTheDocument();
    });
  });

  describe("currency -> currency", () => {
    it("есть 10 EUR, хочу ? (10.53) USD", async () => {
      const { user, calcForm, availableCountInput } = setup({
        currencyAvailable: "EUR",
        currencyWant: "USD",
      });

      await user.type(availableCountInput, "10");

      expect(calcForm.getByDisplayValue("10.53")).toBeInTheDocument();
    });

    it("есть ? (8.18) EUR, хочу 10 USD", async () => {
      const { user, calcForm, wantCountInput } = setup({
        currencyAvailable: "EUR",
        currencyWant: "USD",
      });

      await user.type(wantCountInput, "10");

      expect(calcForm.getByDisplayValue("8.18")).toBeInTheDocument();
    });
  });
});
