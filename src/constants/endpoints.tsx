const proxyBaseURL = "https://encouraging-petticoat-frog.cyclic.app/"
const lifecycleStagesCountEndPoint = proxyBaseURL + '/contacts/lifecyclestages/count/by/months';
const countEndPoint = proxyBaseURL + '/contacts/lifecyclestages/total/count/';
const contractsEndPoint = proxyBaseURL + '/deals/by/stage'
const contactsByStageEndPoint = proxyBaseURL + '/contacts/by/lifecyclestage';

export {lifecycleStagesCountEndPoint, countEndPoint, contractsEndPoint, contactsByStageEndPoint}