const proxyBaseURL = process.env.REACT_APP_PROXY_BASE_URL;
const lifecycleStagesCountEndPoint = proxyBaseURL + '/contacts/lifecyclestages/count/by/months';
const countEndPoint = proxyBaseURL + '/contacts/lifecyclestages/total/count/';
const contractsEndPoint = proxyBaseURL + '/deals/by/stage'
const contactsByStageEndPoint = proxyBaseURL + '/contacts/by/lifecyclestage';

export {lifecycleStagesCountEndPoint, countEndPoint, contractsEndPoint, contactsByStageEndPoint}