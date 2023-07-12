import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import MonthlyContracts from "../../interfaces/monthlyContracts";
import Period from "../../interfaces/period";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const StyledContractsChart = styled.div`
  .custom-tooltip {
    background-color: rgba(136, 132, 216, 0.5);
    border-radius: 5px;
    padding: 1px 5px;
  }
`

interface Props {
    concernsExpectedAmount: boolean,
    title: string,
    content: string,
    data: MonthlyContracts[],
    objective: number|null
}

const ContractsBarChart: React.FC<Props> = ({concernsExpectedAmount, title, content, data, objective}) => {

    const [totalValuePerMonth, setTotalValuePerMonth] = useState<{period: Period, value: number}[]|null>(null);

    useEffect(()=>{
        const valuePerMonth : {period: Period, value: number}[] = []
        data.forEach((month)=>{
            let value = 0;
            month.contracts.forEach((contract)=>{
                value += concernsExpectedAmount ? contract.montant_devise : contract.amount;
            })
            valuePerMonth.push({period: month.period, value: value});
        });
        valuePerMonth.sort((a,b)=>a.period!.dateFrom.getTime() - b.period!.dateFrom.getTime());
        setTotalValuePerMonth(valuePerMonth);
    }, [data])

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
        <StyledContractsChart>
            <div className={"bar-chart chart ca-bar-chart"}>
                <h2>{title}</h2>
                {totalValuePerMonth===null ?
                    <div className={"chart-error"}>
                        <h3>Erreur lors du chargement des données</h3>
                    </div>
                    :
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={totalValuePerMonth!}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 20,
                                bottom: 10,
                            }}
                            barSize={20}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period.dateTo" tickFormatter={formatXAxis}/>
                            <YAxis dataKey="value"/>
                            <Tooltip content={<CustomTooltip />}/>
                            <Legend align="right" verticalAlign="top" formatter={() => {return content;}}/>
                            <Bar dataKey="value" fill="#8884d8" strokeWidth={1.5}  background={{ fill: '#eee' }} />
                            if(objective!=null){
                            <ReferenceLine y={objective!} stroke="red" strokeWidth={2} label="Objectif"/>
                            }

                        </BarChart>
                    </ResponsiveContainer>
                }
            </div>
        </StyledContractsChart>
    )

}

export default ContractsBarChart;