import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./home";
import Logscreen from "./logscreen";
import LogDetails from "./logdetails";
import AddCostForm from "./Apicost";
import CostReport from "./costreport";





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logscreen" element = {<Logscreen />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/logdetails" element={<LogDetails />} />

        <Route path="/costreport" element = {<CostReport /> }/>

 <Route path="/apiCost" element = {<AddCostForm />}/>
      </Routes>
    </Router>
  );
}

export default App;
