
/**
 * Map containing the "code" of each lifecycle stage, as it's declared in hubspot api
 * and its associated value, corresponding to the name of the stage
 */
const lifecycleStagesCodesAndValues = new Map<string, string>();

lifecycleStagesCodesAndValues.set("hs_lifecyclestage_other_date", "other");
lifecycleStagesCodesAndValues.set("hs_lifecyclestage_lead_date", "lead");
lifecycleStagesCodesAndValues.set("hs_lifecyclestage_opportunity_date", "opportunity");
lifecycleStagesCodesAndValues.set("hs_lifecyclestage_subscriber_date", "subscriber");
lifecycleStagesCodesAndValues.set("hs_lifecyclestage_customer_date", "customer");

const contractsStagesValues = new Map<string, string>();

contractsStagesValues.set("sent", "contractsent");
contractsStagesValues.set("won", "closedwon");


export {lifecycleStagesCodesAndValues, contractsStagesValues}