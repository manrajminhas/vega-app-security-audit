package io.venus.vega.api.v1;

import io.venus.vega.services.DefenseSecStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Objects;


@RequiredArgsConstructor
public class DefenseSecStatusController extends TextWebSocketHandler{
    private final DefenseSecStatusService defenseSecStatusService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String appIdStr = extractAppId(session);
        if (Objects.isNull(appIdStr)) return;
        Long appId = Long.parseLong(appIdStr);

        this.defenseSecStatusService.registerSession(appId, session);
    }
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        this.defenseSecStatusService.unregisterSession(session);
    }

    private String extractAppId(WebSocketSession session) {
        String path = Objects.requireNonNull(session.getUri()).getPath();
        String[] segments = path.split("/");
        if (segments.length == 0) return null;
        return segments[segments.length - 1];
    }

}

