import React from 'react';
import styled from 'styled-components';
import NumberChart from "../charts/numberChart";
import {RxLapTimer} from "react-icons/rx";
import {MdAttachMoney} from "react-icons/md";

const StyledPanel = styled.div`

  .insight-charts{
    display: flex;
    flex-direction: row;
    justify-content: center;

    @media screen and (max-width: 1000px){
      align-items: center;
      flex-direction: column;
    }
  }

  .insight-charts>*{
    width: 25%;

    @media screen and (max-width: 1250px){
      width: 33%;
    }

    @media screen and (max-width: 1000px){
      width: 95%;
    }
  }
`

interface Props {
    avgConvertionTime: null|number,
    avgSignTime: null|number,
    wonContractsAmount: null|number
}

/**
 * Builds the global insight panel
 * @param avgConvertionTime average time in days from lead to customer for a contact
 * @param avgSignTime average time in days from subscriber to customer for a contact
 * @param wonContractsAmount Amount (€) of contracts won since 1st january of current year
 * @constructor
 */
const GlobalInsightsPanel: React.FC<Props> = ({avgConvertionTime, avgSignTime, wonContractsAmount}) => {

    return (
        <StyledPanel>
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
                        title={"Temps de signature moyen"}
                        subTitle={"A partir de l'envoi du contrat"}
                        displayedValue={avgSignTime?.toFixed(0) + " jours"}
                        isLoading={avgConvertionTime===null}
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
        </StyledPanel>
    )
}

export default GlobalInsightsPanel