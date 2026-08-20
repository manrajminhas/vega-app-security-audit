import { useState, useEffect, useRef, useContext } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import DefenseAppLayout from '../templates/DefenseAppLayout';
import DefenseClientCards from '../UI/organisms/DefenseClientCards';
import { fetchDefenseRegisterInfo, 
        getCurrentUserInfo, 
        startMonitoring, 
        openWebSocketMetricsConnection, 
        stopMonitoring, 
        uninstallDefenseApp, 
        getDefenseClientApp, 
        openWebSocketSecStatusConnection } from '../../service/DefenseService';
import DefenseAdminCards from '../UI/organisms/DefenseAdminCards';
import { UserContext } from '../../auth/UserProvider';
import  renderStatusMessage  from '../UI/molecules/StatusMessage';
import { useToast } from '../../context/ToastContext';

const DefenseAppDashboard = () => {
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === "ADMIN";
  const [envInfo, setEnvInfo] = useState([]);
  const [envStream, setEnvStream] = useState([]);
  const [adminInfo, setAdminInfo] = useState([]);
  const [adminStreams, setAdminStreams] = useState([]);
  const [startedEnvs, setStartedEnvs] = useState(new Set());
  const [userLoading, setUserLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);

  const [userFetchFailed, setUserFetchFailed] = useState(false);
  const [adminFetchFailed, setAdminFetchFailed] = useState(false);
  const [selectedIfaces, setSelectedIfaces] = useState({});
  const [selectedIds, setSelectedIds] = useState({});
  const [resetKeys, setResetKeys] = useState({});
  const wsRefs = useRef({});
  const { showToast } = useToast();

  const getToken = () => localStorage.getItem('jwt') || (() => { throw new Error('No auth token'); })();
  
  const getDefaultMetrics = () => ({
    timestamp: null,
    payloadStats: {
      payloadLength: null,
      payloadentropy: null,
      packetmin: null,
      packetmax: null,
      packetavg: null,
    },
    rateStats: {
      srate: null,
      drate: null,
      flowActiveTime: null,
    },
    protocols: {
      coap: null,
      http: null,
      https: null,
      dns: null,
      telnet: null,
      ssh: null,
      tcp: null,
      udp: null,
      dhcp: null,
      arp: null,
      icmp: null,
      igmp: null,
    },
  });

  const mapDefenseMetricsData = (defenseData) => ({
    envInfo: defenseData.map(env => ({
      appId: env.appId,
      name: env.envHostname,
      ip: env.hostIp,
      iface: env.iface || [],
      ids: env.idsOption || [],
      secStatus: env.secStatus.charAt(0).toUpperCase() + env.secStatus.slice(1),
    })),
    envStream: defenseData.map(env => ({
      appId: env.appId,
      secStatus: env.secStatus.charAt(0).toUpperCase() + env.secStatus.slice(1),
      metrics: getDefaultMetrics(),
    })),
  });

  const resetMetricsForApp = (appId) => {
    setEnvStream(prev => {
      const newStream = prev.map(env => {
        if (env.appId === appId) {
          return {
            appId: env.appId,
            secStatus: env.secStatus,
            metrics: getDefaultMetrics(),
          };
        }
        return env;
      });
      return newStream;
    });
  };

  const mapAdminData = (adminClientData) => ({
    adminInfo: adminClientData.map(adminInfo => ({
      appId: adminInfo.appId,
      userEmail: adminInfo.userEmail,
      userName: adminInfo.userName,
      name: adminInfo.envHostname,
      ip: adminInfo.hostIp,
      secStatus: adminInfo.secStatus.charAt(0).toUpperCase() + adminInfo.secStatus.slice(1),
    })),
    adminStreams: adminClientData.map(({ appId, secStatus }) => ({
      appId,
      secStatus: secStatus.charAt(0).toUpperCase() + secStatus.slice(1),
    })),
  });

  useEffect(() => {
    const loadUserDefenseData = async () => {
      try {
        const token = getToken();
        const userInfo = await getCurrentUserInfo(token);
        const defenseData = await fetchDefenseRegisterInfo(userInfo.id, token);
        const { envInfo, envStream } = mapDefenseMetricsData(defenseData);
        setEnvInfo(envInfo);
        setEnvStream(envStream);
        setUserFetchFailed(false);
      } catch (err) {
        console.warn('Failed to load defense register info:', err);
        setUserFetchFailed(true);
      } finally {
        setUserLoading(false);
      }
    };

    loadUserDefenseData();
  }, []);

  useEffect(() => {
    const loadAdminDefenseClientInfo = async () => {
      if (!isAdmin) return;
      try {
        const token = getToken();
        const adminClientData = await getDefenseClientApp(token);
        const { adminInfo, adminStreams } = mapAdminData(adminClientData);
        setAdminInfo(adminInfo);
        setAdminStreams(adminStreams);

        for (const app of adminInfo) {
          openWebSocketSecStatusConnection(app.appId, (wsData) => {
            setAdminStreams(prev => {
              const newStreams = prev.map(item => {
                if (item.appId === wsData.appId) {
                  return {
                    appId: item.appId,
                    secStatus: wsData.secStatus.charAt(0).toUpperCase() + wsData.secStatus.slice(1),
                  };
                }
                return item;
              });
              return newStreams;
            });
          }, token);
        }
        setAdminFetchFailed(false);
      } catch (err) {
        console.warn('Failed to load admin defense client info:', err);
        setAdminFetchFailed(true);
      } finally {
        setAdminLoading(false);
      }
    };

    loadAdminDefenseClientInfo();
  }, [isAdmin]);


  const handleIfaceChange = (appId, value) => {
    setSelectedIfaces(prev => {
      const newIfaces = {};
      for (const key in prev) {
        newIfaces[key] = prev[key];
      }
      newIfaces[appId] = value;
      return newIfaces;
    });
  };

  const handleIdsChange = (appId, value) => {
    setSelectedIds(prev => {
      const newIds = {};
      for (const key in prev) {
        newIds[key] = prev[key];
      }
      newIds[appId] = value;
      return newIds;
    });
  };

  const resetGraphForApp = (appId) => {
    setResetKeys(prev => {
      const newKeys = {};
      for (const key in prev) {
        newKeys[key] = prev[key];
      }
      newKeys[appId] = (prev[appId] || 0) + 1;
      return newKeys;
    });
  };

  const handleStart = async (appId) => {
    try {
      const token = getToken();
      const data = {
        appId,
        iface: selectedIfaces[appId],
        ids_mode: selectedIds[appId],
      };
      resetMetricsForApp(appId);
      resetGraphForApp(appId);
      await startMonitoring(token, data);
      showToast('success', 'Defense app started successfully');
      setStartedEnvs(prev => {
        const newSet = new Set();
        for (const id of prev) {
          newSet.add(id);
        }
        newSet.add(appId);
        return newSet;
      });

      const ws = openWebSocketMetricsConnection(appId, (wsData) => {
        setEnvStream(prev => {
          const newStream = prev.map(env => {
            if (env.appId === appId) {
              return {
                appId: wsData.appId,
                timestamp: wsData.timestamp,
                secStatus: wsData.secStatus ? wsData.secStatus.charAt(0).toUpperCase() + wsData.secStatus.slice(1) : null,
                metrics: {
                  payloadStats: {
                    payloadLength: wsData.payloadStats.payloadLength,
                    payloadentropy: wsData.payloadStats.entropy,
                    packetmin: wsData.payloadStats.min,
                    packetmax: wsData.payloadStats.max,
                    packetavg: wsData.payloadStats.avg,
                  },
                  rateStats: {
                    srate: wsData.rateStats.srate,
                    drate: wsData.rateStats.drate,
                    flowActiveTime: wsData.rateStats.flowActiveTime,
                  },
                  protocols: {
                    coap: wsData.protocols.coap,
                    http: wsData.protocols.http,
                    https: wsData.protocols.https,
                    dns: wsData.protocols.dns,
                    telnet: wsData.protocols.telnet,
                    ssh: wsData.protocols.ssh,
                    tcp: wsData.protocols.tcp,
                    udp: wsData.protocols.udp,
                    dhcp: wsData.protocols.dhcp,
                    arp: wsData.protocols.arp,
                    icmp: wsData.protocols.icmp,
                    igmp: wsData.protocols.igmp,
                  },
                },
              };
            }
            return env;
          });
          return newStream;
        });
      }, token);
      wsRefs.current[appId] = ws;
    } catch (err) {
      showToast('error', 'Failed to start defense app');
    }
  };

  const handleStop = async (appId) => {
    try {
      const token = getToken();
      await stopMonitoring(token, appId);
      showToast('success', 'Defense app stopped successfully');

      if (wsRefs.current[appId]) {
        wsRefs.current[appId].close();
        delete wsRefs.current[appId];
      }

      setSelectedIfaces(prev => {
        const newIfaces = {};
        for (const key in prev) {
          if (key !== appId) {
            newIfaces[key] = prev[key];
          }
        }
        newIfaces[appId] = '';
        return newIfaces;
      });

      setSelectedIds(prev => {
        const newIds = {};
        for (const key in prev) {
          if (key !== appId) {
            newIds[key] = prev[key];
          }
        }
        newIds[appId] = '';
        return newIds;
      });

      setStartedEnvs(prev => {
        const newSet = new Set();
        for (const id of prev) {
          if (id !== appId) {
            newSet.add(id);
          }
        }
        return newSet;
      });
    } catch (err) {
      console.error('Failed to stop monitoring:', err);
      showToast('error', 'Failed to stop defense app');
    }
  };

  const handleUninstall = async (appId) => {
    try {
      const token = getToken();
      await uninstallDefenseApp(token, appId);
      showToast('success', 'Defense app uninstalled successfully');
    } catch (err) {
      console.error('Failed to uninstall defense app:', err);
      showToast('error', 'Failed to uninstall defense app');
    }
  };

  return (
    <DefenseAppLayout>
      {isAdmin && (
        <Container>
          <h3 className="mb-4">Defense Admin Dashboard</h3>
          {adminLoading && <div>Loading defense data...</div>}

          {!adminLoading && (adminFetchFailed || adminInfo.length === 0) && (
            <Alert variant="info" className="text-center">
              No defense application is registered yet.
            </Alert>
          )}

          {adminInfo.length > 0 && (
            <Row xs={1} className="g-4 mb-4">
              {adminInfo.map(info => (
                <Col key={info.appId}>
                  <DefenseAdminCards info={info} stream={adminStreams.find(s => s.appId === info.appId) || {}} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      )}
      <Container>
        <h3 className="mb-4">Defense Client Dashboard</h3>
        {userLoading && <div>Loading defense data...</div>}

        {!userLoading && (userFetchFailed || envInfo.length === 0) && (
          <Alert variant="info" className="text-center">
            No defense app is registered for this account.
          </Alert>
        )}
        {!userLoading && !userFetchFailed && envInfo.length > 0 && (
          <Row xs={1} className="g-4">
            {envInfo.map(info => (
              <DefenseClientCards
                key={info.appId}
                info={info}
                stream={envStream.find(s => s.appId === info.appId) || {}}
                isStarted={startedEnvs.has(info.appId)}
                selectedIfaces={selectedIfaces}
                selectedIds={selectedIds}
                resetKeys={resetKeys}
                handleIfaceChange={handleIfaceChange}
                handleIdsChange={handleIdsChange}
                handleStart={handleStart}
                handleStop={handleStop}
                handleUninstall={handleUninstall}
              />
            ))}
          </Row>
        )}
      </Container>
    </DefenseAppLayout>
  );
};

export default DefenseAppDashboard;