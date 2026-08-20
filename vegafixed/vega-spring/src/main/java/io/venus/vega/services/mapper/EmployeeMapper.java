package io.venus.vega.services.mapper;

import io.venus.vega.api.v1.resources.EmployeesListResource;
import io.venus.vega.data.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(target = "employeeId", source = "id")
    EmployeesListResource map(User user);
}
