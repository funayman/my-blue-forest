package uk.ac.herts.dd16abc.myblueforest.service.user;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import uk.ac.herts.dd16abc.myblueforest.model.user.User;
import uk.ac.herts.dd16abc.myblueforest.model.user.Role;
import uk.ac.herts.dd16abc.myblueforest.repo.user.UserRepository;
import uk.ac.herts.dd16abc.myblueforest.repo.user.RoleRepository;

@Service("bfUserService")
public class BFUserService {

  @Autowired
  private UserRepository uRepo;

  @Autowired
  private RoleRepository rRepository;

  @Autowired
  private PasswordEncoder passwd;

  public long count() { return uRepo.count(); }

  public User findById(long id) { return uRepo.findOne(id); }

  public void saveNewUser(User user) {
    Set<Role> roles = new HashSet<Role>();
    roles.add( new Role("USER") );
    user.setRoles(roles);

    user.setPassword(passwd.encode(user.getPassword()));

    uRepo.save(user);
  }

  public void updatePassword(User u, String password) {
    u.setPassword(passwd.encode(password));
    uRepo.save(u);
  }

  public void save(User user) {
    uRepo.save(user);
  }

  public User findByUsername(String username) {
    return uRepo.findByUsername(username);
  }

  public User getCurrentUser() {
     try {
       User u = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
       return this.findByUsername(u.getUsername());
     } catch (Exception e) {
       return null;
     }
  }

  public Authentication getCurrentAuth() {
    return SecurityContextHolder.getContext().getAuthentication();
  }
}
