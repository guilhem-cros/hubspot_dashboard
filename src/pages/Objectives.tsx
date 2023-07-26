import React from "react";
import AppMenu from "../components/appMenu";
import logo from "../assets/images/stride_logo.png";
import styled from "styled-components";
import ObjectivesForm from "../components/objectives/objectivesForm";

const StyledPage = styled.div`
    .page-title{
        padding-right: 20px;
        margin-bottom: 1.5%;
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

const Objectives = () => {
    return (
        <StyledPage>
            <AppMenu></AppMenu>
            <div className={"page-title"}>
                <h1>Gestion des objectifs mensuel</h1>
                <img src={logo} alt={"Logo Stride"} height={25}/>
            </div>
            <ObjectivesForm/>
        </StyledPage>
    );
}

export default Objectives