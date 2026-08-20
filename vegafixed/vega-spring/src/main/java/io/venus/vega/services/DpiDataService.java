package io.venus.vega.services;


import io.venus.vega.api.v1.resources.*;
import io.venus.vega.data.entities.Analysis;
import io.venus.vega.data.entities.Application;
import io.venus.vega.data.entities.EnvInfo;
import io.venus.vega.data.entities.User;
import io.venus.vega.data.entities.enums.SecurityStatus;
import io.venus.vega.data.repositories.AnalysisRepository;
import io.venus.vega.data.repositories.EnvInfoRepository;
import io.venus.vega.data.repositories.UserRepository;
import io.venus.vega.services.exceptions.BusinessException;
import io.venus.vega.services.mapper.AnalysisMapper;
import io.venus.vega.services.mapper.ApplicationMapper;
import io.venus.vega.services.mapper.EnvInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import io.venus.vega.data.repositories.AppRepository;

import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Optional;
import static org.reflections.Reflections.log;

@Service
@RequiredArgsConstructor
@Transactional
public class DpiDataService {
    private final ApplicationMapper applicationMapper;
    private final AppRepository appRepository;
    private final UserRepository userRepository;
    private final AnalysisRepository analysisRepository;
    private final AnalysisMapper analysisMapper;
    private final EnvInfoMapper envInfoMapper;
    private final EnvInfoRepository envInfoRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final DefenseMetricsService  defenseMetricsService;
    private final DefenseSecStatusService defenseSecStatusService;

    /**
     * Updates the environment information (host IP and network interface) and saves it in the database.
     *
     * @param envInfoRequestResource the environment info details to update
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','USER')")
    public void updateEnvInfo (final EnvInfoRequestResource envInfoRequestResource){
        try {
            EnvInfo envInfo;
            Optional<EnvInfo> existingEnvOpt = getEnvInfo(envInfoRequestResource.getAppId());
            if(existingEnvOpt.isPresent()){
                envInfo = existingEnvOpt.get();
                envInfoMapper.updateEnvInfo(envInfo, envInfoRequestResource);
            }
            else{
                envInfo = envInfoMapper.map(envInfoRequestResource);
                Application app = appRepository.findById(envInfoRequestResource.getAppId())
                        .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Application ID not found"));
                envInfo.setApplication(app);
            }
            envInfoRepository.save(envInfo);
        }
        catch (final Exception e) {
            log.error("Error saving data", e);
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Failed to store EnvInfo data."+e.getMessage());
        }

    }

    private Optional<EnvInfo> getEnvInfo(final Long appId){
        return envInfoRepository.findByApplicationId(appId);
    }

    /**
     * Sends a start-sniffing request to the Python Defense App Flask server at the stored host IP and port 5000
     * to initiate sniffing on the defense app side.
     *
     * @param startSniffingRequestResource the request containing the application ID and other parameters
     * @return InlineResponse200Resource containing the status of the operation
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','USER')")
    public InlineResponse200Resource startSniffing(final StartSniffingRequestResource startSniffingRequestResource) {
        InlineResponse200Resource responseBody = new InlineResponse200Resource();
        Optional<EnvInfo> envHostOpt = this.getEnvInfo(startSniffingRequestResource.getAppId());

        if (envHostOpt.isEmpty()) {
            throw new RuntimeException("EnvInfo not found for appId: " + startSniffingRequestResource.getAppId());
        }
        EnvInfo envHost = envHostOpt.get();
        String appUrl = "http://" + envHost.getHostIp() + ":5000";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<StartSniffingRequestResource> entity = new HttpEntity<>(startSniffingRequestResource, headers);
            restTemplate.postForEntity(appUrl + "/start", entity, Void.class);
            responseBody.setStatus("Sniffing started");
        } catch (Exception e) {
            responseBody.setStatus("Failed to start sniffing");
        }

        return responseBody;
    }

    /**
     * Sends a stop-sniffing request to the Python Defense App Flask server at the stored host IP and port 5000
     * to stop sniffing on the defense app side.
     *
     * @param appId the ID of the application to stop sniffing for
     * @return InlineResponse200Resource containing the status of the operation
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','USER')")
    public InlineResponse200Resource stopSniffing(final Long appId) {
        InlineResponse200Resource responseBody = new InlineResponse200Resource();
        Optional<EnvInfo> envHostOpt = this.getEnvInfo(appId);
        if (envHostOpt.isEmpty()) {
            throw new RuntimeException("EnvInfo not found for appId: " + appId);
        }
        EnvInfo envHost = envHostOpt.get();
        String appUrl = "http://" + envHost.getHostIp() + ":5000";

        try {
            restTemplate.postForEntity(appUrl + "/stop", null, Void.class);
            responseBody.setStatus("Successfully stopped");
        } catch (Exception e) {
            responseBody.setStatus("Failed to stop");
        }
        return responseBody;
    }
    /**
     * Sends an uninstall request to the Python Defense App Flask server at the stored host IP and port 5000
     * to remove the stored app registration, environment, and analysis information.
     *
     * @param appId the ID of the application to uninstall
     * @return InlineResponse200Resource containing the status of the operation
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','USER')")
    public InlineResponse200Resource uninstallApp(final Long appId) {
        InlineResponse200Resource responseBody = new InlineResponse200Resource();
        Optional<EnvInfo> envHostOpt = this.getEnvInfo(appId);
        if (envHostOpt.isEmpty()) {
            throw new RuntimeException("EnvInfo not found for appId: " + appId);
        }
        EnvInfo envHost = envHostOpt.get();
        String appUrl = "http://" + envHost.getHostIp() + ":5000";
        try {
            restTemplate.postForEntity(appUrl + "/uninstall", null, Void.class);
            responseBody.setStatus("Successfully uninstalled");
        } catch (Exception e) {
            responseBody.setStatus("Failed to uninstall");
        }
        return responseBody;
    }

    /**
     * Registers a deployed defense app and saves the application data to the database.
     *
     * @param registerDefenseAppRequestResource the request containing app registration data
     * @return RegisterDefenseAppResponseResource containing the newly created app ID
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','USER')")
    public RegisterDefenseAppResponseResource defenseAppRegister (final RegisterDefenseAppRequestResource registerDefenseAppRequestResource) {

        validateHostnameNotExists(registerDefenseAppRequestResource.getEnvHostname());
        final var user = this.userRepository.findByEmail(registerDefenseAppRequestResource.getEmail()).get();
        final Application defenseApp = constructApplication(registerDefenseAppRequestResource, user);
        this.appRepository.save(defenseApp);
        Long newAppId = defenseApp.getId();

        return new RegisterDefenseAppResponseResource()
                .appId(newAppId);
    }

    private void validateHostnameNotExists(final String hostname) {
        if (appRepository.existsByEnvHostname(hostname)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "An application with this hostname already exists.");
        }
    }

    private Application constructApplication(final RegisterDefenseAppRequestResource appRequestResource, final User user) {
        final var app = this.applicationMapper.map(appRequestResource);
        app.setBelongBy(user);
        app.setSecurityStatus(SecurityStatus.PENDING);
        return app;
    }

    /**
     * Uninstalls a registered defense app and removes all relevant data from the database.
     *
     * @param appId the ID of the application to uninstall
     * @throws BusinessException if the application ID is null or not found
     */

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','USER')")
    public void defenseAppUninstall(Long appId) {
        if (appId == null) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Application ID must not be null");
        }

        Application app = appRepository.findById(appId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Application ID not found"));

        analysisRepository.deleteAllByApplication(app);
        envInfoRepository.deleteAllByApplication(app);
        appRepository.delete(app);
    }

    /**
     * Uploads sniffed DPI data and IDS results to the database in real-time and triggers update functions
     * to send data to the frontend for visualization. Specifically, it calls
     * {@code sendPeriodicDpiUpdates} and {@code sendPeriodicSecStatusUpdates} for the corresponding application.
     *
     * @param data the list of DPI data and IDS results to upload; all entries must belong to the same application
     * @throws BusinessException if storing the data or sending updates to the frontend fails
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','USER')")
    public void uploadDpiDataIDSResultAndAppSecStatus (final List<UploadDpiDataRequestResource> data) {
        checkInputDpiData(data);
        try {
            List<Analysis> analysisList = analysisMapper.mapToEntityList(data);
            Long appId = data.get(0).getAppId(); // One API call only contains one unique AppId
            Application app = appRepository.findById(appId)
                    .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Application ID not found"));

            for (Analysis analysis : analysisList) {
                analysis.setApplication(app);
            }

            analysisRepository.saveAll(analysisList);
            // Update the application security status
            updateAppSecStatus(data);
        } catch (final Exception e) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Failed to store Dpi data.");
        }
        try{
            this.defenseMetricsService.sendPeriodicDpiUpdates(data.get(0).getAppId(), data.get(0));
            this.defenseSecStatusService.sendPeriodicSecStatusUpdates(data.get(0).getAppId());
        } catch (final Exception e) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Failed to send data to frontend.");
        }
    }



    private void updateAppSecStatus (final List<UploadDpiDataRequestResource> data){
        boolean attackedFound = false;
        boolean hasNonNullResult = false;
        Long appId=null;
        Application app = null;

        for (UploadDpiDataRequestResource item : data) {
            appId = item.getAppId();
            Integer result = item.getIdsResult();
            if (result!=null){
                hasNonNullResult = true;
                if (result == 1) {
                    app = appRepository.findById(appId)
                            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Application ID not found"));
                    app.setSecurityStatus(SecurityStatus.ATTACKED);
                    appRepository.save(app);
                    attackedFound = true;
                    break;
                }
            }
        }
        if (!attackedFound && appId!=null) {
            app = appRepository.findById(appId)
                    .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Application ID not found"));
            if(!hasNonNullResult) {
                app.setSecurityStatus(SecurityStatus.PENDING);
            } else{
                app.setSecurityStatus(SecurityStatus.NORMAL);
            }
            appRepository.save(app);
        }
    }

    private void checkInputDpiData(List<UploadDpiDataRequestResource> data) {
        if (data == null || data.isEmpty()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Data list cannot be empty.");
        }

        for (UploadDpiDataRequestResource item : data) {
            if (item.getAppId() == null) {
                throw new BusinessException(HttpStatus.BAD_REQUEST, "Application ID not found");
            }
        }
    }
}
