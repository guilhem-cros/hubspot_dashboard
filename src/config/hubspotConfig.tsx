import LifecycleCount from "../interfaces/lifecycleCount";
import axios from "axios";
import {lifecycleStagesCountEndPoint} from "../constants/endpoints";

async function getLifecycleStages(): Promise<LifecycleCount[]> {
    try {
        const response = await axios.get(lifecycleStagesCountEndPoint, {
            headers: {
                Authorization: 'Bearer ' + process.env.REACT_APP_HUBSPOT_PRIVATE_APP_TOKEN,
            },
        });

        const lifecycleStages: LifecycleCount[] = response.data.results;
        return lifecycleStages;
    } catch (error) {
        console.error('Error retrieving lifecycle stages:', error);
        return [];
    }
}


export default getLifecycleStages;