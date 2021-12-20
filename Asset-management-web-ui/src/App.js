import Header from "./shared/Header/Header";
import "./App.css";
import Menu from "./shared/Menu/Menu";
import { BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("TOKEN"));
  return (
    <Router>
      <Header token={token} setToken={setToken} />
      <Menu token={token} setToken={setToken} />
    </Router>
  );
}

export default App;
