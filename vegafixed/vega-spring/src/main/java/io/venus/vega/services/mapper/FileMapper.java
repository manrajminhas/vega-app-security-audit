package io.venus.vega.services.mapper;

import io.venus.vega.api.v1.resources.FileListResource;
import io.venus.vega.data.entities.File;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FileMapper {

    FileListResource map(File file);
}
