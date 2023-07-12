import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {
    getContactToCustomerAvgTime,
    getContractsTotalAmount,
    getCurrentCountByLifecycles, getCurrentMonthContractsAmount, getLifecycleStages,
    getTwoYearsLifecycleStagesCountsByMonth
} from "../config/hubspotConfig";
import LifecycleCount, {
    getLifecycleCountByStage,
    getStageCurrentTotalAndToConvertCount
} from "../interfaces/lifecycleCount";
import LifecycleBarChart from "./charts/lifecycleBarChart";
import InfoChart from "./charts/infoChart";
import LifecycleStage, {createLifecycleStage} from "../interfaces/lifecycleStage";
import {contractsStagesValues, lifecycleStagesCodesAndValues} from "../constants/hubspotAPIValues";
import NumberChart from "./charts/numberChart";
import ContractsPanel from "./contractsPanel";
import {BsGraphUpArrow} from "react-icons/bs";
import {RxLapTimer} from "react-icons/rx";
import {MdAttachMoney} from "react-icons/md";
import logo from '../assets/images/stride_logo.png';
import {Hypnosis} from "react-cssfx-loading";
import {RiNumbersLine} from "react-icons/ri";
import {PiTarget} from "react-icons/pi";
import {MONTHLY_EXPECTED_CA, MONTHLY_SIGNED_CA} from "../constants/objectives";

const StyledList = styled.div`

  .chart {
    background-color: white;
    border: solid 1px lightgrey;
    border-radius: 15px;
    padding: 20px;
    margin: 2%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media screen and (max-width: 600px){
      padding-left: 0;
      padding-right: 2px;
    }
  }

  .lifecycle-stage-details {
    margin: 0 1% 1%;
    display: grid;
    grid-template-columns: 3fr 1fr;
    align-items: center;
    
    @media screen and (max-width: 1250px){
      grid-template-columns: 1fr;
    }
  }
  
  .diagrams{
    margin-top: 1%;
  }
  
  #details-title{
    text-align: center;
    margin-top: 4%;
    margin-bottom: 2%;
    font-size: 1.8em;
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

  .panel-title {
    text-align: left;
    margin-left: 4%;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  
  .insight-charts{
    display: flex;
    flex-direction: row;
    justify-content: center;

    @media screen and (max-width: 600px){
      flex-direction: column;
    }
  }

  .insight-charts>*{
    width: 25%;
    
    @media screen and (max-width: 1250px){
      width: 33%;
    }

    @media screen and (max-width: 900px){
      width: 45%;
    }

    @media screen and (max-width: 600px){
      width: 95%;
    }
  }
  
  .page-title{
    padding-right: 20px;
    margin-bottom: 1.5%;
    color: #b8b7ad;
    background-color: #373a47;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    justify-content: flex-end;

    @media screen and (max-width: 450px){
      justify-content: flex-start;
      padding-right: 0;
      padding-left: 36px;
      padding-top: 45px;
    }

    @media screen and (max-width: 320px){
      padding-left: 0;
      justify-content: center;
    }
    
    >h1{
      padding-bottom: 7px;
      @media screen and (max-width: 400px){
        font-size: 1.5em;
      }
    }
  }
  
  .line{
    margin-left: 3%;
    border-bottom: grey 1px solid;
    width: 200px;
  }
  
  .global-loading{
    margin-left: 45%;
    margin-top: 10%;
  }
  
  .growth-charts{
    display: flex;
    flex-direction: column;
    margin-bottom: 5%;

    @media screen and (max-width: 800px){
      flex-direction: row;
      margin-bottom: 0;
      >*{
        width: 50%;
      }
    }
    
  }
  
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
  
  .contracts-growth-charts{
    display: flex;
    flex-direction: column;
    width: 48%;

    @media screen and (max-width: 1000px){
      flex-direction: row;
      width: 100%;
      >*{
        width: 46%;
        height: 200px;
      }
    }
    @media screen and (max-width: 600px){
      flex-direction: column;
      width: 98%;
      >*{
        height: 150px;
        width: 100%;
      }
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
`

interface Props{

}

/**
 * React component : dashboard concerning hubspot datas.
 * Call functions fetching useful datas from the hubspot api
 * and build every necessary chart
 * @constructor
 */
const HubSpotDashboard :React.FC<Props> = ()=>{

    /**
     * Variable containing lifecycle stages metrics per month
     */
    const [lifecycleStagesPerMonth, setLifecycleStagesPerMonth] = useState<LifecycleCount[][]|null>(null);

    /**
     * Variable containing lifecycle stages current counts
     */
    const [currentLifecycleStagesCount, setCurrentLifecycleStagesCount] = useState<LifecycleCount[]|null>(null);

   const [last31DaysStagesCount, setLast31DaysStagesCount] = useState<LifecycleCount[]|null>(null);

    /**
     * True if datas have been fetched, false if not
     */
    const [isLoaded, setIsLoaded]= useState(false);

    /**
     * Contains the message of a potential error, null if no error occurs
     */
    const [fetchError, setFetchError] = useState<string|null>(null);

    const [wonContractsAmount, setWonContractsAmount] = useState<number|null>(null);

    const [avgConvertionTime, setAvgConvertionTime] = useState<number|null>(null);

    const [currentMonthContractsAmount, setCurentMonthContractsAmount] = useState<{closedWonAmount: number, contractSentAmount: number}|null>(null)

    /**
     * Called when mounting component : fetch datas
     */
    useEffect(()=> {
        if(!isLoaded) {
            fetchData().then(()=> {
                setIsLoaded(true);
            })
        }
    });

    useEffect(()=>{
        if (isLoaded && wonContractsAmount===null){
            fetchWonContractsAmount();
            fetchAvgConvertionTime();
            fetchCurrentMonthContractsAmounts();
        }
    }, [isLoaded])

    /**
     * Fetch every useful data and associate them to matching useStates.
     * If an error occurs set the fetchError useState
     */
    const fetchData = async () => {

        try {

            if (currentLifecycleStagesCount === null) {
                const currentCount = await getCurrentCountByLifecycles();
                setCurrentLifecycleStagesCount(currentCount);
            }

            if (lifecycleStagesPerMonth === null) {
                const perMonthCount = await getTwoYearsLifecycleStagesCountsByMonth()
                setLifecycleStagesPerMonth(perMonthCount);
            }

            if(last31DaysStagesCount === null) {
                const now = new Date();
                const monthAgo = new Date();
                monthAgo.setDate(now.getDate()-31);
                const last31DaysStagesCount = await getLifecycleStages(now.getTime(), monthAgo.getTime());
                setLast31DaysStagesCount(last31DaysStagesCount);
            }

        } catch (error){
            if(error instanceof Error){
                setFetchError(error.message);
            } else {
                setFetchError('Unexpected error: ' + error);
            }
        }
    }

    const fetchWonContractsAmount = () => {
        getContractsTotalAmount(contractsStagesValues.get("won")!)
            .then((value)=>{
                setWonContractsAmount(value);
            })
            .catch((error)=>{
                setFetchError(error.message);
            })
    }

    const fetchAvgConvertionTime = () => {
        getContactToCustomerAvgTime()
            .then((value)=>{
                setAvgConvertionTime(value);
            })
            .catch((error)=>{
                setFetchError(error.message);
            })
    }

    const fetchCurrentMonthContractsAmounts = () => {
        getCurrentMonthContractsAmount()
            .then((value)=>{
                setCurentMonthContractsAmount(value);
            }).catch((error)=>{
                setFetchError(error.message);
        })
    }

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

    /**
     * Builds every chart for each lifecycle stage
     */
    const getLifecycleStageDetails = () => {
        return (
            <div className={"diagrams"}>
                {Array.from(lifecycleStagesCodesAndValues.entries()).map(([key, value]) => {
                    const currentCounts= getStageCurrentTotalAndToConvertCount(currentLifecycleStagesCount!, value)
                    const lifecycleStage: LifecycleStage = createLifecycleStage(key, value, currentCounts.currentTotal, currentCounts.toConvert);
                    return(
                        <div className={"panel contact-panel"} key={key}>
                            <h2 className={"panel-title"}>{lifecycleStage.title}</h2>
                            <div className={"lifecycle-stage-details"}>
                                {buildBarDiagram(lifecycleStage.code, lifecycleStage.title, lifecycleStage.objective, lifecycleStage.content)}
                                <div className={"side-chart"}>
                                    <InfoChart content={lifecycleStage.title} objective={lifecycleStage.objective} currentTotal={lifecycleStage.currentTotal} toConvert={lifecycleStage.toConvert}/>
                                    <NumberChart
                                        displayedValue={(((getLifecycleCountByStage(last31DaysStagesCount!, lifecycleStage.code)!.count)/lifecycleStage.currentTotal) * 100).toFixed(0)+" %"}
                                        title={"Croissance totale du nombre de " + lifecycleStage.title.toLowerCase()}
                                        subTitle={"Sur les 31 derniers jours"}
                                        isLoading={false}
                                        icon={<BsGraphUpArrow color={"white"} size={"1.8em"}/>}
                                        color={"#BD2651"}
                                        conditionalColoring={false}
                                    />
                                </div>
                                {
                                    drawLine()
                                }
                            </div>
                        </div>
                    )}
                )}
            </div>
        )
    }

    const buildInsights = () => {
        return (
            <div className={"insight"}>
                <h2 className={"panel-title"}>Aperçu général</h2>
                <div className={"insight-charts"}>
                    <NumberChart
                        isLoading={avgConvertionTime===null}
                        displayedValue={avgConvertionTime?.toFixed(0) + " jours"}
                        title={"Temps de négociation moyen"}
                        subTitle={"Du premier contact à la signature de devis"}
                        icon={<RxLapTimer color={"white"} size={"1.8em"}/>}
                        color={"#F8B114"}
                        conditionalColoring={false}
                    />
                    <NumberChart
                        title={"Montant de devis signé"}
                        subTitle={"Depuis le 1er Janvier "+ (new Date()).getFullYear()}
                        isLoading={wonContractsAmount===null}
                        displayedValue={wonContractsAmount?.toFixed(0) + " €"}
                        icon={<MdAttachMoney color={"white"} size={"1.8em"}/>}
                        color={"#3399FE"}
                        conditionalColoring={false}
                    />
                </div>
            </div>
        )
    }

    const buildGrowthCharts = (lifecycleStage: LifecycleStage) => {
        const monthlyCount = getMonthlyLifecycleStages(lifecycleStage.code);
        return (
            <div className={"growth-charts"}>
                <NumberChart
                    title={"Nouveaux " + lifecycleStage.title.toLowerCase()}
                    subTitle={"Sur le mois courant"}
                    displayedValue={monthlyCount[monthlyCount.length-1].count + (lifecycleStage.objective === null ? "" : " / " + lifecycleStage.objective)}
                    isLoading={false}
                    icon={<RiNumbersLine  color={"white"} size={"1.8em"}/>}
                    color={"#11B981"}
                    conditionalColoring={false}
                />
                <NumberChart
                    displayedValue={lifecycleStage.objective === null ? "/" :(monthlyCount[monthlyCount.length-1].count/lifecycleStage.objective!*100).toFixed(0) + " %"}
                    title={"Progression vers l'objectif de " + lifecycleStage.title.toLowerCase()}
                    subTitle={""}
                    isLoading={false}
                    icon={<PiTarget color={"white"} size={"1.8em"}/>}
                    color={"#E85411"}
                    conditionalColoring={true}
                />
            </div>
        )
    }

    const buildContractsAmountGrowthCharts = (title: string, objective: number, amount: number |undefined) => {
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
                <NumberChart
                    title={"Progression vers l'objectif"}
                    subTitle={""}
                    displayedValue={amount!==undefined ? ((amount! / objective*100).toFixed(0) + " %") : ""}
                    isLoading={currentMonthContractsAmount===null}
                    icon={<PiTarget color={"white"} size={"1.8em"}/>}
                    color={"#E85411"}
                    conditionalColoring={true}
                />
            </div>
        )
    }

    const buildLastMonthInsights = () => {
        return (
            <div className={"last-month-insight"}>
                <h2 className={"panel-title"}>Aperçu sur le mois courant</h2>
                <div className={"last-month-insight-charts"}>
                    <div className={"last-month-stage-insight-charts"}>
                        {Array.from(lifecycleStagesCodesAndValues.entries()).map(([key, value]) => {
                            const currentCounts= getStageCurrentTotalAndToConvertCount(currentLifecycleStagesCount!, value)
                            const lifecycleStage: LifecycleStage = createLifecycleStage(key, value, currentCounts.currentTotal, currentCounts.toConvert);
                            return(
                                <div className={"stage-growth"} key={key}>
                                    {buildGrowthCharts(lifecycleStage)}
                                </div>
                            )
                        })}
                    </div>
                    <div className={"last-month-contract-insight-charts"}>
                        {buildContractsAmountGrowthCharts("Montant devisé", MONTHLY_EXPECTED_CA, currentMonthContractsAmount?.contractSentAmount)}
                        {buildContractsAmountGrowthCharts("Montant signé", MONTHLY_SIGNED_CA, currentMonthContractsAmount?.closedWonAmount)}
                    </div>
                </div>
                {drawLine()}
            </div>
        )
    }

    const drawLine = () => {
        return (
            <div className={"line"}></div>
        )
    }


    return (
        <StyledList>
            <div className={"page-title"}>
                <h1>Dashboard Hubspot</h1>
                <img src={logo} alt={"Logo Stride"} height={25}/>
            </div>
            {isLoaded ?
                <div>
                    {fetchError===null ?
                        <div>
                            <div className={"insight-panel"}>
                                {buildInsights()}
                                {buildLastMonthInsights()}
                            </div>
                            <div className={"details-panel"}>
                                <h2 id={"details-title"}>Visualisation globale</h2>
                                {getLifecycleStageDetails()}
                                <div className={"panel"}>
                                    <h2 className={"panel-title"}>Chiffre d'Affaire</h2>
                                    <ContractsPanel/>
                                </div>
                            </div>
                        </div>
                        :
                        <h2>Error: {fetchError}</h2>
                    }
                </div>
                :
                <Hypnosis
                    width={100}
                    height={100}
                    className={"global-loading"}
                />
            }
        </StyledList>
    );

}

export default HubSpotDashboard;