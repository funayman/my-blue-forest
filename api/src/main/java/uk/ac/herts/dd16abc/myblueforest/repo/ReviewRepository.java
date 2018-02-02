package uk.ac.herts.dd16abc.myblueforest.repo;
 
import org.springframework.transaction.annotation.Transactional;

import uk.ac.herts.dd16abc.myblueforest.model.Review;

 
@Transactional
public interface ReviewRepository extends PostBaseRepository<Review> {

}
