package io.venus.vega.services.support;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class DefenseMetricsUpdate {
    private LocalDateTime timestamp;
    private PayloadStats payloadStats;
    private RateStats rateStats;
    private Protocols protocols;


    @Getter
    @Setter
    @NoArgsConstructor
    public static class PayloadStats {
        private Integer payloadLength;
        private Double entropy;
        private Double min;
        private Double max;
        private Double avg;

    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class RateStats {
        private Double srate;
        private Double drate;
        private Long flowActiveTime;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Protocols {
        private Integer coap;
        private Integer http;
        private Integer https;
        private Integer dns;
        private Integer telnet;
        private Integer ssh;
        private Integer tcp;
        private Integer udp;
        private Integer dhcp;
        private Integer arp;
        private Integer icmp;
        private Integer igmp;

    }
}
