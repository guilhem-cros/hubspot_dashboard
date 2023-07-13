import React from "react";
import logo from './logo.svg';
import './App.css';
import HUbSpotDashboard from "./components/hubspotDashboard";
import AppMenu from "./components/appMenu";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {

    const notifyError = (error: string) => {
        toast.error(error);
    }

  return (
    <div className="App">
        <AppMenu></AppMenu>
        <HUbSpotDashboard notifyError={notifyError}></HUbSpotDashboard>
        <ToastContainer
            position="bottom-right"
            autoClose={7000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
    </div>
  );
}

export default App;
