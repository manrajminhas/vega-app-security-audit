import { doPost,doGet, BASE_API_URL,doGetDownloadZip} from './BaseAPI.js';

export function fetchDefenseRegisterInfo (userId,token){
    return doPost(`${BASE_API_URL}/defenseClient/${userId}/registerInfo`,token);
}

export function getCurrentUserInfo (token){
    return doGet(`${BASE_API_URL}/users/current`, token);
}

export function startMonitoring (token, data){

    return doPost(`${BASE_API_URL}/defenseApp/startSniffing`,token,data)
}

export function stopMonitoring(token,appId){
  return doPost(`${BASE_API_URL}/defenseApp/${appId}/stopSniffing`,token)
}

export function uninstallDefenseApp(token,appId){
  return doPost(`${BASE_API_URL}/defenseApp/${appId}/uninstallApp`,token)
}

export function getDefenseClientApp(token){
  return doGet(`${BASE_API_URL}/defenseClient/adminDefenseClientInfo`, token);
}

export function downloadDefenseAppZip(token) {
  return doGetDownloadZip(`${BASE_API_URL}/defenseClient/downloadDefenseAppZip`, token);
}

function openWebSocketConnection(path, appId, onMessage, token) {
  const wsBase = BASE_API_URL.replace('http', 'ws');
  const ws = new WebSocket(`${wsBase}${path}/${appId}?token=${encodeURIComponent(token)}`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error(`Error parsing WebSocket ${path} message:`, err);
    }
  };

  ws.onerror = (err) => {
    console.error(`WebSocket ${path} error:`, err);
  };

  ws.onclose = () => {
    console.log(`WebSocket ${path} closed for env:`, appId);
  };

  return ws;
}

export function openWebSocketSecStatusConnection(appId, onMessage, token) {
  return openWebSocketConnection('/ws/defenseClient/SecStatus', appId, onMessage, token);
}

export function openWebSocketMetricsConnection(appId, onMessage, token) {
  return openWebSocketConnection('/ws/defenseClient/Metrics', appId, onMessage, token);
}