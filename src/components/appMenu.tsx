import React from 'react';
import styled from 'styled-components';
import namedLogo from '../assets/images/stride_logo_name.png';

// @ts-ignore
import { slide as Menu } from 'react-burger-menu'


const StyledMenu = styled.div`
  
  /* Position and sizing of burger button */
  .bm-burger-button {
    position: absolute;
    width: 36px;
    height: 30px;
    left: 36px;
    top: 9px;
  }

  /* Color/shape of burger icon bars */
  .bm-burger-bars {
    background: #b8b7ad;
  }

  /* Color/shape of burger icon bars on hover*/
  .bm-burger-bars-hover {
    background: #a90000;
  }

  /* Position and sizing of clickable cross button */
  .bm-cross-button {
    height: 24px;
    width: 24px;
  }

  /* Color/shape of close button cross */
  .bm-cross {
    background: #bdc3c7;
  }

  /*
  Sidebar wrapper styles
  Note: Beware of modifying this element as it can break the animations - you should not need to touch it in most cases
  */
  .bm-menu-wrap {
    position: fixed;
    height: 100%;
  }

  /* General sidebar styles */
  .bm-menu{
    background: #373a47;
    padding: 2.5em 1.5em 0;
    font-size: 1.15em;
  }

  /* Morph shape necessary with bubble or elastic */
  .bm-morph-shape {
    fill: #373a47;
  }

  /* Wrapper for item list */
  .bm-item-list, a{
    color: #b8b7ad;
    padding: 0.8em;
    font-family: 'Raleway', Arial, sans-serif;
    /*margin-left: 10px;*/
    font-weight: 700;
    overflow: hidden;
    :hover{
      color: #a90000;
    }
  }

  /* Individual item */
  .bm-item {
    display: inline-block;
    margin-top: 7%;
    margin-bottom: 7%;
  }

  /* Styling of overlay */
  .bm-overlay {
    background: rgba(0, 0, 0, 0.3);
  }
  
  #menu-title-logo {
    margin-bottom: 15%;
  }
`

interface Props {

}

const AppMenu: React.FC<Props> = () => {

    return (
        <StyledMenu>
            <Menu>
                <div id={"menu-title-logo"}>
                    <img id={"named-logo"} src={namedLogo} width={"100%"} alt="Logo Stride"/>
                </div>
                <a id="hubspot-dashboard" href="/">Dashboard Hubspot</a>
                <a id="activity-dashboard" href="/activity">Dashboard activité</a>
            </Menu>
        </StyledMenu>
    )
}

export default AppMenu