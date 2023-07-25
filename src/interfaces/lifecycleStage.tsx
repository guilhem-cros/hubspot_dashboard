import Objectives from "./objectives";

export default interface LifecycleStage{

    /**
     * Title of the stage (ex. "Stage")
     */
    title: string,

    /**
     * Code of the stage, as declared by hubspot (see ../constants/hubspotAPIValues)
     */
    code: string,

    /**
     * Name of the stage
     */
    value: string,

    /**
     * Number of contacts aimed to add in this stage (per month by default)
     */
    objective: number|null,

    /**
     * The content of the object (used as legend in charts)
     */
    content: string,

    /**
     * Current total number of contact in this stage
     */
    currentTotal: number,

    /**
     * Current number of contact to push to next stage
     */
    toConvert: number
}

/**
 * Builds a LifecycleStage object and prefill some filed using its code
 * @param code the code of the stage, must match one the hubspot stage code (see ../constants/hubspotAPIValues)
 * @param value the name of the stage
 * @param total the current total number of contact in this stage
 * @param toConvert the current number of contact to push from this stage to next stage
 * @param objectives the object containing every objective for each studied stat
 */
export function createLifecycleStage(code: string, value: string, total: number, toConvert: number, objectives: Objectives): LifecycleStage {

    const stage : LifecycleStage = {
        code: code,
        value: value,
        currentTotal: total,
        toConvert: toConvert,
        objective: -1,
        title: "",
        content: "",
    }

    if(code.localeCompare('hs_lifecyclestage_other_date')===0) {
        stage.objective = objectives.MONTHLY_CONTACTS_OBJ;
        stage.content = 'Nombre de contacts';
        stage.title = 'Contacts';
    }
    else if(code.localeCompare('hs_lifecyclestage_lead_date')===0) {
        stage.objective = objectives.MONTHLY_LEADS_OBJ;
        stage.content = 'Nombre de leads';
        stage.title = 'Leads';
    }
    else if(code.localeCompare('hs_lifecyclestage_opportunity_date')===0) {
        stage.objective = objectives.MONTHLY_PROSPECTS_OBJ;
        stage.content = 'Nombre de prospects';
        stage.title = 'Prospects';
    }
    else if(code.localeCompare('hs_lifecyclestage_subscriber_date')===0) {
        stage.objective = objectives.MONTHLY_ADVANCED_PROSPECTS_OBJ;
        stage.content = 'Nombre de prospects avancés';
        stage.title = 'Prospects avancés';
    }
    else if(code.localeCompare('hs_lifecyclestage_customer_date')===0) {
        stage.objective = objectives.MONTHLY_CLIENTS_OBJ;
        stage.content = 'Nombre de clients';
        stage.title = 'Clients';
    }

    return stage;
}