import { registerRootComponent } from "expo";
import { TailwindProvider } from "tailwind-rn";
import utilities from "../tailwind.json";

import Login from "./Login";

const App = () => {
  return (
    <TailwindProvider utilities={utilities}>
      <Login />
    </TailwindProvider>
  );
};

export default registerRootComponent(App);
