import LifecycleCount from "../interfaces/lifecycleCount";
import axios from "axios";
import {
    contactsByStageEndPoint,
    contractsEndPoint,
    countEndPoint,
    lifecycleStagesCountEndPoint, objectivesEndPoint
} from "../constants/endpoints";
import {generateTwoYearsFromMonths} from "../interfaces/period";
import Contract from "../interfaces/contract";
import MonthlyContracts from "../interfaces/monthlyContracts";
import Contact, {getAvgConvertionTime} from "../interfaces/contact";
import {contractsStagesValues} from "../constants/hubspotAPIValues";
import Objectives from "../interfaces/objectives";

/**
 * Calls proxy/hubspot API. Get the lifecycle stages metrics for contacts concerning a specified period.
 * Returns an array of LifecycleCount, containing for each stage the count of contacts that entered the
 * stage during the specified period
 * @param dateTo beginning date of the period as timestamp
 * @param dateFrom ending date of the period as timestamp
 * @throws an error if problems occurs during the request
 */
async function getLifecycleStages(dateTo: number, dateFrom: number): Promise<LifecycleCount[]> {
    const response = await axios.get(lifecycleStagesCountEndPoint + "?from="+dateFrom+"&to="+dateTo);
    if(response.status===200) {
        return JSON.parse(response.data) as LifecycleCount[];
    } else {
        console.error(response.data);
        throw new Error(response.data);
    }
}

/**
 * Get lifecycle stages metrics for contacts concerning every month since 2 years ago (the oldest month is May 2023)
 * Returns an array of array, containing for each stage the count of contacts that entered the
 * stage for each month.
 * @throws an error if a problem occurs requesting proxy/hubspot API
 */
async function getTwoYearsLifecycleStagesCountsByMonth(): Promise<LifecycleCount[][]> {
    const months = generateTwoYearsFromMonths();
    const lifecycleStagesFromTwoYears: LifecycleCount[][] = [];

    await Promise.all(
        months.map(async (month) => {
            const result = await getLifecycleStages(month.dateTo.getTime(), month.dateFrom.getTime());
            result.forEach((stage)=>{
                stage.period = month;
            })
            lifecycleStagesFromTwoYears.push(result);
        })
    );

    return lifecycleStagesFromTwoYears;
}

/**
 * Calls proxy/hubspot API. Get the total of contact in each lifecycle stage at the current date (contacts are counted only once, in their most advanced stage).
 * Returns an array of LifecycleCount, containing for each stage this number.
 * @throws an error if a problem occurs requesting proxy/hubspot API.
 */
async function getCurrentCountByLifecycles(): Promise<LifecycleCount[]>{
    const response = await axios.get(countEndPoint);
    if(response.status===200) {
        return response.data;
    } else {
        console.error(response.data);
        throw new Error(response.data);
    }
}

/**
 * Calls proxy/hubspot API. Get every contacts matching a specified stage
 * @param stage the stage name that contacts must match
 * @return the list of contact matching the stage
 * @throws an error if an error occurs requesting proxy/hubspot API.
 */
async function getContactsByStage(stage: string|null): Promise<Contact[]>{
    let url = contactsByStageEndPoint;
    url = stage === null ? url : url + "?stage="+stage;

    const response = await axios.get(url);
    if(response.status===200){
        const data = response.data;
        const contacts: Contact[] = data.map((contactData: any) => ({
            id: parseInt(contactData.id),
            lifecycleStage: stage === null ? "customer" : stage,
            properties: {
                firstname: contactData.properties.firstname,
                lastname: contactData.properties.lastname,
                email: contactData.properties.email,
                closedate: contactData.properties.closedate ? new Date(contactData.properties.closedate) : null,
                createddate: new Date(contactData.properties.createdate),
                leaddate: contactData.properties.hs_lifecyclestage_lead_date ? new Date(contactData.properties.hs_lifecyclestage_lead_date) : null,
                subscriberDate: contactData.properties.hs_lifecyclestage_subscriber_date ? new Date(contactData.properties.hs_lifecyclestage_subscriber_date) : null,
            }
        }));

        return contacts;
    } else {
        console.error(response.data);
        throw new Error(response.data);
    }
}

/**
 * Calculates the average time between first talk with a contact and associated first closed contract
 * @return the average time
 */
async function getContactToCustomerAvgTime(): Promise<[number|null, number|null]>{
    const customers = await getContactsByStage("customer");
    if(customers.length>0){
        return getAvgConvertionTime(customers);
    } else {
        return [-1, -1];
    }
}

/**
 * Calls Proxy/Hubspot API. Get every deal in a specified period and matching specified stage
 * @param dealStage the stage in which deals must be
 * @param dateFrom begin date of the period
 * @param dateTo end date of the period
 */
async function getContracts(dealStage: string|null, dateFrom: Date, dateTo: Date): Promise<Contract[]>{
    let url = contractsEndPoint + "?since="+dateFrom.getTime()+"&to="+dateTo.getTime();
    url = dealStage===null ? url : url + "&stage="+dealStage;

    const response = await axios.get(url);
    if(response.status===200){
        const contracts : Contract[] = [];
        const data = response.data;
        data.forEach((contractJson: any)=>{
            const contract : Contract = {
                company: contractJson.properties.dealname.split("-")[0],
                amount: +contractJson.properties.amount,
                montant_devise: +contractJson.properties.montant_devise,
                stage: contractJson.properties.dealstage,
                closedDate: contractJson.properties.closedate ? new Date(contractJson.properties.closedate) : null,
                sentDate: new Date(contractJson.properties.createdate)
            }
            contracts.push(contract);
        })
        return contracts;
    } else {
        console.error(response.data);
        throw new Error(response.data);
    }
}

async function getContractsTotalAmount(dealStage: string|null): Promise<number>{
    const now = new Date();
    const firstDayOfTheYear = new Date(now.getFullYear(), 1, 1);

    const contracts = await getContracts(dealStage, firstDayOfTheYear, now);
    let total: number = 0;
    contracts.forEach((contract: Contract)=>{
        total += contract.amount;
    });
    return total;
}

/**
 * Calls Proxy/Hubspot API. Get every deal of the current month matching closedwon or contractsent stage
 * and then calculte the total closedWonAmount and contractSentAmount for this month.
 * @return an object containing both total closedWonAmount and contractSentAmount for current month
 */
async function getCurrentMonthContractsAmount(): Promise<{closedWonAmount: number, contractSentAmount: number}>{
    const now = new Date();
    const firstDayOfTheMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const wonContracts = await getContracts(contractsStagesValues.get("won")!, firstDayOfTheMonth, now);
    let wonAmount: number = 0;
    wonContracts.forEach((contract: Contract)=>{
        wonAmount += contract.amount;
    });

    const sentContracts = await getContracts(null, firstDayOfTheMonth, now);
    let sentAmount: number = 0;
    sentContracts.forEach((contract: Contract)=>{
        sentAmount += contract.montant_devise;
    });
    return {closedWonAmount: wonAmount, contractSentAmount: sentAmount};
}

/**
 * Get every deals matching specified dealStage from the last 2 years
 * @param dealStage stage that deals must match
 */
async function getTwoYearsContractsByMonth(dealStage: string|null): Promise<MonthlyContracts[]>{
    const months = generateTwoYearsFromMonths();
    const contractsByMonth : MonthlyContracts[] = [];

    await Promise.all(
        months.map(async (month) => {
            const monthContracts = await getContracts(dealStage, month.dateFrom, month.dateTo);
            contractsByMonth.push({period: month, contracts: monthContracts});
        })
    );

    return contractsByMonth;
}

async function getObjectives() : Promise<Objectives>{
    const response = await axios.get(objectivesEndPoint);
    if(response.status === 200) {
        return response.data as Objectives;
    } else {
        console.error(response.data);
        throw new Error(response.data)
    }
}


export {
    getLifecycleStages,
    getTwoYearsLifecycleStagesCountsByMonth,
    getCurrentCountByLifecycles,
    getContactsByStage,
    getContractsTotalAmount,
    getTwoYearsContractsByMonth,
    getContactToCustomerAvgTime,
    getCurrentMonthContractsAmount,
    getContracts,
    getObjectives
};