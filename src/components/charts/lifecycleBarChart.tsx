import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine, BarChart, Bar
} from 'recharts';


import styled from 'styled-components';
import LifecycleCount from "../../interfaces/lifecycleCount";


const StyledChart = styled.div`

  .bar-chart {
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .custom-tooltip {
    background-color: rgba(130, 202, 157, 0.5);
    border-radius: 5px;
    padding: 1px 5px;
  }

`

interface Props {
    title: string,
    content: string,
    data: LifecycleCount[],
    objective: number|null
}

/**
 * React component : tile containing a bar chart with one
 * reference line (straight line) representing an objective
 * @param title the title of the graph / tile
 * @param content the content displayed in the graph, will be displayed as legend of the chart
 * @param data the data used to build the chart
 * @param objective the objective aimed, number used to draw the reference line on the chart
 * @constructor
 */
const LifecycleBarChart :React.FC<Props> = ({title, content, data, objective})=> {

    /**
     * Formats how the values are displayed on the X Axis -> "Month YEAR"
     * @param tickItem
     */
    const formatXAxis = (tickItem: Date) => {
        const month = new Date(tickItem).toLocaleString('default', { month: 'short' });
        const year = new Date(tickItem).getFullYear();
        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    };


    interface CustomTooltipProps {
        active?: boolean;
        payload?: any[];
        label?: string | number;
    }

    /**
     * Build the tooltip displayed when hover a value on the graph
     * @param tooltipProps
     * @constructor
     */
    const CustomTooltip = (tooltipProps : CustomTooltipProps) => {
        if (tooltipProps.active && tooltipProps.payload && tooltipProps.payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="intro">{`${formatXAxis(new Date(tooltipProps.label!))}` }</p>
                    <p className="label">{`${content} : ${tooltipProps.payload[0].value}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <StyledChart>
            <div className={"bar-chart chart"}>
                <h2>{"Nombre de nouveaux " + title.toLowerCase() + " par mois"}</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 20,
                            bottom: 10,
                        }}
                        barSize={30}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period.dateTo" tickFormatter={formatXAxis}/>
                        <YAxis/>
                        <Tooltip content={<CustomTooltip />}/>
                        <Legend align="right" verticalAlign="top" formatter={() => {return content;}}/>
                        <Bar dataKey="count" fill="#82CA9D" />
                        if(objective!=null){
                            <ReferenceLine y={objective!} stroke="red" strokeWidth={2} label="Objectif"/>
                        }

                    </BarChart>
                </ResponsiveContainer>
            </div>
        </StyledChart>
    );
}

export default LifecycleBarChart;