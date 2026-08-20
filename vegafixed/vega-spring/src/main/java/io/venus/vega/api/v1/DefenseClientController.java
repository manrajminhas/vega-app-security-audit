package io.venus.vega.api.v1;

import io.venus.vega.services.DefenseClientService;
import io.venus.vega.api.v1.resources.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class DefenseClientController extends AbstractController implements DefenseClientApi{
    private final DefenseClientService defenseClientService;


    @Override
    public ResponseEntity<List<RegisterDefenseClientResponseResource>> defenseClientRegister (Long userId) {
        return ResponseEntity
                .ok()
                .body(this.defenseClientService.defenseClientRegister(userId));
    }

    @Override
    public ResponseEntity<List<AdminDefenseClientResource>> getAdminDefenseClientInfo(){
        return ResponseEntity
                .ok()
                .body(this.defenseClientService.getAdminDefenseClientInfo());
    }

    @Value("${defense.app.path}")
    private String defenseAppPath;

    @Override
    public ResponseEntity<Resource> downloadDefenseAppZip(){
        try {
            Resource resource = defenseClientService.downloadDefenseAppZip();
            File file = new File(defenseAppPath);
            long contentLength = file.length();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=vegaDefenseApp.tar.gz")
                    .contentLength(contentLength)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
