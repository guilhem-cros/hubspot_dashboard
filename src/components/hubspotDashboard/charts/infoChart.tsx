import React from 'react';
import styled from 'styled-components';
import {TbListDetails} from "react-icons/tb";

const StyledList = styled.div`
    
    height: 300px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

  .chart-icon{
    position: absolute;
    bottom: 5px;
    right: 7px;
  }

  .chart-icon > *{
    padding: 6px;
    background-color: #4F7BB7;
    border-radius: 30px;
  }
`

interface Props {
    content: string,
    objective: number|null,
    currentTotal: number,
    toConvert: number
}

/**
 * React component : details tile displaying several information
 * @param content title of the tile
 * @param objective number by month aimed concerning the object described by the tile
 * @param currentTotal total number of object
 * @param toConvert number of object to convert into next stage
 * @constructor
 */
const InfoChart :React.FC<Props> = ({content, objective, currentTotal, toConvert})=>{

    const concreteObjective = objective == null ? "aucun" : objective + " par mois";
    const transformationRate = ((currentTotal-toConvert)/currentTotal)*100;

    return (
        <StyledList className={"chart"}>
            <h3 className={"info-label"}>Objectif : {concreteObjective}</h3>
            <h3 className={"info-label"}>Total à date : {currentTotal}</h3>
            { toConvert!==0 &&
                <>
                    <h3 className={"info-label"}>A convertir à date : {toConvert}</h3>
                    <h3 className={"info-label"}>Taux de transformation moyen: {transformationRate.toFixed(0)} %</h3>
                </>
            }
            <div className={"chart-icon"}><TbListDetails color={"white"} size={"1.8em"}/></div>
        </StyledList>
    )
}

export default InfoChart;