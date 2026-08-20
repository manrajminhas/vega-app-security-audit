package io.venus.vega.services;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.venus.vega.api.v1.resources.*;

import io.venus.vega.data.entities.Application;
import io.venus.vega.data.repositories.AppRepository;
import io.venus.vega.services.exceptions.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Transactional
public class DefenseMetricsService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<Long, Set<WebSocketSession>> sessions = new ConcurrentHashMap<>();

    private final AppRepository appRepository;

    /**
     * Registers a WebSocket session for the specified application ID.
     * If no session set exists for the app, a new one is created.
     *
     * @param appId the ID of the application
     * @param session the WebSocket session to register
     */
    public void registerSession(Long appId, WebSocketSession session) {
        sessions.computeIfAbsent(appId, k -> ConcurrentHashMap.newKeySet()).add(session);
    }

    /**
     * Unregisters a WebSocket session from all application session sets.
     * Removes the session from every set it belongs to.
     *
     * @param session the WebSocket session to remove
     */
    public void unregisterSession(WebSocketSession session) {
        sessions.values().forEach(set -> set.remove(session));
    }

    /**
     * Sends the metrics for payload status, packet rate status, and protocols of a specific application
     * to all registered WebSocket sessions.
     * Only sessions that are open will receive the update.
     *
     * @param appId the ID of the application whose metrics are being sent
     * @param uploadDpiDataRequestResource the DPI data and IDS results used to build the metrics update
     */
    public void sendPeriodicDpiUpdates(Long appId, UploadDpiDataRequestResource uploadDpiDataRequestResource){

        Set<WebSocketSession> appSessions = sessions.get(appId);
        if (appSessions == null || appSessions.isEmpty()) return;
        DefenseClientMetricsUpdateResource update = buildUpdatedMetrics(appId, uploadDpiDataRequestResource);
        appSessions.forEach(session -> {
            if (session.isOpen()) {
                sendMetricsUpdate(update, session);
            }
        });
    }


    private DefenseClientMetricsUpdateResource  buildUpdatedMetrics(Long appId, UploadDpiDataRequestResource uploadDpiDataRequestResource) {

        Application app = appRepository.findById(appId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Application ID not found"));

        DefenseClientMetricsUpdateResource update = new DefenseClientMetricsUpdateResource();

        update.setSecStatus(SecurityStatusResource.fromValue(app.getSecurityStatus().getStatus()));

        DefenseClientMetricsUpdatePayloadStatsResource payloadStats = new DefenseClientMetricsUpdatePayloadStatsResource();
        DefenseClientMetricsUpdateRateStatsResource rateStats = new DefenseClientMetricsUpdateRateStatsResource();
        DefenseClientMetricsUpdateProtocolsResource  protocols = new DefenseClientMetricsUpdateProtocolsResource();


        payloadStats.setPayloadLength(uploadDpiDataRequestResource.getPayloadLength());
        payloadStats.setEntropy(uploadDpiDataRequestResource.getEntropy());
        payloadStats.setMin(uploadDpiDataRequestResource.getMin());
        payloadStats.setMax(uploadDpiDataRequestResource.getMax());
        payloadStats.setAvg(uploadDpiDataRequestResource.getAvg());

        rateStats.setSrate(uploadDpiDataRequestResource.getSrate());
        rateStats.setDrate(uploadDpiDataRequestResource.getDrate());
        rateStats.setFlowActiveTime(uploadDpiDataRequestResource.getFlowActiveTime());

        protocols.setCoap(uploadDpiDataRequestResource.getSumCoap());
        protocols.setHttp(uploadDpiDataRequestResource.getSumHttp());
        protocols.setHttps(uploadDpiDataRequestResource.getSumHttps());
        protocols.setDns(uploadDpiDataRequestResource.getSumDns());
        protocols.setTelnet(uploadDpiDataRequestResource.getSumTelnet());
        protocols.setSsh(uploadDpiDataRequestResource.getSumSsh());
        protocols.setTcp(uploadDpiDataRequestResource.getSumTcp());
        protocols.setUdp(uploadDpiDataRequestResource.getSumUdp());
        protocols.setDhcp(uploadDpiDataRequestResource.getSumDhcp());
        protocols.setArp(uploadDpiDataRequestResource.getSumArp());
        protocols.setIcmp(uploadDpiDataRequestResource.getSumIcmp());
        protocols.setIgmp(uploadDpiDataRequestResource.getSumIgmp());

        update.setTimestamp(uploadDpiDataRequestResource.getTs().toString());
        update.setPayloadStats(payloadStats);
        update.setRateStats(rateStats);
        update.setProtocols(protocols);
        update.setAppId(appId);

        return update;
    }

    private void sendMetricsUpdate(DefenseClientMetricsUpdateResource update, WebSocketSession session) {
        try {
            if (session.isOpen()) {
                String message = serializeDpiToJson(update);
                session.sendMessage(new TextMessage(message));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String serializeDpiToJson(DefenseClientMetricsUpdateResource update) throws JsonProcessingException {
        return objectMapper.writeValueAsString(update);
    }

}
