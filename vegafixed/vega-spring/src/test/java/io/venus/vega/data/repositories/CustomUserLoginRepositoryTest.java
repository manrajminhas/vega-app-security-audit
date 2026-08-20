package io.venus.vega.data.repositories;

import io.venus.vega.data.entities.User;
import io.venus.vega.services.exceptions.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserLoginRepositoryTest {

    private static final String EXPECTED_SQL =
            "SELECT * FROM vega.users WHERE email = :email AND password = :password LIMIT 1";

    @Mock
    private EntityManager entityManager;

    @Mock
    private Query query;

    private CustomUserLoginRepository repository;

    @BeforeEach
    void setUp() {
        this.repository = new CustomUserLoginRepository(this.entityManager);
        when(this.entityManager.createNativeQuery(org.mockito.ArgumentMatchers.anyString(), eq(User.class)))
                .thenReturn(this.query);
    }

    @Test
    void findByEmailAndPasswordReturnsUserForValidCredentials() {
        final String email = "Admin@vega.com";
        final String password = "123456";
        final User expectedUser = new User();
        when(this.query.getSingleResult()).thenReturn(expectedUser);

        final User result = this.repository.findByEmailAndPassword(email, password);

        final ArgumentCaptor<String> sqlCaptor = ArgumentCaptor.forClass(String.class);
        final InOrder inOrder = inOrder(this.entityManager, this.query);
        inOrder.verify(this.entityManager).createNativeQuery(sqlCaptor.capture(), eq(User.class));
        inOrder.verify(this.query).setParameter("email", email);
        inOrder.verify(this.query).setParameter("password", password);
        inOrder.verify(this.query).getSingleResult();

        assertEquals(EXPECTED_SQL, sqlCaptor.getValue());
        assertSame(expectedUser, result);
    }

    @Test
    void findByEmailAndPasswordRejectsTimeBasedPayloadsAsCredentials() {
        final String email = "Admin@vega.com' / sleep(15) / '";
        final String password = "123456' / sleep(15) / '";
        when(this.query.getSingleResult()).thenThrow(new NoResultException());

        final BusinessException exception = assertThrows(
                BusinessException.class,
                () -> this.repository.findByEmailAndPassword(email, password)
        );

        final ArgumentCaptor<String> sqlCaptor = ArgumentCaptor.forClass(String.class);
        final InOrder inOrder = inOrder(this.entityManager, this.query);
        inOrder.verify(this.entityManager).createNativeQuery(sqlCaptor.capture(), eq(User.class));
        inOrder.verify(this.query).setParameter("email", email);
        inOrder.verify(this.query).setParameter("password", password);
        inOrder.verify(this.query).getSingleResult();

        assertEquals(EXPECTED_SQL, sqlCaptor.getValue());
        assertEquals(HttpStatus.UNAUTHORIZED, exception.getHttpStatus());
        assertEquals("Invalid username or password", exception.getMessage());
    }

    @Test
    void findByEmailAndPasswordBindsAuthenticationBypassPayloadAsAValue() {
        final String email = "Admin@vega.com' -- ";
        final String password = "incorrect";
        when(this.query.getSingleResult()).thenThrow(new NoResultException());

        final BusinessException exception = assertThrows(
                BusinessException.class,
                () -> this.repository.findByEmailAndPassword(email, password)
        );

        final InOrder inOrder = inOrder(this.query);
        inOrder.verify(this.query).setParameter("email", email);
        inOrder.verify(this.query).setParameter("password", password);
        inOrder.verify(this.query).getSingleResult();
        assertEquals(HttpStatus.UNAUTHORIZED, exception.getHttpStatus());
        assertEquals("Invalid username or password", exception.getMessage());
    }
}
