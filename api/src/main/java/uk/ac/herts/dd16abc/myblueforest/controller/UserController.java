package uk.ac.herts.dd16abc.myblueforest.controller;

import java.net.URI;
import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.model.user.User;
import uk.ac.herts.dd16abc.myblueforest.model.user.MoushiKomi;
import uk.ac.herts.dd16abc.myblueforest.service.PostService;
import uk.ac.herts.dd16abc.myblueforest.service.user.BFUserService;
import uk.ac.herts.dd16abc.myblueforest.validator.service.IValidationService;

@RestController
@RequestMapping("/user")
public class UserController {

  @Autowired
  protected IValidationService vService;

  @Autowired
  private BFUserService userService;

  @Autowired
  protected PostService pService;

  @RequestMapping(value="/count", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> profileDetail() {
    return ResponseEntity.ok(userService.count());
  }

  @RequestMapping(value="/me", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> whoami() {
      User me = (User) userService.getCurrentUser();
      if(me == null) {
        return ResponseEntity.badRequest().body("{\"error\":\"you dont exist\"}");
      }
      return ResponseEntity.ok(me);
  }

  @RequestMapping(value="/me/like", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getLikedPostIDs() {
    User u = userService.getCurrentUser();
    return ResponseEntity.ok( pService.findLikedPostsByUserId(u.getId()) );
  }


  @RequestMapping(value="/{username}", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getUser(@PathVariable("username") String username) {
    User user = userService.findByUsername(username);
    if (user == null) {
      return ResponseEntity.badRequest().body("{\"error\":\"no user found\"}");
    }
    return ResponseEntity.ok(user);
  }

  @RequestMapping(value="/id/{id}", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getUser(@PathVariable("id") long id) {
    User user = userService.findById(id);
    if (user == null) {
      return ResponseEntity.badRequest().body("No data found");
    }
    return ResponseEntity.ok(user);
  }

  @RequestMapping(value="/register", method=RequestMethod.POST)
  public @ResponseBody ResponseEntity<?> createUser(@RequestBody MoushiKomi applicant, BindingResult bindingResult) {
    vService.validateUser(applicant, bindingResult);
    if (bindingResult.hasErrors()) {
      return ResponseEntity.badRequest().body(
        vService.generateErrorMap(bindingResult.getFieldErrors())
      );
    }

    User newUser = new User(applicant.getUsername(), applicant.getPassword(), applicant.getRegion());
    userService.saveNewUser(newUser);

    return ResponseEntity.created(URI.create("/api/user/" + newUser.getId())).body(newUser);
  }

  @RequestMapping(value="/update", method=RequestMethod.POST)
  public @ResponseBody ResponseEntity<?> updatePassword(@RequestBody MoushiKomi applicant, BindingResult bindingResult) {
    //quick custom validation
    if( ! applicant.getPassword().equals(applicant.getPassconf()) ||
      applicant.getPassword().length() < 8 ) {
      return ResponseEntity.badRequest().body(Boolean.FALSE);
    }

    User u = userService.getCurrentUser();
    userService.updatePassword(u, applicant.getPassword());

    return ResponseEntity.ok(Boolean.TRUE);
  }

  @RequestMapping(value = "/", method = RequestMethod.PUT)
  public ResponseEntity<?> updateUser(@PathVariable("id") long id, @RequestBody User user) {
    //TO-DO implement later
    return null;
  }

  @RequestMapping(value="/follow", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getFollowedPosts() {
    User u = userService.getCurrentUser();
    if(u == null) { return ResponseEntity.ok(null); }
    return ResponseEntity.ok(u.getFollowedPosts());
  }

  @RequestMapping(value="/follow/{pid}", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getFollowedPosts(@PathVariable("pid") String pid) {
    //user
    User u = userService.getCurrentUser();
    if(u == null) { return ResponseEntity.ok(Boolean.FALSE); }

    //post
    Post p = pService.findOneById(pid);
    if(p == null) { return ResponseEntity.ok(Boolean.FALSE); }

    return ResponseEntity.ok(u.getFollowedPosts().contains(p));
  }

  @RequestMapping(value="/follow/{pid}", method=RequestMethod.POST)
  public @ResponseBody ResponseEntity<?> followPost(@PathVariable("pid") String pid) {
    User u = userService.getCurrentUser();
    Post p = pService.findOneById(pid);
    if(p == null) { return ResponseEntity.badRequest().body("post does not exist"); }

    u.getFollowedPosts().add(p);
    userService.save(u);

    return ResponseEntity.ok(Boolean.TRUE);
  }

  @RequestMapping(value="/follow/{pid}", method=RequestMethod.DELETE)
  public @ResponseBody ResponseEntity<?> removeFollowedPost(@PathVariable("pid") String pid) {
    User u = userService.getCurrentUser();
    Post p = pService.findOneById(pid);

    if(p == null) { return ResponseEntity.badRequest().body("post does not exist"); }

    long id = Long.parseLong(pid);
    for(Iterator<Post> it = u.getFollowedPosts().iterator(); it.hasNext();) {
      Post temp = it.next();
      if(id == temp.getId()) {
        it.remove();
        userService.save(u);
        return ResponseEntity.ok(Boolean.TRUE);
      }
    }

    return ResponseEntity.badRequest().body("currently not following post");
  }

  @RequestMapping(value="/{username}/posts", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getUserPosts(@PathVariable("username") String username) {
    User user = userService.findByUsername(username);
    if (user == null) {
      return ResponseEntity.badRequest().body("{\"error\":\"no user found\"}");
    }
    return ResponseEntity.ok(user.getPosts());
  }
}
