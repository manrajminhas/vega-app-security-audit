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
public class DefenseSecStatusService {
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
     * Sends the updated security status of a specific application to all registered WebSocket sessions.
     * Only sessions that are open will receive the update.
     *
     * @param appId the ID of the application whose security status is being sent
     * @throws BusinessException if the application ID is not found in the database
     */
    public void sendPeriodicSecStatusUpdates(Long appId){
        Application app = appRepository.findById(appId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Application ID not found"));
        DefenseClientSecStatusUpdateResource update = new DefenseClientSecStatusUpdateResource();
        update.setAppId(appId);
        update.setSecStatus(SecurityStatusResource.fromValue(app.getSecurityStatus().getStatus()));

        Set<WebSocketSession> appSessions = sessions.get(appId);
        if (appSessions == null || appSessions.isEmpty()) return;
        appSessions.forEach(session -> {
            if (session.isOpen()) {
                sendSecStatusUpdate(update, session);
            }
        });
    }
    private void sendSecStatusUpdate(DefenseClientSecStatusUpdateResource update, WebSocketSession session) {
        try {
            if (session.isOpen()) {
                String message = serializeSecStatusToJson(update);
                session.sendMessage(new TextMessage(message));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String serializeSecStatusToJson(DefenseClientSecStatusUpdateResource update) throws JsonProcessingException {
        return objectMapper.writeValueAsString(update);
    }

}
