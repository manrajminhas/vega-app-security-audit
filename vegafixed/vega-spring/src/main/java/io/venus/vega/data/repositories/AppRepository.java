package io.venus.vega.data.repositories;

import io.venus.vega.data.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppRepository extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {
    boolean existsByEnvHostname(String envHostname);
    Optional<Application> findById(Long id);
    List<Application> findByBelongById (Long UserId);
}