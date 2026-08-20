package io.venus.vega.api.v1;


import io.venus.vega.api.v1.resources.*;
import io.venus.vega.services.DpiDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@RestController
@RequiredArgsConstructor
public class DefenseAppController extends AbstractController implements DefenseAppApi {

    private final DpiDataService dpiDataService;


    @Override
    public ResponseEntity<RegisterDefenseAppResponseResource> defenseAppRegister(final RegisterDefenseAppRequestResource registerDefenseAppRequestResource) {
        return ResponseEntity
                .ok()
                .body(this.dpiDataService.defenseAppRegister(registerDefenseAppRequestResource));
    }

    @Override
    public ResponseEntity<Void> defenseAppUninstall(final Long appId) {
        this.dpiDataService.defenseAppUninstall(appId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> uploadDpiDataIDSResultAndAppSecStatus (final List<UploadDpiDataRequestResource> uploadDpiDataRequestResource) {
        this.dpiDataService.uploadDpiDataIDSResultAndAppSecStatus(uploadDpiDataRequestResource);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<InlineResponse200Resource> startSniffing(final StartSniffingRequestResource startSniffingRequestResource) {
        InlineResponse200Resource response = this.dpiDataService.startSniffing(startSniffingRequestResource);
        if ("Sniffing started".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    public ResponseEntity<InlineResponse200Resource> stopSniffing(final Long appId) {
        InlineResponse200Resource response = dpiDataService.stopSniffing(appId);

        if ("Successfully stopped".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    public ResponseEntity<InlineResponse200Resource> uninstallApp(final Long appId) {
        InlineResponse200Resource response = this.dpiDataService.uninstallApp(appId);

        if ("Successfully uninstalled".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    public ResponseEntity<Void> updateEnvInfo(final EnvInfoRequestResource envInfoRequestResource){
        this.dpiDataService.updateEnvInfo(envInfoRequestResource);
        return ResponseEntity.ok().build();
    }


}

