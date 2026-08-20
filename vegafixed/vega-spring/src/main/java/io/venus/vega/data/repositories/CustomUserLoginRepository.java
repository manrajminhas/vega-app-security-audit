package io.venus.vega.data.repositories;

import io.venus.vega.data.entities.User;
import io.venus.vega.services.exceptions.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;


@Repository
public class CustomUserLoginRepository {

    private static final String FIND_BY_EMAIL_AND_PASSWORD_SQL =
            "SELECT * FROM vega.users " +
                    "WHERE email = :email AND password = :password " +
                    "LIMIT 1";

    private final EntityManager entityManager;

    public CustomUserLoginRepository(final EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public User findByEmailAndPassword(final String email, final String password) {
        final Query query = this.entityManager.createNativeQuery(FIND_BY_EMAIL_AND_PASSWORD_SQL, User.class);
        query.setParameter("email", email);
        query.setParameter("password", password);

        try {
            return (User) query.getSingleResult();
        } catch (NoResultException e) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
    }
}
