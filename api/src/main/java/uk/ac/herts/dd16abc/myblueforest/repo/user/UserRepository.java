package uk.ac.herts.dd16abc.myblueforest.repo.user;

import org.springframework.data.jpa.repository.JpaRepository;

import uk.ac.herts.dd16abc.myblueforest.model.user.User;

public interface UserRepository extends JpaRepository<User, Long> {
  public User findByUsername(String username);
}
