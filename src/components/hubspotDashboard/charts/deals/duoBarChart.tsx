import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import MonthlyContracts from "../../../../interfaces/monthlyContracts";
import Period from "../../../../interfaces/period";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const StyledChart = styled.div`
  .custom-tooltip {
    background-color: white;
    border: solid 1px grey;
  }
  
  .sent-bar{
    color: #8884d8;
  }
  
  .won-bar{
    color: #82ca9d;
  }
  
`

interface Props {
    title: string,
    signedData: MonthlyContracts[] | null,
    sentData: MonthlyContracts[] | null
}

/**
 * Build a line chart containing 2 lines, that match specified data
 * @param title title of the graph
 * @param signedData the deals signed per month
 * @param sentData the contract sent per month
 * @constructor
 */
const DuoBarChart: React.FC<Props> = ({title, signedData, sentData}) => {

    /**
     * The amount in € per month
     */
    const [totalSignedValuePerMonth, setTotalSignedValuePerMonth] = useState<{period: Period, value: number}[]|null>(null);

    /**
     * The amount in € per month
     */
    const [totalSentValuePerMonth, setTotalSentValuePerMonth] = useState<{period: Period, value: number}[]|null>(null);

    /**
     * Variable merging both data sources to display them in the same chart
     */
    const [mergedData, setMergedData] = useState<{signedValue: number, period: Period, value: number}[]>([]);

    /**
     * Called whenever the sent data to display are updated
     * Calculates the total sent contrats amount per month
     */
    useEffect(()=>{
        if(sentData!==null) {
            const valuePerMonth: { period: Period, value: number }[] = []
            sentData!.forEach((month) => {
                let value = 0;
                month.contracts.forEach((contract) => {
                    value += contract.montant_devise;
                })
                valuePerMonth.push({period: month.period, value: value});
            });
            valuePerMonth.sort((a, b) => a.period!.dateFrom.getTime() - b.period!.dateFrom.getTime());
            setTotalSentValuePerMonth(valuePerMonth);
        }
    }, [sentData])

    /**
     * Called whenever the signed data to display are updated
     * Calculates the total signed contrats amount per month
     */
    useEffect(()=>{
        if(signedData!==null) {
            const valuePerMonth: { period: Period, value: number }[] = []
            signedData!.forEach((month) => {
                let value = 0;
                month.contracts.forEach((contract) => {
                    value += contract.amount;
                })
                valuePerMonth.push({period: month.period, value: value});
            });
            valuePerMonth.sort((a, b) => a.period!.dateFrom.getTime() - b.period!.dateFrom.getTime());
            setTotalSignedValuePerMonth(valuePerMonth);
        }
    }, [signedData])

    /**
     * Merge data if both of data sources are not null
     */
    useEffect(()=>{
        if(totalSignedValuePerMonth!==null && totalSentValuePerMonth!==null){
            const mergedData = totalSentValuePerMonth!.map((sentDataPoint) => {
                const signedDataPoint = totalSignedValuePerMonth!.find(
                    (signedData) => (signedData.period.dateTo.getMonth() === sentDataPoint.period.dateTo.getMonth() && signedData.period.dateTo.getFullYear() === sentDataPoint.period.dateTo.getFullYear())
                );
                return {
                    ...sentDataPoint,
                    signedValue: signedDataPoint ? signedDataPoint.value : 0,
                };
            });
            setMergedData(mergedData);
        }
    }, [totalSentValuePerMonth, totalSignedValuePerMonth]);



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

    const CustomTooltip = (tooltipProps: CustomTooltipProps) => {
        if (tooltipProps.active && tooltipProps.payload && tooltipProps.payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="intro">{`${formatXAxis(new Date(tooltipProps.label!))}` }</p>
                    <p className="label sent-bar">{`CA devisé : ${tooltipProps.payload[0].value} €`}</p>
                    <p className="label won-bar">{`CA signé : ${tooltipProps.payload[1].value} €`}</p>
                </div>
            );
        }

        return null;
    };


    return (
        <StyledChart>
            <div className={"bar-chart chart ca-bar-chart"}>
                    <h2>{title}</h2>
                    {totalSentValuePerMonth===null || totalSignedValuePerMonth===null?
                        <div className={"chart-error"}>
                            <h3>Erreur lors du chargement des données</h3>
                        </div>
                        :
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={mergedData}
                                margin={{
                                    top: 8,
                                    right: 25,
                                    left: 15,
                                    bottom: 8,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period.dateTo" tickFormatter={formatXAxis}/>
                                <YAxis dataKey={"value"}/>
                                <Tooltip content={<CustomTooltip/>}/>
                                <Legend align="right" verticalAlign="top"/>
                                <Bar dataKey="value" name="CA devisé" fill="#8884d8" strokeWidth={1} />
                                <Bar dataKey="signedValue" name="CA signé" fill="#82ca9d" strokeWidth={1} />
                            </BarChart>
                        </ResponsiveContainer>
                    }
            </div>
        </StyledChart>
    )

}

export default DuoBarChart;