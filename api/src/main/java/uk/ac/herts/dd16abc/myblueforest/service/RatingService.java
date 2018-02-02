package uk.ac.herts.dd16abc.myblueforest.service;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.model.Rating;
import uk.ac.herts.dd16abc.myblueforest.model.user.User;
import uk.ac.herts.dd16abc.myblueforest.repo.RatingRepository;

@Service
public class RatingService {
  //regex derived from https://stackoverflow.com/questions/6787716/regular-expression-for-japanese-characters
  private static final String ALLOWED_CHAR_REGEX = "[^一-龠ぁ-ゔァ-ヴーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤]";


  @Autowired
  protected RatingRepository rRepo;

  public RatingService() { } //empty constructor

  public Rating save(Rating r) {
    return rRepo.save(r);
  }

  public Map<String, Object> findAverageByPost(Post post) {
    Map<String, Object> rating = new HashMap<String, Object>();
    Object[] data = rRepo.findAverageByPost(post).get(0);
    rating.put("users", data[0]);
    rating.put("average", (data[1] == null) ? new Double(0.0) : data[1]);
    return rating;
  }

  public Rating findByUserAndPost(User user, Post post) {
    return rRepo.findByUserAndPost(user, post);
  }

  public List<Rating> findAllByPost(Post post) {
    return rRepo.findAllByPost(post);
  }

  public List<Map<String, Object>> findAllRatings() {
    List<Map<String, Object>> ratings = new ArrayList<Map<String, Object>>();

    for(Object[] o: rRepo.findAllRatings()) {
      Map<String, Object> tmpMap = new HashMap<String, Object>();
      tmpMap.put("pid", o[0]);
      tmpMap.put("rating", o[1]);
      ratings.add(tmpMap);
    }

    return ratings;
  }
}
