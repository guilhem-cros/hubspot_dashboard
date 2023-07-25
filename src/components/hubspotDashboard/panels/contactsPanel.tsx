import React from 'react';
import styled from 'styled-components';
import LifecycleBarChart from "../charts/contacts/lifecycleBarChart";
import {lifecycleStagesCodesAndValues} from "../../../constants/hubspotAPIValues";
import LifecycleCount, {getStageCurrentTotalAndToConvertCount} from "../../../interfaces/lifecycleCount";
import LifecycleStage, {createLifecycleStage} from "../../../interfaces/lifecycleStage";
import InfoChart from "../charts/contacts/infoChart";
import Objectives from "../../../interfaces/objectives";

const StyledPanel = styled.div`

  .lifecycle-stage-details {
    margin: 0 1% 1%;
    display: grid;
    grid-template-columns: 3fr 1fr;
    align-items: center;

    @media screen and (max-width: 1250px){
      grid-template-columns: 1fr;
    }
  }

  .side-chart {
    display: flex;
    flex-direction: column;
    gap: 22px;

    @media screen and (max-width: 1250px){
      justify-content: center;
      flex-direction: row;
      align-items: center;
    }

    @media screen and (max-width: 900px){
      justify-content: space-between;
      gap: 0;
    }

    @media screen and (max-width: 600px){
      flex-direction: column;
      justify-content: center;
    }

    >*{
      @media screen and (max-width: 1250px){
        width: 40%;
        height: 200px;
      }

      @media screen and (max-width: 900px){
        width: 45%;
      }

      @media screen and (max-width: 600px){
        width: 95%;
      }

    }
  }

`

interface Props {
    lifecycleStagesPerMonth: LifecycleCount[][]|null,
    currentLifecycleStagesCount: LifecycleCount[]|null,
    last31DaysStagesCount: LifecycleCount[]|null,
    objectives: Objectives
}

/**
 * Build the panel containing every chart concerning contacts,lifecycle stages info
 * @param lifecycleStagesPerMonth the pure list got from the API request containing the count of contact per stage for each month
 * @param currentLifecycleStagesCount the list of the current count of contact per stage
 * @param last31DaysStagesCount the list of the count of contact per stage starting 31 days ago
 @param objectives the object containing every objective for each studied stat
 * @constructor
 */
const ContactPanel: React.FC<Props> = ({lifecycleStagesPerMonth, currentLifecycleStagesCount, last31DaysStagesCount, objectives} ) => {
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
     * Builds a LifecycleBarChart component
     * @param lifecycleStage the lifecycle stage to represent in the chart
     * @param title the title of the chart
     * @param objective the objectif per month aimed
     * @param content the content of the chart (legend)
     */
    const buildBarDiagram = (lifecycleStage: string, title: string, objective: number|null, content: string) => {
        return (
            <LifecycleBarChart
                title={title}
                content={content}
                data={getMonthlyLifecycleStages(lifecycleStage)}
                objective={objective}
            />
        )
    }

    return (
        <StyledPanel>
            <div className={"diagrams"}>
                {Array.from(lifecycleStagesCodesAndValues.entries()).map(([key, value]) => {
                    const currentCounts= getStageCurrentTotalAndToConvertCount(currentLifecycleStagesCount!, value)
                    const lifecycleStage: LifecycleStage = createLifecycleStage(key, value, currentCounts.currentTotal, currentCounts.toConvert, objectives);
                    return(
                        <div className={"panel contact-panel"} key={key}>
                            <h2 className={"panel-title"}>{lifecycleStage.title}</h2>
                            <div className={"lifecycle-stage-details"}>
                                {buildBarDiagram(lifecycleStage.code, lifecycleStage.title, lifecycleStage.objective, lifecycleStage.content)}
                                <div className={"side-chart"}>
                                    <InfoChart value={lifecycleStage.value} objective={lifecycleStage.objective} currentTotal={lifecycleStage.currentTotal} toConvert={lifecycleStage.toConvert}/>
                                    {/*<NumberChart
                                        displayedValue={(((getLifecycleCountByStage(last31DaysStagesCount!, lifecycleStage.code)!.count)/lifecycleStage.currentTotal) * 100).toFixed(0)+" %"}
                                        title={"Croissance totale de " + lifecycleStage.title.toLowerCase()}
                                        subTitle={"Sur les 31 derniers jours"}
                                        isLoading={false}
                                        icon={<BsGraphUpArrow color={"white"} size={"1.8em"}/>}
                                        color={"#BD2651"}
                                        conditionalColoring={false}
                                    />*/}
                                </div>
                                {
                                    drawLine()
                                }
                            </div>
                        </div>
                    )}
                )}
            </div>
        </StyledPanel>
    )
}

export default ContactPanel