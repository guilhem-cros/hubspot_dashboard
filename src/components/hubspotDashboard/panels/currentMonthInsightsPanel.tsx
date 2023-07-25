import React from 'react';
import styled from 'styled-components';
import LifecycleStage, {createLifecycleStage} from "../../../interfaces/lifecycleStage";
import NumberChart from "../charts/numberChart";
import {RiNumbersLine} from "react-icons/ri";
import {PiTarget} from "react-icons/pi";
import {MdAttachMoney} from "react-icons/md";
import {contractsStagesValues, lifecycleStagesCodesAndValues} from "../../../constants/hubspotAPIValues";
import LifecycleCount, {getStageCurrentTotalAndToConvertCount} from "../../../interfaces/lifecycleCount";
import DealsTable from "../charts/deals/dealsTable";
import Objectives from "../../../interfaces/objectives";

const StyledPanel = styled.div`

  .last-month-stage-insight-charts{
    margin-top: 1%;
    width: 98%;
    margin-left: 1%;
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;

    @media screen and (max-width: 1250px){
      grid-template-columns: 33% 33% 33%;
      justify-content: space-around;
    }

    @media screen and (max-width: 800px){
      grid-template-columns: 100%;
    }
  }

  .last-month-contract-insight-charts{
    margin-top: 1%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: 1000px){
      flex-direction: column;
    }
  }

  .contracts-growth-charts{
    display: flex;
    flex-direction: column;
    width: 48%;

    @media screen and (max-width: 1000px){
      flex-direction: row;
      width: 100%;
      align-items: center;
      >*{
        width: 100%;
        height: 200px;
      }
    }
    @media screen and (max-width: 600px){
      flex-direction: column;
      width: 98%;
      margin-bottom: 5%;
      >*{
        height: 150px;
        width: 100%;
      }
    }
  }

  .growth-charts{
    display: flex;
    flex-direction: column;
    margin-bottom: 5%;

    @media screen and (max-width: 800px){
      flex-direction: row;
      margin-bottom: 0;
      align-items: center;
      >*{
        width: 100%;
      }
    }
  }

  .progression{
    width: 80%;
    margin-left: 10%;
    @media screen and (max-width: 1000px){
      margin-left: 0;
      width: 100%;
    }
  }

  .current-month-deals-insight{
    margin-top: 1.5%;
    margin-left: 1.4%;
    width: 98%;
    display: flex;
    flex-direction: row;
    align-items: center;

    @media screen and (max-width: 1400px){
      flex-direction: column;
      >*{
        width: 100%;
      }
    }
  }
  
`

interface Props {
    lifecycleStagesPerMonth: LifecycleCount[][]|null,
    currentMonthContractsAmount: {closedWonAmount: number, contractSentAmount: number}|null,
    currentLifecycleStagesCount: LifecycleCount[]|null,
    notifyError: (error: string) => void,
    objectives: Objectives

}

/**
 * Builds insights panel concerning current month
 * @param lifecycleStagesPerMonth the pure list got from the API request containing the count of contact per stage for each month
 * @param currentMonthContractsAmount Amount (€) of contract won and sent during current month
 * @param currentLifecycleStagesCount Variable containing lifecycle stages current counts for contacts
 * @param notifyError callback function used in case of error
 @param objectives the object containing every objective for each studied stat
 * @constructor
 */
const CurrentMonthInsightsPanel: React.FC<Props> = ({lifecycleStagesPerMonth, currentMonthContractsAmount, currentLifecycleStagesCount, notifyError, objectives}) => {

    const now = new Date();
    const firstDayOfTheMonth = new Date(now.getFullYear(), now.getMonth(), 1);


    /**
     * Formats the lifecycleStagesPerMonth data by returning, ordered by date,
     * each LifecycleCount concerning a specified lifecycle stage
     * @param lifecycleStageCode the lifecycle stage for which data are formatted and returned
     */
    const getMonthlyLifecycleStages = (lifecycleStageCode: string) : LifecycleCount[] => {
        if(lifecycleStagesPerMonth!==null){
            const monthlyCountForLifeCycle : LifecycleCount[] = [];
            lifecycleStagesPerMonth.forEach((month)=>{
                month.forEach((lifecyleCount)=>{
                    if(lifecyleCount.lifecycleStage.localeCompare(lifecycleStageCode)===0){
                        monthlyCountForLifeCycle.push(lifecyleCount);
                    }
                })
            })
            monthlyCountForLifeCycle.sort((a,b)=>a.period!.dateFrom.getTime() - b.period!.dateFrom.getTime());
            return monthlyCountForLifeCycle;
        }
        return [];
    }


    const drawLine = () => {
        return (
            <div className={"line"}></div>
        )
    }

    /**
     * Build every chart concerning a lifecycle stage of contact in the current month
     * @param lifecycleStage the lifecycle stage for which charts are built
     */
    const buildGrowthCharts = (lifecycleStage: LifecycleStage) => {
        const monthlyCount = getMonthlyLifecycleStages(lifecycleStage.code);
        return (
            <div className={"growth-charts"}>
                <NumberChart
                    title={lifecycleStage.title.localeCompare("Contacts") ? "Nouveaux contacts" : lifecycleStage.title}
                    subTitle={""}
                    displayedValue={monthlyCount[monthlyCount.length-1].count + (lifecycleStage.objective === null ? "" : " / " + lifecycleStage.objective)}
                    isLoading={false}
                    icon={<RiNumbersLine  color={"white"} size={"1.8em"}/>}
                    color={"#11B981"}
                    conditionalColoring={false}
                />
                <div className={"progression"}>
                    <NumberChart
                        displayedValue={lifecycleStage.objective === null ? "/" :(monthlyCount[monthlyCount.length-1].count/lifecycleStage.objective!*100).toFixed(0) + " %"}
                        title={"% objectif " + lifecycleStage.title.toLowerCase()}
                        subTitle={""}
                        isLoading={false}
                        icon={<PiTarget color={"white"} size={"1.8em"}/>}
                        color={"#E85411"}
                        conditionalColoring={true}
                    />
                </div>
            </div>
        )
    }

    /**
     * Build every chart concerning contract stage in the current month
     * @param title title first of the chart
     * @param objective the targeted objective per month
     * @param amount the displayed value on the chart
     */
    const buildContractsAmountGrowthCharts = (title: string, objective: number|null, amount: number |undefined) => {
        return (
            <div className={"contracts-growth-charts"}>
                <NumberChart
                    title={title}
                    subTitle={"Sur le mois courant"}
                    displayedValue={amount + " € / " + objective + " €"}
                    isLoading={currentMonthContractsAmount===null}
                    icon={<MdAttachMoney color={"white"} size={"1.8em"}/>}
                    color={"#3399FE"}
                    conditionalColoring={false}
                />
                <div className={"progression"}>
                    <NumberChart
                        title={"% objectif " + (title.localeCompare("Montant devisé")===0 ? "devis" : "ventes")}
                        subTitle={""}
                        displayedValue={objective === null ? "/" : amount!==undefined ? ((amount! / objective*100).toFixed(0) + " %") : ""}
                        isLoading={currentMonthContractsAmount===null}
                        icon={<PiTarget color={"white"} size={"1.8em"}/>}
                        color={"#E85411"}
                        conditionalColoring={true}
                    />
                </div>
            </div>
        )
    }

    return (
        <StyledPanel>
            <div className={"last-month-insight"}>
                <h2 className={"panel-title"}>Aperçu sur le mois courant</h2>
                <div className={"last-month-insight-charts"}>
                    <div className={"last-month-stage-insight-charts"}>
                        {Array.from(lifecycleStagesCodesAndValues.entries()).map(([key, value]) => {
                            const currentCounts= getStageCurrentTotalAndToConvertCount(currentLifecycleStagesCount!, value)
                            const lifecycleStage: LifecycleStage = createLifecycleStage(key, value, currentCounts.currentTotal, currentCounts.toConvert, objectives);
                            return(
                                <div className={"stage-growth"} key={key}>
                                    {buildGrowthCharts(lifecycleStage)}
                                </div>
                            )
                        })}
                    </div>
                    <div className={"last-month-contract-insight-charts"}>
                        {buildContractsAmountGrowthCharts("Montant devisé", objectives.MONTHLY_EXPECTED_CA, currentMonthContractsAmount?.contractSentAmount)}
                        {buildContractsAmountGrowthCharts("Montant signé", objectives.MONTHLY_SIGNED_CA, currentMonthContractsAmount?.closedWonAmount)}
                    </div>
                    <div className={"current-month-deals-insight"}>
                        <DealsTable handleError={notifyError} dealStage={null} title={"Devis envoyés sur le mois courant"} period={{dateTo: now, dateFrom: firstDayOfTheMonth}}/>
                        <DealsTable handleError={notifyError} dealStage={contractsStagesValues.get("won")!} title={"Devis signés sur le mois courant"} period={{dateTo: now, dateFrom: firstDayOfTheMonth}}/>
                    </div>
                </div>
                {drawLine()}
            </div>
        </StyledPanel>
    )
}

export default CurrentMonthInsightsPanel