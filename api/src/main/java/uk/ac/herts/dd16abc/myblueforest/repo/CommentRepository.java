package uk.ac.herts.dd16abc.myblueforest.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import uk.ac.herts.dd16abc.myblueforest.model.Comment;
import uk.ac.herts.dd16abc.myblueforest.model.user.User;

@Transactional
public interface CommentRepository extends JpaRepository<Comment, Long> {
  public List<Comment> findByOwner(User owner);

  public Comment findOneByIdAndOwner(Long id, User owner);
}
