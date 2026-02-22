// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import Planner from "./Planner";
import Register from "./Register";
import Transactions from "./Transactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
