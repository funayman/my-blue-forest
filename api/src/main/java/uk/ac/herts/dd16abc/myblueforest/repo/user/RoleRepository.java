package uk.ac.herts.dd16abc.myblueforest.repo.user;

import org.springframework.data.jpa.repository.JpaRepository;

import uk.ac.herts.dd16abc.myblueforest.model.user.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
  public Role findByName(String name);
}
