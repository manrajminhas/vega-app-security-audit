package io.venus.vega.config;



import io.venus.vega.api.v1.DefenseMetricsController;
import io.venus.vega.api.v1.DefenseSecStatusController;
import io.venus.vega.services.DefenseMetricsService;
import io.venus.vega.services.DefenseSecStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {
    private final DefenseMetricsService defenseMetricsService;
    private final DefenseSecStatusService defenseSecStatusService;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(defenseMetricsHandler(), "/api/v1/ws/defenseClient/Metrics/{appId}")
                .setAllowedOrigins("*");
        registry.addHandler(defenseSecStatusHandler(), "/api/v1/ws/defenseClient/SecStatus/{appId}")
                .setAllowedOrigins("*");
    }

    @Bean
    public WebSocketHandler defenseMetricsHandler() {
        return new DefenseMetricsController(defenseMetricsService);
    }

    @Bean
    public WebSocketHandler defenseSecStatusHandler() {return new DefenseSecStatusController(defenseSecStatusService);}

}