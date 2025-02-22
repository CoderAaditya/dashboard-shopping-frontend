import * as React from "react";
import { Provider } from "react-redux";
import Challenge from "./components/Challenge";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Challenge />
    </Provider>
  );
}

export default App;
