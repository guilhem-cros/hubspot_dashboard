import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import MonthlyContracts from "../../../interfaces/monthlyContracts";
import { getTwoYearsContractsByMonth } from "../../../config/hubspotConfig";
import { contractsStagesValues } from "../../../constants/hubspotAPIValues";
import ContractsBarChart from "../charts/deals/contractsBarChart";
import { MONTHLY_EXPECTED_CA, MONTHLY_SIGNED_CA } from "../../../constants/objectives";
import {Hypnosis} from "react-cssfx-loading";
import DealsTable from "../charts/deals/dealsTable";
import DuoLineChart from "../charts/deals/duoLineChart";

const StyledContractsPanel = styled.div`
  margin: 0 1% 1%;
  text-align: center;

  .ca-charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;

    @media screen and (max-width: 1100px){
      grid-template-columns: 1fr;
    }
  }
  
  .bar-loader{
    margin-top: 7%;
    margin-bottom: 7%;
    text-align: center;
    margin-left: 47%;
  }
  
  .global-tables{
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
`;

interface Props {
    handleError : (error: string)=> void;
}

/**
 * React component : Builds the panel linked to deals containing charts and tables
 * @param handleError function handling error during data fetching
 * @constructor
 */
const ContractsPanel: React.FC<Props> = ({handleError}) => {

    /**
     * List of contracts won per month, null if not fetched
     */
    const [monthlyWonContracts, setMonthlyWonContracts] = useState<MonthlyContracts[] | null>(null);

    /**
     * List of contracts sent per month, null is not fetched
     */
    const [monthlySentContracts, setMonthlySentContracts] = useState<MonthlyContracts[] | null>(null);

    /**
     * true if critical data has been loaded, false if not
     */
    const [isLoaded, setIsLoaded] = useState(false);

    /**
     * Ref to the current component in html
     */
    const contractsPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });
        if (contractsPanelRef.current) {
            observer.observe(contractsPanelRef.current);
        }

        return () => {
            if (contractsPanelRef.current) {
                observer.unobserve(contractsPanelRef.current);
            }
        };
    }, []);

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoaded) {
            fetchContracts().then(() => {
                setIsLoaded(true);
            });
        }
    };

    /**
     * Fetch necessary data
     */
    const fetchContracts = async () => {
        try {
            if (monthlySentContracts === null) {
                const contracts = await getTwoYearsContractsByMonth(null); //toutes les transactions
                setMonthlySentContracts(contracts);
            }

            if (monthlyWonContracts === null) {
                const contracts = await getTwoYearsContractsByMonth(contractsStagesValues.get("won")!);
                setMonthlyWonContracts(contracts);
            }
        } catch (error) {
            handleError("Les transactions n'ont pas pu être récupérées");
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("Unexpected error: " + error);
            }
        }
    };


    const currentDate = new Date();
    const twoYearsAgo = new Date(currentDate.getFullYear() - 2, currentDate.getMonth(), currentDate.getDate());


    return (
        <StyledContractsPanel ref={contractsPanelRef}>
            {isLoaded ?
                <div>
                    <div className={"ca-charts"}>
                        <ContractsBarChart concernsExpectedAmount={true} title={"CA devisé par mois (€)"} content={"CA devisé"} data={monthlySentContracts!} objective={MONTHLY_EXPECTED_CA} />
                        <ContractsBarChart concernsExpectedAmount={false} title={"CA signé par mois (€)"} content={"CA signé"} data={monthlyWonContracts!} objective={MONTHLY_SIGNED_CA} />
                    </div>
                    <div className={"comparing-charts"}>
                        <DuoLineChart title={"CA devisé et signé par mois (€)"} signedData={monthlyWonContracts} sentData={monthlySentContracts}/>
                    </div>
                    <div className={"global-tables"}>
                        <DealsTable
                            title={"Transactions devisées"}
                            dealStage={null}
                            period={{dateTo: currentDate, dateFrom: twoYearsAgo}}
                            handleError={handleError}
                        />
                        <DealsTable
                            title={"Transactions signées"}
                            dealStage={contractsStagesValues.get("won")!}
                            period={{dateTo: currentDate, dateFrom: twoYearsAgo}}
                            handleError={handleError}
                        />
                    </div>
                </div>
                :
                <div  className={"bar-loader"}>
                    <Hypnosis width={100} height={100} />
                </div>
            }
        </StyledContractsPanel>
    );
};

export default ContractsPanel;
