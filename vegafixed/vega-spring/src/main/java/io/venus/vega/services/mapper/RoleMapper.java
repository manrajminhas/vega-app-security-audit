package io.venus.vega.services.mapper;

import io.venus.vega.api.v1.resources.RoleResource;
import io.venus.vega.data.entities.Role;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleResource map(Role role);

    List<RoleResource> map(List<Role> roles);
}
