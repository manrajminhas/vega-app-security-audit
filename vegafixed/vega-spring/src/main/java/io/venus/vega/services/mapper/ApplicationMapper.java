package io.venus.vega.services.mapper;

import io.venus.vega.api.v1.resources.RegisterDefenseAppResponseResource;
import io.venus.vega.api.v1.resources.RegisterDefenseAppRequestResource;
import io.venus.vega.data.entities.Application;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface ApplicationMapper {
    RegisterDefenseAppResponseResource  map(Application  application);

    Application map(RegisterDefenseAppRequestResource registerAppResource);
}