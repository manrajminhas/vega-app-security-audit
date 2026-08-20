package io.venus.vega.services;


import io.venus.vega.api.v1.resources.*;
import io.venus.vega.data.entities.Application;
import io.venus.vega.data.entities.EnvInfo;
import io.venus.vega.data.repositories.AppRepository;
import io.venus.vega.data.repositories.EnvInfoRepository;
import io.venus.vega.services.exceptions.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class DefenseClientService {

    private final AppRepository appRepository;
    private final EnvInfoRepository envInfoRepository;

    /**
     * Retrieves all defense applications registered by a user and returns their corresponding
     * environment and security information to the frontend.
     *
     * @param userId the ID of the user whose registered defense applications are being queried
     * @return a list of RegisterDefenseClientResponseResource containing application and environment details
     * @throws BusinessException if no applications or environment information is found for the user
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE','USER')")
    public List <RegisterDefenseClientResponseResource> defenseClientRegister(final Long userId){
        List<Application> apps = appRepository.findByBelongById(userId);
        if (apps.isEmpty()) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "No applications found for userId: " + userId);
        }

        List<RegisterDefenseClientResponseResource> responses = new ArrayList<>();
        for (Application app : apps) {

            Optional<EnvInfo> envInfoOpt = envInfoRepository.findByApplicationId(app.getId());
            if (envInfoOpt.isEmpty()) {
                throw new BusinessException(HttpStatus.NOT_FOUND,
                        "No EnvInfo found for applicationId: " + app.getId());
            }

            List<RegisterDefenseClientResponseResource.IdsOptionEnum> idsOptions = Arrays.asList(RegisterDefenseClientResponseResource.IdsOptionEnum.TRUE,RegisterDefenseClientResponseResource.IdsOptionEnum.FALSE);
            EnvInfo envInfo = envInfoOpt.get();
            RegisterDefenseClientResponseResource response = new RegisterDefenseClientResponseResource();
            response.setEnvHostname(app.getEnvHostname());
            response.setAppId(app.getId());
            response.setHostIp(envInfo.getHostIp());
            response.setIface(envInfo.getIface());
            response.setSecStatus(SecurityStatusResource.fromValue(app.getSecurityStatus().getStatus()));
            response.setIdsOption(idsOptions);

            responses.add(response);
        }
        return responses;
    }

    /**
     * Retrieves all registered defense applications along with their environment and user information,
     * and returns them to the frontend for administrative views.
     *
     * @return a list of AdminDefenseClientResource containing application, environment, and user details
     * @throws BusinessException if any application's environment information is missing
     */
    @PreAuthorize("hasAnyRole('ADMIN')")
    public List <AdminDefenseClientResource> getAdminDefenseClientInfo(){
        List<AdminDefenseClientResource> responses=new ArrayList<>();
        List<Application> apps=this.appRepository.findAll();
        for (Application app : apps) {
            AdminDefenseClientResource response =new AdminDefenseClientResource ();
            response.setAppId(app.getId());
            response.setUserName(app.getBelongBy().getName());
            response.setUserEmail(app.getBelongBy().getEmail());
            response.setEnvHostname(app.getEnvHostname());
            Optional<EnvInfo> envInfoOpt = envInfoRepository.findByApplicationId(app.getId());
            if (envInfoOpt.isEmpty()) {
                throw new BusinessException(HttpStatus.NOT_FOUND,
                        "No EnvInfo found for applicationId: " + app.getId());
            }
            EnvInfo envInfo=envInfoOpt.get();
            response.setHostIp(envInfo.getHostIp());
            response.setSecStatus(SecurityStatusResource.fromValue(app.getSecurityStatus().getStatus()));

            responses.add(response);
        }
        return responses;
    }
    /**
     *
     * @return Resource representing the ZIP file
     * @throws IOException if file not found
     */
    @Value("${defense.app.path}")
    private String defenseAppPath;

    public Resource downloadDefenseAppZip() throws IOException {
        File file = new File(defenseAppPath);

        // Check if the file exists and is readable
        if (!file.exists() || !file.canRead()) {
            throw new IOException("ZIP file not found or unreadable!");
        }

        // Stream the file instead of loading it fully into memory
        return new InputStreamResource(new FileInputStream(file));
    }
}
