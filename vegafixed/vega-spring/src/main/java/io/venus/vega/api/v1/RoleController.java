package io.venus.vega.api.v1;

import io.venus.vega.api.v1.resources.RoleResource;
import io.venus.vega.services.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RoleController extends AbstractController implements RolesApi {

    private final RoleService roleService;

    @Override
    public ResponseEntity<List<RoleResource>> getRolesForNewUsers() {
        return ResponseEntity.ok()
                .body(this.roleService.getRolesForNewUsers());
    }
}
