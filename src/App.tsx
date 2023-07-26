import React from "react";
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import SignIn from "./pages/SignIn";
import HubspotDashboard from "./pages/HubspotDashboard";
import Error404 from "./pages/Error404";
import {useAuth} from "./auth/AuthContext";
import Objectives from "./pages/Objectives";

function App() {
    const { isAuthenticated } = useAuth();

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path={"/signin"} element={<SignIn/>}/>
                <Route
                    path={"/"}
                    element={isAuthenticated ? <HubspotDashboard/> : <Navigate to="/signin" />}
                />
                <Route
                    path={"/home"}
                    element={isAuthenticated ? <HubspotDashboard/> : <Navigate to="/signin" />}
                />
                <Route
                    path={"/dashboard/hubspot"}
                    element={isAuthenticated ? <HubspotDashboard/> : <Navigate to="/signin" />}
                />
                <Route
                    path={"/objectives"}
                    element={isAuthenticated ? <Objectives/> : <Navigate to="/signin" />}
                />
                <Route path={"*"} element={<Error404/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
