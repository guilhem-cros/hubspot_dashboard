import React, {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import MonthlyContracts from "../../../../interfaces/monthlyContracts";
import Period from "../../../../interfaces/period";
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

/**
 * React Component : display a bar chart concerning deals
 * @param concernsExpectedAmount true if the chart displayed concerns amounts of signed deal
 * @param title the title of the chart
 * @param content legend of the chart
 * @param data the data used to build the chart (contracts per month)
 * @param objective the targeted amount per month (displayed as a red line on the graph)
 * @constructor
 */
const ContractsBarChart: React.FC<Props> = ({concernsExpectedAmount, title, content, data, objective}) => {

    /**
     * The amount in € per month
     */
    const [totalValuePerMonth, setTotalValuePerMonth] = useState<{period: Period, value: number}[]|null>(null);

    /**
     * Called whenever the data to displayed are updated
     * Calculates the total contrats amount per month
     */
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

    // Calculate the maximum value between the data points and the objective
    const maxValue = useMemo(() => {
        if (!totalValuePerMonth) return 0;

        const dataValues = totalValuePerMonth.map((item) => item.value);
        return Math.max(...dataValues, objective || 0);
    }, [totalValuePerMonth, objective]);

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
                                top: 8,
                                right: 25,
                                left: 15,
                                bottom: 8,
                            }}
                            barSize={20}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period.dateTo" tickFormatter={formatXAxis}/>
                            <YAxis dataKey="value" domain={[0, maxValue]} />
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