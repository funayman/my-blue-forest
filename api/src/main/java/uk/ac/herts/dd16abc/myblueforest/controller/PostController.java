package uk.ac.herts.dd16abc.myblueforest.controller;

import java.io.IOException;
import java.net.URI;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.validation.BindingResult;

import uk.ac.herts.dd16abc.myblueforest.model.Comment;
import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.model.PostType;
import uk.ac.herts.dd16abc.myblueforest.model.user.User;
import uk.ac.herts.dd16abc.myblueforest.service.FileUploadService;
import uk.ac.herts.dd16abc.myblueforest.service.PostService;
import uk.ac.herts.dd16abc.myblueforest.service.RatingService;
import uk.ac.herts.dd16abc.myblueforest.service.CommentService;
import uk.ac.herts.dd16abc.myblueforest.service.user.BFUserService;
import uk.ac.herts.dd16abc.myblueforest.validator.service.IValidationService;

@RequestMapping("/posts")
@RestController
public class PostController {

  @Autowired
  protected IValidationService vService;

  @Autowired
  protected PostService pService;

  @Autowired
  protected CommentService cService;

  @Autowired
  protected FileUploadService fService;

  @Autowired
  protected BFUserService uService;

  @Autowired
  protected RatingService rService;

  /*
  public PostController(CommentService cService, FileUploadService fService, BFUserService uService, PostService pService) {
    this.cService = cService;
    this.fService = fService;
    this.uService = uService;
    this.pService = pService;
  }
  */

  @RequestMapping(value={"", "/"}, method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getPosts() {
    return ResponseEntity.ok( pService.findAll() );
  }

  @RequestMapping(value={"", "/"}, method=RequestMethod.POST)
  public @ResponseBody ResponseEntity<?> createPost(@RequestBody Post newPost, BindingResult bindingResult) {

    vService.validatePost(newPost, bindingResult);
    if(bindingResult.hasErrors()) {
      return ResponseEntity.badRequest().body(
        vService.generateErrorMap(bindingResult.getFieldErrors())
      );
    }

    User u = uService.getCurrentUser();
    u.addPost(newPost);
    uService.save(u);

    newPost = u.getPosts().get( u.getPosts().size() - 1 );
    return ResponseEntity.created(URI.create("/api/posts/" + newPost.getId())).body(newPost);
  }

  @RequestMapping(value="/upload/{id}", method=RequestMethod.POST)
  public @ResponseBody ResponseEntity<?> uploadFile(@PathVariable("id") String id, @RequestParam(value="file") MultipartFile uploadedFile) {
    try {
      //get post
      Post post = pService.findOneById(id);
      if(post == null) { return ResponseEntity.badRequest().body("post does not exist"); }

      String fileName = String.format("%s%s",
        fService.generateUniqueFilename(uploadedFile.getOriginalFilename()),
        fService.getFileExtension(uploadedFile.getOriginalFilename())
      );

      fService.save(uploadedFile, fileName);

      String assetUrl = String.format(fService.WEB_DIR + fileName);
      post.setAssetUrl(assetUrl);
      pService.save(post);

      Map<String, Object> entity = new HashMap<String, Object>();
      entity.put("assetUrl", assetUrl);
      entity.put("", assetUrl);

      return ResponseEntity.created(URI.create(assetUrl)).body(entity);
    } catch(IOException | NoSuchAlgorithmException e) {
      return ResponseEntity.badRequest().body("Error saving file: " + e.getMessage());
    } catch(NullPointerException e) {
      return ResponseEntity.badRequest().body("Please select a file");
    }
  }

  @RequestMapping(value="/{id}", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getPost(@PathVariable("id") String id) {
    Post post = pService.findOneById(id);
    if(post == null) { return ResponseEntity.badRequest().body("post does not exist"); }

    return ResponseEntity.ok( post );
  }

  @RequestMapping(value="/{id}", method={RequestMethod.POST, RequestMethod.PUT})
  public @ResponseBody ResponseEntity<?> updatePost(@PathVariable("id") String id, @RequestBody Post post) {
    //does the post in question exist?
    Post oPost = pService.findOneById(id);
    if(oPost == null) { return ResponseEntity.badRequest().body("post does not exist"); }

    //is the current loggedin user the owner of the post being updated?
    User cUser = uService.getCurrentUser();
    if(!oPost.getOwner().equals(cUser)) {
      Map<String, String> respBody = new HashMap<String, String>();
      respBody.put("error", "you are not authorized to update this post");
      return ResponseEntity.status(401).body(respBody);
    }

    post.setOwner(cUser);
    return ResponseEntity.ok( pService.save(post) );
  }

  @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
  public @ResponseBody ResponseEntity<?> deletePost(@PathVariable("id") String id) {
    //does the post in question exist?
    Post post = pService.findOneById(id);
    if(post == null) { return ResponseEntity.badRequest().body("post does not exist"); }

    //is the current loggedin user the owner?
    User cUser = uService.getCurrentUser();
    if(!post.getOwner().equals(cUser)) { return ResponseEntity.status(401).body("you are not authorized to delete this post"); }

    Set<User> users = post.getFollowedUsers();
    for(User u : users) {
      u.getFollowedPosts().remove(post);
      uService.save(u);
    }
    pService.delete(post);

    return ResponseEntity.ok(Boolean.TRUE);
  }

  @RequestMapping(value="/{id}/comments", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getPostComments(@PathVariable("id") String id) {
    Post p = pService.findOneById(id);
    if(p == null) { return ResponseEntity.badRequest().body("post does not exist"); }

    return ResponseEntity.ok(p.getComments());
  }

  @RequestMapping(value="/{id}/comments", method=RequestMethod.POST)
  public @ResponseBody ResponseEntity<?> saveCommentToPost(@PathVariable("id") String id, @RequestBody Comment comment, BindingResult bindingResult) {
    User u = uService.getCurrentUser();
    Post p = pService.findOneById(id);
    if(p == null) {
      Map<String, String> respBody = new HashMap<String, String>();
      respBody.put("error", String.format("post with id: %d does not exist", id));
      return ResponseEntity.badRequest().body(respBody);
     }

    vService.validateComment(comment, bindingResult);
    if(bindingResult.hasErrors()) {
      return ResponseEntity.badRequest().body(
        vService.generateErrorMap(bindingResult.getFieldErrors())
      );
    }

    comment.setOwner(u);
    p.addComment(comment);
    pService.save(p);

    return ResponseEntity.ok(p.getComments().get( p.getComments().size() - 1 ));
  }

  @RequestMapping(value="/{pid}/comments/{cid}", method=RequestMethod.DELETE)
  public @ResponseBody ResponseEntity<?> deleteCommentFromPost(@PathVariable("pid") String pid, @PathVariable("cid") String cid) {
    User u = uService.getCurrentUser();
    Post p = pService.findOneById(pid);
    if(p == null) { return ResponseEntity.badRequest().body("post does not exist"); }

    Comment c = cService.findOneByIdAndOwner(cid, u);
    if(c == null) { return ResponseEntity.badRequest().body("comment & user combo doesn't exist"); }

    cService.delete(c);

    return ResponseEntity.ok("{\"success\":true}");
  }

  @RequestMapping(value="/{id}/like/{username}", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getDoesUserLike(@PathVariable("id") String id, @PathVariable("username") String username) {
    User u = uService.findByUsername(username);
    if(u == null) { return ResponseEntity.badRequest().body(makeResponseBodyMap("error", "user does not exist")); }
    Post p = pService.findOneById(id);
    if(p == null) { return ResponseEntity.badRequest().body(makeResponseBodyMap("error", "post does not exist")); }

    return ResponseEntity.ok( p.getLikes().contains(u) );
  }

  @RequestMapping(value="/{pid}/like", method=RequestMethod.POST)
  public @ResponseBody ResponseEntity<?> likePost(@PathVariable("pid") String pid) {
    User u = uService.getCurrentUser();
    Post p = pService.findOneById(pid);
    if(p == null) { return ResponseEntity.badRequest().body(makeResponseBodyMap("error", "post does not exist")); }

    p.getLikes().add(u);
    pService.save(p);
    return ResponseEntity.ok(p.getLikes().contains(u));
  }

  @RequestMapping(value="/{pid}/like", method=RequestMethod.DELETE)
  public @ResponseBody ResponseEntity<?> deleteLikePost(@PathVariable("pid") String pid) {
    User u = uService.getCurrentUser();
    Post p = pService.findOneById(pid);
    if(p == null) { return ResponseEntity.badRequest().body(makeResponseBodyMap("error", "post does not exist")); }

    p.getLikes().remove(u);
    pService.save(p);
    return ResponseEntity.ok(!p.getLikes().contains(u));
  }

  //following count
  @RequestMapping(value="/follow/count", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getFollowedPosts() {
    return ResponseEntity.ok( pService.findFollowingCount() );
  }


  @RequestMapping(value="/type/{type}", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getPostsByType(@PathVariable("type") String type) {
    return ResponseEntity.ok( pService.findAllByType( PostType.getType(type) ) );
  }

  private Map<String, String> makeResponseBodyMap(String...args) {
    Map<String, String> err = new HashMap<String, String>();
    for(int i=0; i<args.length; i+=2) {
      err.put(args[i], args[i+1]);
    }
    return err;
  }

}
