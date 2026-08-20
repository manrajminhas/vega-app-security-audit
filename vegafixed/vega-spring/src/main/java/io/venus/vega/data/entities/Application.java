package io.venus.vega.data.entities;


import io.venus.vega.data.entities.enums.SecurityStatus;
import io.venus.vega.data.entities.shared.AuditedEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import javax.persistence.*;



@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@Builder
public class Application extends AuditedEntity {

    @ManyToOne
    @JoinColumn(name = "belong_by_user_id")
    private User belongBy;


    @Column(name = "env_hostname")
    private String envHostname;

    @Enumerated(EnumType.STRING)
    @Column(name = "security_status")
    private SecurityStatus securityStatus = SecurityStatus.PENDING;


    public Application(User belongBy, String envHostname, SecurityStatus securityStatus) {
        this.belongBy = belongBy;
        this.envHostname = envHostname;
        this.securityStatus = securityStatus;
    }
}