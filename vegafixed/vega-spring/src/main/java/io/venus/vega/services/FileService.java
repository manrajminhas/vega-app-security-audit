package io.venus.vega.services;

import io.venus.vega.api.v1.resources.FileListResource;
import io.venus.vega.data.dtos.DownloadFileDto;
import io.venus.vega.data.entities.File;
import io.venus.vega.data.entities.User;
import io.venus.vega.data.repositories.FileRepository;
import io.venus.vega.data.repositories.UserRepository;
import io.venus.vega.services.exceptions.BusinessException;
import io.venus.vega.services.mapper.FileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final User currentUser;
    private final UserRepository userRepository;
    private final FileMapper fileMapper;

    @Value("${files.basic-folder-path}")
    private String FILES_BASIC_FOLDER_PATH;


    /**
     * Creates a file and saves it in the database and the fileSystem.
     *
     * @param file -> file that will be stored in the file system.
     * @throws BusinessException 400 if {@code file} can't be stored in the system;
     */
    @PreAuthorize("hasRole('ADMIN')")
    public void createFile(final MultipartFile file) {
        validateFile(file);

        try {
            final var rootLocation = Paths.get(this.FILES_BASIC_FOLDER_PATH);
            final var uniqueNameForFile =  Paths.get(file.getOriginalFilename()).getFileName().toString();

            final Path destinationFile = rootLocation.resolve(
                            Paths.get(uniqueNameForFile))
                    .normalize().toAbsolutePath();

            try (final InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                        StandardCopyOption.REPLACE_EXISTING);
            }

            final File fileEntity = constructFileEntity(file.getOriginalFilename(), destinationFile, file.getContentType());
            this.fileRepository.save(fileEntity);
        } catch (final IOException e) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Failed to store file.");
        }
    }

    private void validateFile(final MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "File is empty, please upload a loaded file");
        }

        final var fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isBlank()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "File name is empty, please upload file with a valid name");
        }

        final var fileNameAlreadyExist = this.fileRepository.existsByName(fileName);
        if (fileNameAlreadyExist) {
            throw new BusinessException(HttpStatus.BAD_REQUEST,
                    "File with this name already exists, please upload file with a different name");
        }
    }

    private File constructFileEntity(final String uniqueNameForFile, final Path destinationFile, final String contentType) {
        final var user = this.userRepository.findById(this.currentUser.getId()).orElseThrow();
        return File.builder()
                .name(uniqueNameForFile.replace(" ", "_"))
                .path(destinationFile.getFileName().toString())
                .contentType(contentType)
                .user(user)
                .build();
    }


    /**
     * Returns the file that is saved on system using the id passed to identify which file.
     *
     * @param filePath -> file path.
     * @throws BusinessException 500 if the file couldn't be retrieved from the system;
     * @return the saved file.
     */
//    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public DownloadFileDto downloadFile(final String filePath) {
        if (filePath == null || filePath.isBlank()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Invalid file path");
        }

        try {
            final Path rootLocation = Paths.get(this.FILES_BASIC_FOLDER_PATH)
                    .toAbsolutePath()
                    .normalize();
            final Path suppliedPath = Paths.get(filePath);

            if (suppliedPath.isAbsolute()) {
                throw new BusinessException(HttpStatus.BAD_REQUEST, "Invalid file path");
            }

            final Path resolvedFile = rootLocation.resolve(suppliedPath).normalize();
            if (!resolvedFile.startsWith(rootLocation)
                    || !Files.isRegularFile(resolvedFile)
                    || !Files.isReadable(resolvedFile)) {
                throw new BusinessException(HttpStatus.BAD_REQUEST, "Invalid file path");
            }

            // Resolve symbolic links before the final containment check.
            final Path realRootLocation = rootLocation.toRealPath();
            final Path realFile = resolvedFile.toRealPath();
            if (!realFile.startsWith(realRootLocation)) {
                throw new BusinessException(HttpStatus.BAD_REQUEST, "Invalid file path");
            }

            final Resource resource = new UrlResource(realFile.toUri());
            return constructDownloadFileEntity(resource);
        } catch (final InvalidPathException | IOException e) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Invalid file path");
        }
    }

    private DownloadFileDto constructDownloadFileEntity(final Resource resource) {
        return DownloadFileDto.builder()
                .fileName(resource.getFilename())
                .file(resource)
                .build();
    }

    /**
     * Returns a paginated result of files that the admin saved based on the pageable object which defines
     * how many rows does a page contain, the page number that should be return and how will the page will be sorted,
     * and the specificationFrom which will filter the data based on specific conditions.
     *
     * @param specificationFrom specification used to filter the data
     * @param pageOf pageable used to paginate the data
     * @return page of files
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public Page<FileListResource> getFiles(final Specification<File> specificationFrom, final Pageable pageOf) {
        final var filesPage = this.fileRepository.findAll(specificationFrom, pageOf);
        return filesPage.map(this.fileMapper::map);
    }
}
