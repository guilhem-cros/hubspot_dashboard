import LifecycleCount from "../interfaces/lifecycleCount";
import axios from "axios";
import {
    contactsByStageEndPoint,
    contractsEndPoint,
    countEndPoint,
    lifecycleStagesCountEndPoint
} from "../constants/endpoints";
import {generateTwoYearsFromMonths} from "../interfaces/period";
import Contract from "../interfaces/contract";
import MonthlyContracts from "../interfaces/monthlyContracts";
import Contact, {getAvgConvertionTime} from "../interfaces/contact";

/**
 * Calls proxy/hubspot API. Get the lifecycle stages metrics for contacts concerning a specified period.
 * Returns an array of LifecycleCount, containing for each stage the count of contacts that entered the
 * stage during the specified period
 * @param dateTo beginning date of the period as timestamp
 * @param dateFrom ending date of the period as timestamp
 * @throws an error if problems occurs during the request
 */
async function getLifecycleStages(dateTo: number, dateFrom: number): Promise<LifecycleCount[]> {
    const response = await axios.get(lifecycleStagesCountEndPoint + "?from="+dateFrom+"&to="+dateTo, {
        headers: {
            Authorization: 'Bearer ' + process.env.REACT_APP_HUBSPOT_PRIVATE_APP_TOKEN,
            "Content-Type": "application/json"
        },
    });
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
                leaddate: contactData.properties.hs_lifecyclestage_lead_date ? new Date(contactData.properties.hs_lifecyclestage_lead_date) : null
            }
        }));

        return contacts;
    } else {
        console.error(response.data);
        throw new Error(response.data);
    }
}

async function getContactToCustomerAvgTime(): Promise<number>{
    const customers = await getContactsByStage("customer");
    if(customers.length>0){
        return getAvgConvertionTime(customers)!;
    } else {
        return -1;
    }
}


async function getContracts(dealStage: string|null, dateFrom: Date, dateTo: Date): Promise<Contract[]>{
    let url = contractsEndPoint + "?since="+dateFrom.getTime()+"&to="+dateTo.getTime();
    url = dealStage===null ? url : url + "&stage="+dealStage;

    const response = await axios.get(url);
    if(response.status===200){
        const contracts : Contract[] = [];
        const data = response.data;
        data.forEach((contractJson: any)=>{
            const contract : Contract = {
                amount: +contractJson.properties.amount,
                montant_devise: +contractJson.properties.montant_devise,
                stage: contractJson.properties.dealstage
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

async function getCurrentMonthContractsAmount(): Promise<{closedWonAmount: number, contractSentAmount: number}>{
    const now = new Date();
    const firstDayOfTheMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const wonContracts = await getContracts("closedwon", firstDayOfTheMonth, now);
    let wonAmount: number = 0;
    wonContracts.forEach((contract: Contract)=>{
        wonAmount += contract.amount;
    });

    const sentContracts = await getContracts("contractsent", firstDayOfTheMonth, now);
    let sentAmount: number = 0;
    sentContracts.forEach((contract: Contract)=>{
        sentAmount += contract.montant_devise;
    });
    return {closedWonAmount: wonAmount, contractSentAmount: sentAmount};
}

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


export {
    getLifecycleStages,
    getTwoYearsLifecycleStagesCountsByMonth,
    getCurrentCountByLifecycles,
    getContactsByStage,
    getContractsTotalAmount,
    getTwoYearsContractsByMonth,
    getContactToCustomerAvgTime,
    getCurrentMonthContractsAmount
};