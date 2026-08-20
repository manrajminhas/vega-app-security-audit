
CREATE TABLE env_info (
                          id BIGINT AUTO_INCREMENT NOT NULL,
                          created_by_user_id BIGINT,
                          last_modified_by_user_id BIGINT,
                          created_at DATETIME,
                          updated_at DATETIME,
                          application_id BIGINT NOT NULL,
                          host_ip VARCHAR(255) NOT NULL,
                          PRIMARY KEY (id)
);

CREATE TABLE env_interfaces (
                        env_id BIGINT NOT NULL,
                        interface VARCHAR(255) NOT NULL,
                        PRIMARY KEY (env_id, interface)
);


-- Constraints for env_info table
ALTER TABLE env_info ADD CONSTRAINT FK_ENVINFO_APPLICATION FOREIGN KEY (application_id) REFERENCES applications(id);

-- Constraints for env_interfaces table
ALTER TABLE env_interfaces ADD CONSTRAINT FK_ENVINTERFACES_ENVID FOREIGN KEY (env_id) REFERENCES env_info(id);

