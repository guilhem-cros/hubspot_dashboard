import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import MonthlyContracts from "../interfaces/monthlyContracts";
import { getTwoYearsContractsByMonth } from "../config/hubspotConfig";
import { contractsStagesValues } from "../constants/hubspotAPIValues";
import ContractsBarChart from "./charts/contractsBarChart";
import { MONTHLY_EXPECTED_CA, MONTHLY_SIGNED_CA } from "../constants/objectives";
import {Hypnosis} from "react-cssfx-loading";

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
`;

interface Props {

}

const ContractsPanel: React.FC<Props> = () => {

    const [monthlyWonContracts, setMonthlyWonContracts] = useState<MonthlyContracts[] | null>(null);
    const [monthlySentContracts, setMonthlySentContracts] = useState<MonthlyContracts[] | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

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
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("Unexpected error: " + error);
            }
        }
    };

    return (
        <StyledContractsPanel ref={contractsPanelRef}>
            {isLoaded ?
                <div className={"ca-charts"}>
                    <ContractsBarChart concernsExpectedAmount={true} title={"CA devisé par mois (€)"} content={"CA devisé"} data={monthlySentContracts!} objective={MONTHLY_EXPECTED_CA} />
                    <ContractsBarChart concernsExpectedAmount={false} title={"CA signé par mois (€)"} content={"CA signé"} data={monthlyWonContracts!} objective={MONTHLY_SIGNED_CA} />
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
