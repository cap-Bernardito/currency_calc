import "./App.css";
import { Form } from "./components/form";
import { convertedData } from "./data/data";
import { StateSchema } from "./components/form/model/types";

const initialState: StateSchema = {
  currencyAvailable: "USD",
  currencyWant: "EUR",
  availableCount: "0",
  wantCount: "0",
  currencies: convertedData,
};

function App() {
  return <Form initialState={initialState} />;
}

export default App;
