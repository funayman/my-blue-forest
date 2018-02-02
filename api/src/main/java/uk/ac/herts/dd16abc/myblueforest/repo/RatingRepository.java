package uk.ac.herts.dd16abc.myblueforest.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import uk.ac.herts.dd16abc.myblueforest.model.Rating;
import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.model.user.User;

@Transactional
public interface RatingRepository extends JpaRepository<Rating, Long> {
  @Query("SELECT COUNT(value), AVG(value) FROM Rating WHERE pid=?1")
  public List<Object[]> findAverageByPost(Post post);

  public Rating findByUserAndPost(User user, Post post);

  public List<Rating> findAllByPost(Post post);

  @Query("SELECT post.id, AVG(value) FROM Rating GROUP BY post.id")
  public List<Object[]> findAllRatings();
}
