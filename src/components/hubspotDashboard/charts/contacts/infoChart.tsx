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
    value: string,
    objective: number|null,
    currentTotal: number,
    toConvert: number
}

/**
 * React component : details tile displaying several information
 * @param value the name value of the studied lifecycle stage
 * @param objective number by month aimed concerning the object described by the tile
 * @param currentTotal total number of object
 * @param toConvert number of object to convert into next stage
 * @constructor
 */
const InfoChart :React.FC<Props> = ({value, objective, currentTotal, toConvert})=>{

    const getToConvertLabel = () : [string, string] => {
        if(value.localeCompare("lead")===0){
            return ["A qualifier", "Taux de qualification"]
        } else if(value.localeCompare("opportunity")===0){
            return ["A deviser", "Taux de devis"]
        } else if(value.localeCompare("other")===0) {
            return ["A transformer", "Taux de transformation"]
        } else {
            return ["A convertir", "Taux de conversion"]
        }
    }


    const concreteObjective = objective == null ? "aucun" : objective + " par mois";
    const transformationRate = ((currentTotal-toConvert)/currentTotal)*100;

    return (
        <StyledList className={"chart"}>
            <h3 className={"info-label"}>Objectif : {concreteObjective}</h3>
            <h3 className={"info-label"}>Total à date : {currentTotal}</h3>
            { toConvert!==0 &&
                <>
                    <h3 className={"info-label"}>{getToConvertLabel()[0]} : {toConvert}</h3>
                    <h3 className={"info-label"}>{getToConvertLabel()[1]} : {transformationRate.toFixed(0)} %</h3>
                </>
            }
            <div className={"chart-icon"}><TbListDetails color={"white"} size={"1.8em"}/></div>
        </StyledList>
    )
}

export default InfoChart;