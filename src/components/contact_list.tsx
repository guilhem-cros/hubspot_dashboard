import React, { useState, useEffect } from 'react';
import axios from "axios";
import styled from 'styled-components';
import Contact from "../interfaces/contact";
import getLifecycleStages from "../config/hubspotConfig";

const StyledList = styled.div`
`

interface Props{

}

const ContactList :React.FC<Props> = ()=>{

    const [contacts, setContacts] = useState<Contact[]|null>(null);
    const [isMount, setIsMount]= useState(false);

    useEffect(()=> {
        getLifecycleStages()
        .then((lifecycleStages)=>{
            console.log(lifecycleStages)
            setIsMount(true);
        })
        .catch((error)=>{
            console.error(error);
            setIsMount(true);
        })
    }, []);

    return (
        <>
            {isMount ?
                <h2>Mounted</h2>
                :
                <h2>Load</h2>
            }
        </>
    );

}

export default ContactList;