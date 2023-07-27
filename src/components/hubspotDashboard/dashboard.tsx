import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {
    getContactToCustomerAvgTime,
    getContractsTotalAmount,
    getCurrentCountByLifecycles, getCurrentMonthContractsAmount, getLifecycleStages, getObjectives,
    getTwoYearsLifecycleStagesCountsByMonth
} from "../../config/hubspotConfig";
import LifecycleCount from "../../interfaces/lifecycleCount";
import {contractsStagesValues} from "../../constants/hubspotAPIValues";
import ContractsPanel from "./panels/contractsPanel";
import {Hypnosis} from "react-cssfx-loading";
import GlobalInsightsPanel from "./panels/globalInsightsPanel";
import CurrentMonthInsightsPanel from "./panels/currentMonthInsightsPanel";
import ContactPanel from "./panels/contactsPanel";
import Objectives from "../../interfaces/objectives";

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
  
  #details-title{
    text-align: center;
    margin-top: 3%;
    margin-bottom: 2%;
    font-size: 1.8em;
  }

  .panel-title {
    text-align: left;
    margin-left: 4%;
    margin-bottom: 0;
    padding-bottom: 0;
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
`

interface Props{
    notifyError: (error: string) => void;
}

/**
 * React component : dashboard concerning hubspot datas.
 * Call functions fetching useful datas from the hubspot api
 * and build every necessary chart
 * @constructor
 */
const Dashboard :React.FC<Props> = ({notifyError})=>{

    /**
     * Variable containing lifecycle stages metrics per month, null if not fetched yet
     */
    const [lifecycleStagesPerMonth, setLifecycleStagesPerMonth] = useState<LifecycleCount[][]|null>(null);

    /**
     * Variable containing lifecycle stages current counts for contacts, null if not fetched yet
     */
    const [currentLifecycleStagesCount, setCurrentLifecycleStagesCount] = useState<LifecycleCount[]|null>(null);

    /**
     * Lifecycle stages count during the last 31 days, null if not fetched yet
     */
   const [last31DaysStagesCount, setLast31DaysStagesCount] = useState<LifecycleCount[]|null>(null);

    /**
     * True if critical datas have been fetched, false if not
     */
    const [isLoaded, setIsLoaded]= useState(false);

    /**
     * True if a critical data hasn't been fetched (causing an error), false if not
     */
    const [criticalError, setCriticalError] = useState(false);

    /**
     * Amount (€) of contracts won since January 1st of the current year, null if not fetched yet
     */
    const [wonContractsAmount, setWonContractsAmount] = useState<number|null>(null);

    /**
     * average time in days from lead to customer for a contact, null if not fetched yet
     */
    const [avgConvertionTime, setAvgConvertionTime] = useState<number|null>(null);

    /**
     * average time in days from subscriber to customer for a contact, null if not fetched yet
     */
    const [avgSignTime, setAvgSignTime] = useState<number|null>(null);

    /**
     * Amount (€) of contract won and sent during current month, null if not fetched yet
     */
    const [currentMonthContractsAmount, setCurentMonthContractsAmount] = useState<{closedWonAmount: number, contractSentAmount: number}|null>(null)

    /**
     * Objectives for each studied stat
     */
    const [objectives, setObjectives] = useState<Objectives | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Called when mounting component : fetch datas
     */
    useEffect(()=> {
        if(!isLoaded && !loading) {
            fetchData().then(()=> {
                setIsLoaded(true);
                setLoading(false);
            })
        }
        setLoading(true);
    });

    useEffect(()=> {
        if(isLoaded && !criticalError){
            if(wonContractsAmount === null){
                fetchWonContractsAmount();
            }
            if(avgSignTime === null){
                fetchAvgConvertionTime();
            }
            if(currentMonthContractsAmount === null){
                fetchCurrentMonthContractsAmounts();
            }
        }
    }, [wonContractsAmount, avgSignTime, avgConvertionTime, currentMonthContractsAmount])

    /**
     * When critical data has been loaded : fetch other data
     */
    useEffect(()=>{
        if (isLoaded && !criticalError){
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

                if (objectives === null) {
                    const obj = await getObjectives();
                    setObjectives(obj);
                }

                if (currentLifecycleStagesCount === null) {
                    const currentCount = await getCurrentCountByLifecycles();
                    setCurrentLifecycleStagesCount(currentCount);
                }

                if (lifecycleStagesPerMonth === null) {
                    const perMonthCount = await getTwoYearsLifecycleStagesCountsByMonth()
                    setLifecycleStagesPerMonth(perMonthCount);
                }

                if (last31DaysStagesCount === null) {
                    const now = new Date();
                    const monthAgo = new Date();
                    monthAgo.setDate(now.getDate() - 31);
                    const last31DaysStagesCount = await getLifecycleStages(now.getTime(), monthAgo.getTime());
                    setLast31DaysStagesCount(last31DaysStagesCount);
                }
            } catch (error) {
                setCriticalError(true);
                notifyError("Impossible d'accéder aux données. Patientez quelques minutes puis rafraichissez la page.")
                if (error instanceof Error) {
                    console.error(error)
                } else {
                    console.error("Unexpected error: " + error);
                }
            }

    }

    const fetchWonContractsAmount = () => {
        getContractsTotalAmount(contractsStagesValues.get("won")!)
            .then((value)=>{
                setWonContractsAmount(value);
            })
            .catch((error)=>{
                console.error(error)
            })
    }

    const fetchAvgConvertionTime = () => {
        getContactToCustomerAvgTime()
            .then((value)=>{
                setAvgConvertionTime(value[0]===null ? -1 : value[0]);
                setAvgSignTime(value[1]===null ? -1 : value[1])
            })
            .catch((error)=>{
                console.error(error)
            })
    }

    const fetchCurrentMonthContractsAmounts = () => {
        getCurrentMonthContractsAmount()
            .then((value)=>{
                setCurentMonthContractsAmount(value);
            }).catch((error)=>{
            console.error(error)
        })
    }


    return (
        <StyledList>
            {isLoaded ?
                <div>
                    {!criticalError &&
                        <div>
                            <div className={"insight-panel"}>
                                <GlobalInsightsPanel
                                    avgConvertionTime={avgConvertionTime}
                                    avgSignTime={avgSignTime}
                                    wonContractsAmount={wonContractsAmount}
                                />
                                <CurrentMonthInsightsPanel
                                    lifecycleStagesPerMonth={lifecycleStagesPerMonth}
                                    currentMonthContractsAmount={currentMonthContractsAmount}
                                    currentLifecycleStagesCount={currentLifecycleStagesCount}
                                    notifyError={notifyError}
                                    objectives={objectives!}
                                />
                            </div>
                            <div className={"details-panel"}>
                                <h2 id={"details-title"}>Visualisation globale</h2>
                                <ContactPanel
                                    lifecycleStagesPerMonth={lifecycleStagesPerMonth}
                                    currentLifecycleStagesCount={currentLifecycleStagesCount}
                                    last31DaysStagesCount={last31DaysStagesCount}
                                    objectives={objectives!}
                                />
                                <div className={"panel"}>
                                    <h2 className={"panel-title"}>Chiffre d'Affaire</h2>
                                    <ContractsPanel handleError={notifyError} objectives={objectives!}/>
                                </div>
                            </div>
                        </div>
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

export default Dashboard;