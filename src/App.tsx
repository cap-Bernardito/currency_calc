import "./App.css";
import { Form } from "./components/form";
import { convertedData } from "./data/data";
import { StateSchema } from "./types/types";

const initialState: StateSchema = {
  currencyAvailable: "USD",
  currencyWant: "EUR",
  availableCount: "0.00",
  wantCount: "0.00",
  currencies: convertedData,
};

function App() {
  return <Form initialState={initialState} />;
}

export default App;
