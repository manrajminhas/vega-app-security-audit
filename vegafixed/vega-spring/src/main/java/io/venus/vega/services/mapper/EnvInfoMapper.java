package io.venus.vega.services.mapper;

import io.venus.vega.api.v1.resources.EnvInfoRequestResource;
import io.venus.vega.data.entities.EnvInfo;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EnvInfoMapper {
    EnvInfo map(EnvInfoRequestResource resource);

    EnvInfoRequestResource map(EnvInfo envInfo);
    void updateEnvInfo(@MappingTarget EnvInfo target, EnvInfoRequestResource resource);
}
