import styled from "styled-components";
import AppMenu from "../components/appMenu";
import logo from "../assets/images/stride_logo.png";
import React from "react";

const StyledPage = styled.div`
  
  overflow: hidden;
  
  .page-title{
    padding-right: 20px;
    margin-bottom: 0;
    color: #b8b7ad;
    background-color: #373a47;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    justify-content: flex-end;

    @media screen and (max-width: 450px){
      justify-content: flex-start;
      padding-right: 0;
      padding-left: 36px;
      padding-top: 45px;
    }

    @media screen and (max-width: 320px){
      padding-left: 0;
      justify-content: center;
    }

    >h1{
      padding-bottom: 7px;
      @media screen and (max-width: 400px){
        font-size: 1.5em;
      }
    }
  }
`

const ActivityDashboard = () => {

    const dashboardUrl = process.env.REACT_APP_ACTIVITY_DASHBOARD_URL;

    return (
        <StyledPage>
            <AppMenu></AppMenu>
            <div className={"page-title"}>
                <h1>Dashboard Activité</h1>
                <img src={logo} alt={"Logo Stride"} height={25}/>
            </div>
            <iframe
                style={{
                    marginTop: 0,
                    paddingTop: 0,
                    background: "#F1F5F4",
                    border: "none",
                    borderRadius: "2px",
                    boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
                    width: "100vw",
                    height: "92vh",
                    overflow: "visible"
                }}
                src={dashboardUrl}
            />
        </StyledPage>
    )
}

export default ActivityDashboard;