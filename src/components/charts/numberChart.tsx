import React, {ReactNode} from 'react';
import styled from 'styled-components';
import {Spin} from "react-cssfx-loading";

interface StyledNumberChartProps {
    numberValue: number;
    color: string;
    coloring: boolean;
}

const StyledNumberChart = styled.div<StyledNumberChartProps>`
    
  display: grid;
  align-content: center;
  grid-template-rows: 1fr 1fr 1fr;
  height: 160px;
  justify-items: center;
  position: relative;
  
  .number-chart-title{
    font-weight: bold;
    font-size: 1em;
    margin: 0;
  }
  
  .number-chart-value {
    font-weight: bold;
    font-size: 3em;
    margin: 0;
    color: ${props => {
      if (!props.coloring || Number.isNaN(props.numberValue)) {
        return "black";
      } else {
        if (props.numberValue >= 100) {
          return "green"
        }
        return props.numberValue < 50 ? "red" : "orange";
      }
    }}
  }
  
  .chart-sub-title{
    margin: 0;
    font-size: 0.85em;
    font-weight: lighter;
    color: grey;
  }
  
  .number-loading{
    margin-top: 5%;
  }
  
  .chart-icon > *{
    padding: 6px;
    background-color: ${props => props.color};
    border-radius: 30px;
  }
  
  .chart-icon{
    position: absolute;
    bottom: 5px;
    right: 7px;
  }
  
`

interface Props {
    title: string,
    subTitle: string,
    displayedValue: string,
    isLoading : boolean,
    icon: ReactNode,
    color: string,
    conditionalColoring : boolean
}

/**
 * React component : display a tile containing a value and its title
 * @param displayedValue the value displayed
 * @param title the title of the tile
 * @param subTitle subtitle of the tile
 * @param isLoading true is must display a loading spin and hide the value, false if not
 * @param icon the icon associated to the tile (displayed on bottom right)
 * @param color the background color of the icon
 * @param conditionalColoring true if value is a percent and must switch color in function of the value
 * @constructor
 */
const NumberChart: React.FC<Props> = ({displayedValue, title, subTitle, isLoading, icon, color, conditionalColoring})=>{

    /**
     * Convert value to number
     */
    const getNumber = (): number => {
        return parseInt(displayedValue);
    }

    return (
        <StyledNumberChart className={"chart"} numberValue={getNumber()} color={color} coloring={conditionalColoring}>
            <div>
                <h2 className={"number-chart-title"}>{title}</h2>
                <h4 className={"chart-sub-title"}>{subTitle}</h4>
            </div>
            { isLoading ?
                <Spin
                    width={30}
                    height={30}
                    className={"number-loading"}
                />
                :
                <h3 className={"number-chart-value"}>{displayedValue}</h3>
            }
            <div className={"chart-icon"}>{icon}</div>
        </StyledNumberChart>
    );
}

export default NumberChart;

