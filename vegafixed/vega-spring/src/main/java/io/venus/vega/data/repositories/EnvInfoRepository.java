package io.venus.vega.data.repositories;

import io.venus.vega.data.entities.Application;
import io.venus.vega.data.entities.EnvInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface EnvInfoRepository extends JpaRepository<EnvInfo, Long>, JpaSpecificationExecutor<EnvInfo> {
    void deleteAllByApplication(Application application);
    Optional<EnvInfo> findByApplicationId(Long appId);
}
