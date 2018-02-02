package uk.ac.herts.dd16abc.myblueforest.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import uk.ac.herts.dd16abc.myblueforest.model.Tag;

@Transactional
public interface TagRepository extends JpaRepository<Tag, Long> {
  public Tag findByName(String name);
}
