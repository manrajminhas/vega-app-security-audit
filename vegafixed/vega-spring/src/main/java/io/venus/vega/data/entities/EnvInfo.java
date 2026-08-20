package io.venus.vega.data.entities;

import com.sun.istack.NotNull;
import io.venus.vega.data.entities.shared.AuditedEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "envInfo")
@Getter
@Setter
@NoArgsConstructor
@Builder
public class EnvInfo extends AuditedEntity {

    @NotNull
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @NotBlank
    @Column(name="host_ip")
    private String hostIp;


    @ElementCollection
    @CollectionTable(name = "env_interfaces", joinColumns = @JoinColumn(name = "env_id"))
    @Column(name = "interface")
    private List<String> iface;


    public EnvInfo(Application application, String hostIp, List<String> iface) {
        this.application = application;
        this.hostIp = hostIp;
        this.iface = iface;
    }
}



