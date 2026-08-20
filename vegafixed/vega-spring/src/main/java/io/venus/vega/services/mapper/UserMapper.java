package io.venus.vega.services.mapper;

import io.venus.vega.api.v1.resources.RegisterUserRequestResource;
import io.venus.vega.api.v1.resources.UserDetailsResource;
import io.venus.vega.api.v1.resources.UserListResource;
import io.venus.vega.data.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDetailsResource map(User user);

    UserListResource mapToUserList(User user);

    @Mapping(target = "role", ignore = true)
    @Mapping(target = "password", ignore = true)
    User map(RegisterUserRequestResource registerResource);
}
