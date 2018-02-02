package uk.ac.herts.dd16abc.myblueforest.controller;

import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import uk.ac.herts.dd16abc.myblueforest.model.Rating;
import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.model.user.User;
import uk.ac.herts.dd16abc.myblueforest.service.RatingService;
import uk.ac.herts.dd16abc.myblueforest.service.PostService;
import uk.ac.herts.dd16abc.myblueforest.service.user.BFUserService;

@RequestMapping("/rating")
@RestController
public class RatingController {

  @Autowired
  protected RatingService rService;

  @Autowired
  protected PostService pService;

  @Autowired
  protected BFUserService uService;

  public RatingController(RatingService rService) { }

  @RequestMapping(value={"", "/"}, method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getRatings() {
    return ResponseEntity.ok( rService.findAllRatings() );
  }

  @RequestMapping(value="/{id}", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getPostsRating(@PathVariable("id") String id) {
    Post p = pService.findOneById(id);
    if(p == null) { return ResponseEntity.badRequest().body(makeResponseBodyMap("error","post does not exist")); }

    return ResponseEntity.ok( rService.findAverageByPost(p) );
  }

  @RequestMapping(value="/{id}", method=RequestMethod.POST)
  public @ResponseBody ResponseEntity<?> ratePost(@PathVariable("id") String id, @RequestBody int r) {
    User u = uService.getCurrentUser();
    Post p = pService.findOneById(id);
    if(p == null) { return ResponseEntity.badRequest().body(makeResponseBodyMap("error", "post does not exist")); }
    if(r<1 || r>5) { return ResponseEntity.badRequest().body(makeResponseBodyMap("error", "rating must be between 1 and 5")); }

    Rating rating = rService.findByUserAndPost(u, p);
    if(rating == null) {
      return ResponseEntity.ok( rService.save(new Rating(r, u, p)) );
    } else {
      rating.setValue(r);
      return ResponseEntity.ok( rService.save(rating) );
    }
  }

  @RequestMapping(value="/{id}/me", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getUserRating(@PathVariable("id") String id) {
    User u = uService.getCurrentUser();
    if(u == null) { return ResponseEntity.badRequest().body(makeResponseBodyMap("error", "you must be logged in")); }
    Post p = pService.findOneById(id);
    if(p == null) { return ResponseEntity.badRequest().body(makeResponseBodyMap("error","post does not exist")); }

    Rating rating = rService.findByUserAndPost(u, p);

    return (rating == null) ? ResponseEntity.ok( -1 ) : ResponseEntity.ok( rating );
  }

  private Map<String, String> makeResponseBodyMap(String...args) {
    Map<String, String> err = new HashMap<String, String>();
    for(int i=0; i<args.length; i+=2) {
      err.put(args[i], args[i+1]);
    }
    return err;
  }
}
