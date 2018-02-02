package uk.ac.herts.dd16abc.myblueforest.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.ac.herts.dd16abc.myblueforest.model.user.User;
import uk.ac.herts.dd16abc.myblueforest.model.user.CustomUserDetails;
import uk.ac.herts.dd16abc.myblueforest.repo.user.UserRepository;

@Service("bfUserDetailsService")
public class BFUserDetailsService implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  @Override
  @Transactional(readOnly = true)
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username);
    if(null == user) throw new UsernameNotFoundException("cannot find user: " + username);
    return new CustomUserDetails(user);
  }
}
