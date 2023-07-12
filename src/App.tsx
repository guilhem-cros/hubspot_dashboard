import React from "react";
import logo from './logo.svg';
import './App.css';
import HUbSpotDashboard from "./components/hubspotDashboard";
import AppMenu from "./components/appMenu";

function App() {
  return (
    <div className="App">
            <AppMenu></AppMenu>
            <HUbSpotDashboard></HUbSpotDashboard>
    </div>
  );
}

export default App;
