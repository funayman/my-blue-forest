package uk.ac.herts.dd16abc.myblueforest.repo;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.jpa.repository.JpaRepository;

import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.model.PostType;

/*
 * architectural design inspired by:
 * http://blog.netgloo.com/2014/12/18/handling-entities-inheritance-with-spring-data-jpa/
 */

@NoRepositoryBean
public interface PostBaseRepository<T extends Post> extends JpaRepository<T, Long> {
  public List<T> findAllByOrderByIdDesc();

  public List<T> findTop5ByOrderByIdDesc();

  public List<T> findAllByType(PostType type);

  public T findById(long id);

  @Query(value="SELECT pid, COUNT(uid) FROM user_follow GROUP BY pid", nativeQuery=true)
  public List<Object[]> findFollowingCount();

  @Query(value="SELECT pid FROM post_like WHERE uid=?1", nativeQuery=true)
  public List<Object[]> findLikedPostsByUserId(long id);
}
