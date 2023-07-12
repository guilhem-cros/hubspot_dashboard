import Period from "./period";

export default interface LifecycleCount{

    /**
     * lifecycle stage code
     */
    lifecycleStage: string,

    /**
     * Count of contacts the entered the stage for the given period
     */
    count: number,

    /**
     * Period in which the count of contacts entered the stage
     */
    period: Period|null
}

/**
 * Goes through a list of LifecycleCount and return the object matching the code of the stage
 * @param lifecycleCounts browsed list
 * @param lifecycleStage the code of the looked for stage
 */
export function getLifecycleCountByStage(lifecycleCounts: LifecycleCount[], lifecycleStage: string): LifecycleCount | null {
    for (let i = 0; i < lifecycleCounts.length; i++) {
        if (lifecycleCounts[i].lifecycleStage.localeCompare(lifecycleStage)===0) {
            return lifecycleCounts[i];
        }
    }
    return null; // Return null if no match is found
}

/**
 * Calculates the total count of contact in a lifecycle stage and the number of contacts that still
 * to concert to the next stage
 * @param lifecycleCounts list containing the current count of contact by stages. Must contain every possible lifecycle stage count (see ../constants/hubspotAPIValues)
 * @param lifecycleStageValue the name of the lifecycle stage for which convert count and total are calculated.
 * Must be one of the value presents in the map of lifecycleStagesCodesAndValues (../constants/hubspotAPIValues)
 */
export function getStageCurrentTotalAndToConvertCount(lifecycleCounts: LifecycleCount[], lifecycleStageValue: string): {currentTotal: number, toConvert: number}{

    const totals : number[] = [];
    let i = 0;

    let total = getLifecycleCountByStage(lifecycleCounts, "customer")!.count;
    totals.push(total);
    if(lifecycleStageValue.localeCompare("customer")===0){
        return {currentTotal: total, toConvert: 0};
    }

    total += getLifecycleCountByStage(lifecycleCounts, "subscriber")!.count;
    totals.push(total);
    i++;
    if(lifecycleStageValue.localeCompare("subscriber")===0){
        const toConvert = total - totals[i-1];
        return {currentTotal: total, toConvert: toConvert};
    }

    total += getLifecycleCountByStage(lifecycleCounts, "opportunity")!.count;
    totals.push(total);
    i++;
    if(lifecycleStageValue.localeCompare("opportunity")===0){
        const toConvert = total - totals[i-1];
        return {currentTotal: total, toConvert: toConvert}
    }

    total += getLifecycleCountByStage(lifecycleCounts, "lead")!.count;
    totals.push(total);
    i++;
    if(lifecycleStageValue.localeCompare("lead")===0){
        const toConvert = total - totals[i-1];
        return {currentTotal: total, toConvert: toConvert}
    }

    total += getLifecycleCountByStage(lifecycleCounts, "other")!.count;
    totals.push(total);
    i++;
    if(lifecycleStageValue.localeCompare("other")===0){
        const toConvert = total - totals[i-1];
        return {currentTotal: total, toConvert: toConvert}
    }

    else {
        return {currentTotal: -1, toConvert: -1}
    }
}