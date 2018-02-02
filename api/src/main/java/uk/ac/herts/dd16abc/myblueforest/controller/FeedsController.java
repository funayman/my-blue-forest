package uk.ac.herts.dd16abc.myblueforest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.repo.PostRepository;

//Why were using BasePathAwareController and now RepositoryRestController
//https://jira.spring.io/browse/DATAREST-991?focusedCommentId=135127&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-135127

@RestController
public class FeedsController {
  private final String FILE_DIR = "/app/shared/";
  private final String EXTERNAL_URL_BASE = "/assets/shared";

  @Autowired
  private final PostRepository repo;

  public FeedsController(PostRepository repo) {
    this.repo = repo;
  }

  @RequestMapping(method=RequestMethod.GET, value="/latest")
  public @ResponseBody ResponseEntity<?> getLatest() {
    return ResponseEntity.ok( repo.findTop5ByOrderByIdDesc() );
  }

  @RequestMapping(method=RequestMethod.GET, value="/feed")
  public @ResponseBody List<Post> getFeed() {
    return repo.findAllByOrderByIdDesc();
  }

  @RequestMapping(method=RequestMethod.GET, value="/feed/rss")
  public @ResponseBody List<Post> getRssFeed() {
    return repo.findAllByOrderByIdDesc();
  }

}
