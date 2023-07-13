import React from "react";
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignIn from "./pages/SignIn";
import HubspotDashboard from "./pages/HubspotDashboard";
import Error404 from "./pages/Error404";

function App() {

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path={"/signin"} element={<SignIn/>}/>
                <Route path={"/"} element={<HubspotDashboard/>}/>
                <Route path={"/home"} element={<HubspotDashboard/>}/>
                <Route path={"/dashboard/hubspot"} element={<HubspotDashboard/>}/>
                <Route path={"*"} element={<Error404/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
