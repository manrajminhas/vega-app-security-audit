package io.venus.vega.data.seeders;

import io.venus.vega.data.entities.Role;
import io.venus.vega.data.entities.User;
import io.venus.vega.data.repositories.RoleRepository;
import io.venus.vega.data.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static io.venus.vega.data.entities.enums.UserStatus.ACTIVE;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${main-account.email}")
    private String mainAccEmail;
    @Value("${main-account.password}")
    private String mainAccPassword;

    @EventListener
    @Transactional
    public void seed(final ContextRefreshedEvent event) {
        this.seedMainUsers();
    }

    private void seedMainUsers() {
        if(this.userRepository.existsByEmail(this.mainAccEmail)) {
            return;
        }

        final var adminRole = this.roleRepository.findByName(Role.RoleProperty.ADMIN.getName())
                .orElseThrow();

        final var employeeRole = this.roleRepository.findByName(Role.RoleProperty.EMPLOYEE.getName())
                .orElseThrow();

        this.userRepository.save(User.builder()
                .name("Lovelin Kumar – CTO")
                .email("lkumar@vega.com")
                .password("L@guna546")
                .role(employeeRole)
                .status(ACTIVE)
                .build());

        this.userRepository.save(User.builder()
                .name("Admin")
                .email(this.mainAccEmail)
                .password(this.mainAccPassword)
                .role(adminRole)
                .status(ACTIVE)
                .build());

        this.userRepository.save(User.builder()
                .name("Paul Aguilar – CEO")
                .email("paguilar@vega.com")
                .password("X#abcRT")
                .role(employeeRole)
                .status(ACTIVE)
                .build());

        this.userRepository.save(User.builder()
                .name("Jon Oliver – CFO")
                .email("joliver@vega.com")
                .password("Oranus$%34")
                .role(employeeRole)
                .status(ACTIVE)
                .build());


                
        this.userRepository.save(User.builder()
                .name("Michel Kouame - VP Sales")
                .email("mkouame@vega.com")
                .password("QAZWSX")
                .role(employeeRole)
                .status(ACTIVE)
                .build());

        this.userRepository.save(User.builder()
                .name("Claudine Zhang - COO")
                .email("czhang@vega.com")
                .password("BetaW0rld56")
                .role(employeeRole)
                .status(ACTIVE)
                .build());

        this.userRepository.save(User.builder()
                .name("Angelina Da Costa – CMO")
                .email("acosta@vega.com")
                .password("tryABX90&")
                .role(employeeRole)
                .status(ACTIVE)
                .build());

        this.userRepository.save(User.builder()
                .name("Brijesh Gupta – GENERAL COUNSEL AND SECRETARY")
                .email("bgupta@vega.com")
                .password("babygirl#1")
                .role(employeeRole)
                .status(ACTIVE)
                .build());

        this.userRepository.save(User.builder()
                .name("Amy Fofana – VP, BUSINESS OPERATIONS")
                .email("afofana@vega.com")
                .password("1qaz!QAZ")
                .role(employeeRole)
                .status(ACTIVE)
                .build());
    }
}
