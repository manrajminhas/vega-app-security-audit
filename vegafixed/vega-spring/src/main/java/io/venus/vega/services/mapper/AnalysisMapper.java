package io.venus.vega.services.mapper;

import io.venus.vega.api.v1.resources.UploadDpiDataRequestResource;
import io.venus.vega.data.entities.Analysis;
import org.mapstruct.Mapper;


import java.util.List;

@Mapper(componentModel = "spring")
public interface AnalysisMapper {

    UploadDpiDataRequestResource map(Analysis analysis);

    Analysis map(UploadDpiDataRequestResource resource);


    List<Analysis> mapToEntityList(List<UploadDpiDataRequestResource> resources);
}
