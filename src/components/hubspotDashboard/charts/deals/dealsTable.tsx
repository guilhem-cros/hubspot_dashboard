import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Contract from '../../../../interfaces/contract';
import { Spin } from 'react-cssfx-loading';
import { getContracts } from '../../../../config/hubspotConfig';
import Period from '../../../../interfaces/period';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import {contractsStagesValues} from "../../../../constants/hubspotAPIValues";

const StyledTable = styled.div`
  
  .table-container{
    height: 370px;
  }
  
  .table-title, .no-deals-found {
    font-weight: 800;
  }
  
  h2{
    margin-bottom: 25px;
  }
  
  .table-chart {
    height: 470px;
  }

  .table-loading{
    margin-top: 30%;
    margin-left: 43%;
  }
`;

interface Props {
    dealStage: string|null;
    title: string;
    period: Period;
    handleError : (error: string)=> void;
}

interface SortConfig {
    key: keyof Contract;
    direction: 'asc' | 'desc';
}

/**
 * React component : displays a table containing deals and information associated.
 * Fetch every deal in a specified period and matching a specified stage to display in table
 * @param dealStage the stage of the deal
 * @param title title of the chart
 * @param period the period in which deals are searched
 * @param handleError function handling error
 * @constructor
 */
const DealsTable: React.FC<Props> = ({ dealStage, title, period, handleError }) => {

    /**
     * Contracts fetched and matching props, null if not fetched yet
     */
    const [deals, setDeals] = useState<Contract[] | null>(null);

    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    /**
     * Called whenever props changed : fetch deals matching params
     */
    useEffect(() => {
        if (deals === null) {
            getContracts(dealStage, period.dateFrom, period.dateTo)
                .then((value) => {
                    setDeals(value);
                })
                .catch((error) => {
                    console.error(error);
                    handleError("L'ensemble des transactions n'a pas pu être récupéré.")
                });
        }
    }, [deals, dealStage, period.dateFrom, period.dateTo]);

    const handleSort = (key: keyof Contract) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedDeals = deals
        ? [...deals].sort((a, b) => {
            if (!sortConfig) return 0;

            const { key, direction } = sortConfig;
            if (a[key]! < b[key]!) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key]! > b[key]!) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        })
        : null;

    const printStageValue = (deal: Contract) : string => {
        if(deal.stage.localeCompare("contractsent")===0){
            return "Contrat envoyé"
        } else if ((deal.stage.localeCompare("closedlost")===0)){
            return "Opportunité perdue"
        } else if ((deal.stage.localeCompare("closedwon")===0)){
            return "Devis signé"
        } else {
            return "Autre"
        }
    }

    /**
     * Building table and handling row sorting by column
     */
    const buildTable = () => {
        return (
            <TableContainer component={Paper} className={"table-container"}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={'table-title'}>
                                <TableSortLabel
                                    active={sortConfig?.key === 'company'}
                                    direction={sortConfig?.key === 'company' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('company')}
                                >
                                    Entreprise
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className={'table-title'}>
                                <TableSortLabel
                                    active={sortConfig?.key === 'montant_devise'}
                                    direction={sortConfig?.key === 'montant_devise' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('montant_devise')}
                                >
                                    Montant devisé
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className={'table-title'}>
                                <TableSortLabel
                                    active={sortConfig?.key === 'sentDate'}
                                    direction={sortConfig?.key === 'sentDate' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('sentDate')}
                                >
                                    Date d'envoi du devis
                                </TableSortLabel>
                            </TableCell>
                            {(dealStage!==null && dealStage!.localeCompare(contractsStagesValues.get("won")!) === 0) && (
                                <>
                                    <TableCell className={'table-title'}>
                                        <TableSortLabel
                                            active={sortConfig?.key === 'amount'}
                                            direction={sortConfig?.key === 'amount' ? sortConfig.direction : 'asc'}
                                            onClick={() => handleSort('amount')}
                                        >
                                            Montant signé
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className={'table-title'}>
                                        <TableSortLabel
                                            active={sortConfig?.key === 'closedDate'}
                                            direction={sortConfig?.key === 'closedDate' ? sortConfig.direction : 'asc'}
                                            onClick={() => handleSort('closedDate')}
                                        >
                                            Date de signature
                                        </TableSortLabel>
                                    </TableCell>
                                </>
                            )}
                            {
                                dealStage===null &&
                                <TableCell className={'table-title'}>
                                    <TableSortLabel
                                        active={sortConfig?.key==='stage'}
                                        direction={sortConfig?.key==='stage' ? sortConfig.direction : 'asc'}
                                        onClick={() => handleSort('stage')}
                                    >
                                        État
                                    </TableSortLabel>
                                </TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedDeals!.length>0 ? (
                            sortedDeals!.map((deal, index) => {
                                if(dealStage!==null || deal.stage.localeCompare(contractsStagesValues.get("won")!)!==0){
                                return(
                                <TableRow key={index}>
                                    <TableCell>{deal.company}</TableCell>
                                    <TableCell>{deal.montant_devise + " €"}</TableCell>
                                    <TableCell>
                                        {deal.sentDate.toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </TableCell>
                                    {(dealStage!==null && dealStage!.localeCompare('closedwon') === 0) && (
                                        <>
                                            <TableCell>{deal.amount + " €"}</TableCell>
                                            <TableCell>
                                                {deal.closedDate!.toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                        </>
                                    )}
                                    {
                                        dealStage===null &&
                                        <TableCell>{printStageValue(deal)}</TableCell>
                                    }
                                </TableRow>
                            )}})
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" className={"no-deals-found"}>
                                    Aucune transaction trouvée.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <StyledTable>
            <div className={'table-chart chart'}>
                <h2>{title}</h2>
                {deals !== null ? (
                    <div className={'deal-table'}>{buildTable()}</div>
                ) : (
                    <Spin width={50} height={50} className={'table-loading'} />
                )}
            </div>
        </StyledTable>
    );
};

export default DealsTable;
