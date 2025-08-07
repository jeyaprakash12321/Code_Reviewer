import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { HeaderLogo } from "./components/HeaderLogo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <HeaderLogo />
      <HomePage />
    </>
  );
}

export default App;
