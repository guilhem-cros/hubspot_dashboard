import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import MonthlyContracts from "../../../../interfaces/monthlyContracts";
import Period from "../../../../interfaces/period";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const StyledChart = styled.div`

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
const DuoLineChart: React.FC<Props> = ({title, signedData, sentData}) => {

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
                    <p className="intro">{`${formatXAxis(new Date(tooltipProps.label!))}`}</p>
                    {tooltipProps.payload.map((entry) => (
                        <p key={entry.name} className="label">
                            {`${entry.name}: ${entry.value}`}
                        </p>
                    ))}
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
                            <LineChart
                                data={mergedData}
                                margin={{
                                    top: 8,
                                    right: 25,
                                    left: 15,
                                    bottom: 8,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period.dateTo" type="category" tickFormatter={formatXAxis} allowDuplicatedCategory={false}/>
                                <YAxis dataKey={"value"}/>
                                <Tooltip content={<CustomTooltip />}/>
                                <Legend align="right" verticalAlign="top"/>
                                <Line type="monotone" dataKey="value" name="CA devisé" stroke="#8884d8" strokeWidth={2} />
                                <Line type="monotone" dataKey="signedValue" name="CA signé" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    }
            </div>
        </StyledChart>
    )

}

export default DuoLineChart;