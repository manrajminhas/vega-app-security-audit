package io.venus.vega.services;

import io.venus.vega.data.repositories.FileRepository;
import io.venus.vega.data.repositories.UserRepository;
import io.venus.vega.services.exceptions.BusinessException;
import io.venus.vega.services.mapper.FileMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class FileServiceTest {

    @Mock
    private FileRepository fileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FileMapper fileMapper;

    @TempDir
    private Path temporaryDirectory;

    private Path uploadDirectory;
    private FileService fileService;

    @BeforeEach
    void setUp() throws IOException {
        this.uploadDirectory = Files.createDirectory(this.temporaryDirectory.resolve("uploads"));
        this.fileService = new FileService(this.fileRepository, null, this.userRepository, this.fileMapper);
        ReflectionTestUtils.setField(this.fileService, "FILES_BASIC_FOLDER_PATH", this.uploadDirectory.toString());
    }

    @Test
    void downloadFileReturnsAReadableFileInsideTheUploadDirectory() throws IOException {
        final byte[] content = "allowed content".getBytes(StandardCharsets.UTF_8);
        Files.write(this.uploadDirectory.resolve("allowed.txt"), content);

        final var result = this.fileService.downloadFile("allowed.txt");

        assertEquals("allowed.txt", result.getFileName());
        try (final var inputStream = result.getFile().getInputStream()) {
            assertArrayEquals(content, inputStream.readAllBytes());
        }
    }

    @Test
    void downloadFileRejectsParentDirectoryTraversal() throws IOException {
        Files.writeString(this.temporaryDirectory.resolve("secret.txt"), "secret");

        final var exception = assertThrows(
                BusinessException.class,
                () -> this.fileService.downloadFile("../secret.txt")
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getHttpStatus());
    }

    @Test
    void downloadFileRejectsAbsolutePaths() throws IOException {
        final Path secretFile = this.temporaryDirectory.resolve("secret.txt").toAbsolutePath();
        Files.writeString(secretFile, "secret");

        final var exception = assertThrows(
                BusinessException.class,
                () -> this.fileService.downloadFile(secretFile.toString())
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getHttpStatus());
    }
}
