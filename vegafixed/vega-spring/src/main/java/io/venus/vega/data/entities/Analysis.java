package io.venus.vega.data.entities;

import io.venus.vega.data.entities.shared.AuditedEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

import javax.persistence.*;



@Entity
@Table(name = "analysis")
@Getter
@Setter
@NoArgsConstructor
@Builder
public class Analysis extends AuditedEntity {

    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @Column(name = "ts")
    private LocalDateTime ts;

    @Column(name = "Payload_Length")
    private Integer payloadLength;

    @Column(name = "Var_Payload")
    private Double varPayload;

    @Column(name = "Protocol_Type")
    private String protocolType;

    @Column(name = "Duration")
    private Double duration;

    @Column(name = "Entropy")
    private Double entropy;

    @Column(name = "Srate")
    private Double srate;

    @Column(name = "Drate")
    private Double drate;

    @Column(name = "fin_flag_number")
    private Integer finFlagNumber;

    @Column(name = "syn_flag_number")
    private Integer synFlagNumber;

    @Column(name = "rst_flag_number")
    private Integer rstFlagNumber;

    @Column(name = "psh_flag_number")
    private Integer pshFlagNumber;

    @Column(name = "ack_flag_number")
    private Integer ackFlagNumber;

    @Column(name = "urg_flag_number")
    private Integer urgFlagNumber;

    @Column(name = "ece_flag_number")
    private Integer eceFlagNumber;

    @Column(name = "cwr_flag_number")
    private Integer cwrFlagNumber;

    @Column(name = "ack_count")
    private Integer ackCount;

    @Column(name = "syn_count")
    private Integer synCount;

    @Column(name = "fin_count")
    private Integer finCount;

    @Column(name = "urg_count")
    private Integer urgCount;

    @Column(name = "rst_count")
    private Integer rstCount;

    @Column(name = "max_duration")
    private Double maxDuration;

    @Column(name = "min_duration")
    private Double minDuration;

    @Column(name = "sum_duration")
    private Double sumDuration;

    @Column(name = "average_duration")
    private Double averageDuration;

    @Column(name = "std_duration")
    private Double stdDuration;

    @Column(name = "SUM_CoAP")
    private Integer sumCoap;

    @Column(name = "SUM_HTTP")
    private Integer sumHttp;

    @Column(name = "SUM_HTTPS")
    private Integer sumHttps;

    @Column(name = "SUM_DNS")
    private Integer sumDns;

    @Column(name = "SUM_Telnet")
    private Integer sumTelnet;

    @Column(name = "SUM_SMTP")
    private Integer sumSmtp;

    @Column(name = "SUM_SSH")
    private Integer sumSsh;

    @Column(name = "SUM_IRC")
    private Integer sumIrc;

    @Column(name = "SUM_TCP")
    private Integer sumTcp;

    @Column(name = "SUM_UDP")
    private Integer sumUdp;

    @Column(name = "SUM_DHCP")
    private Integer sumDhcp;

    @Column(name = "SUM_ARP")
    private Integer sumArp;

    @Column(name = "SUM_ICMP")
    private Integer sumIcmp;

    @Column(name = "SUM_IGMP")
    private Integer sumIgmp;

    @Column(name = "SUM_IPv")
    private Integer sumIpv;

    @Column(name = "SUM_LLC")
    private Integer sumLlc;

    @Column(name = "Tot_sum")
    private Double totSum;

    @Column(name = "Min")
    private Double min;

    @Column(name = "Max")
    private Double max;

    @Column(name = "AVG")
    private Double avg;

    @Column(name = "Std")
    private Double std;

    @Column(name = "Tot_size")
    private Double totSize;

    @Column(name = "Number")
    private Double number;

    @Column(name = "Magnitue")
    private Double magnitude;

    @Column(name = "Radius")
    private Double radius;

    @Column(name = "Covariance")
    private Double covariance;

    @Column(name = "Variance")
    private Double variance;

    @Column(name = "Weight")
    private Double weight;

    @Column(name = "DS_status")
    private String dsStatus;

    @Column(name = "Fragments")
    private Integer fragments;

    @Column(name = "Sequence_number")
    private Integer sequenceNumber;

    @Column(name = "flow_idle_time")
    private Long flowIdleTime;

    @Column(name = "flow_active_time")
    private Long flowActiveTime;

    @Column(name="IDSResult")
    private Integer idsResult;

    // Constructor with all fields (except id, which is generated)
    public Analysis(Application application, LocalDateTime ts,Integer payloadLength, Double varPayload, String protocolType,
                    Double duration, Double entropy, Double srate, Double drate, Integer finFlagNumber,
                    Integer synFlagNumber, Integer rstFlagNumber, Integer pshFlagNumber, Integer ackFlagNumber,
                    Integer urgFlagNumber, Integer eceFlagNumber, Integer cwrFlagNumber, Integer ackCount,
                    Integer synCount, Integer finCount, Integer urgCount, Integer rstCount, Double maxDuration,
                    Double minDuration, Double sumDuration, Double averageDuration, Double stdDuration, Integer sumCoap,
                    Integer sumHttp, Integer sumHttps, Integer sumDns, Integer sumTelnet, Integer sumSmtp, Integer sumSsh, Integer sumIrc,
                    Integer sumTcp, Integer sumUdp, Integer sumDhcp, Integer sumArp, Integer sumIcmp, Integer sumIgmp, Integer sumIpv,
                    Integer sumLlc, Double totSum, Double min, Double max, Double avg, Double std, Double totSize,
                    Double number, Double magnitude, Double radius, Double covariance, Double variance, Double weight,
                    String dsStatus, Integer fragments, Integer sequenceNumber, Long flowIdleTime, Long flowActiveTim, Integer idsResult) {

        this.application = application;
        this.ts = ts;
        this.payloadLength = payloadLength;
        this.varPayload = varPayload;
        this.protocolType = protocolType;
        this.duration = duration;
        this.entropy = entropy;
        this.srate = srate;
        this.drate = drate;
        this.finFlagNumber = finFlagNumber;
        this.synFlagNumber = synFlagNumber;
        this.rstFlagNumber = rstFlagNumber;
        this.pshFlagNumber = pshFlagNumber;
        this.ackFlagNumber = ackFlagNumber;
        this.urgFlagNumber = urgFlagNumber;
        this.eceFlagNumber = eceFlagNumber;
        this.cwrFlagNumber = cwrFlagNumber;
        this.ackCount = ackCount;
        this.synCount = synCount;
        this.finCount = finCount;
        this.urgCount = urgCount;
        this.rstCount = rstCount;
        this.maxDuration = maxDuration;
        this.minDuration = minDuration;
        this.sumDuration = sumDuration;
        this.averageDuration = averageDuration;
        this.stdDuration = stdDuration;
        this.sumCoap = sumCoap;
        this.sumHttp = sumHttp;
        this.sumHttps = sumHttps;
        this.sumDns = sumDns;
        this.sumTelnet = sumTelnet;
        this.sumSmtp = sumSmtp;
        this.sumSsh = sumSsh;
        this.sumIrc = sumIrc;
        this.sumTcp = sumTcp;
        this.sumUdp = sumUdp;
        this.sumDhcp = sumDhcp;
        this.sumArp = sumArp;
        this.sumIcmp = sumIcmp;
        this.sumIgmp = sumIgmp;
        this.sumIpv = sumIpv;
        this.sumLlc = sumLlc;
        this.totSum = totSum;
        this.min = min;
        this.max = max;
        this.avg = avg;
        this.std = std;
        this.totSize = totSize;
        this.number = number;
        this.magnitude = magnitude;
        this.radius = radius;
        this.covariance = covariance;
        this.variance = variance;
        this.weight = weight;
        this.dsStatus = dsStatus;
        this.fragments = fragments;
        this.sequenceNumber = sequenceNumber;
        this.idsResult = idsResult;
        this.flowIdleTime=flowIdleTime;
        this.flowActiveTime=flowActiveTim;
    }
}
