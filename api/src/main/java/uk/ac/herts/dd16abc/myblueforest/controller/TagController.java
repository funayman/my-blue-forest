package uk.ac.herts.dd16abc.myblueforest.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import uk.ac.herts.dd16abc.myblueforest.model.Tag;
import uk.ac.herts.dd16abc.myblueforest.service.TagService;

@RequestMapping("/tags")
@RestController
public class TagController {

  @Autowired
  protected TagService tService;

  public TagController(TagService tService) {
    this.tService = tService;
  }

  @RequestMapping(value={"", "/"}, method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getTags() {
    return ResponseEntity.ok( tService.findAll() );
  }

  @RequestMapping(value={"", "/"}, method=RequestMethod.POST)
  public @ResponseBody ResponseEntity<?> createTag(@RequestBody Tag newTag) {
    Tag t = tService.save(newTag);
    return ResponseEntity.created(URI.create("/api/tags/" + t.getId())).body(t);
  }

  @RequestMapping(value="/process", method=RequestMethod.POST)
  public @ResponseBody ResponseEntity<?> processMany(@RequestBody String[] tags) {
    return ResponseEntity.ok( tService.processStrings(tags) );
  }

  @RequestMapping(value="/{tag}", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getTag(@PathVariable("tag") String name) {
    Tag tag = tService.findByName(name);
    if(tag == null) { return ResponseEntity.badRequest().body(Boolean.FALSE); }

    return ResponseEntity.ok( tag );
  }

  @RequestMapping(value="/{tag}/posts", method=RequestMethod.GET)
  public @ResponseBody ResponseEntity<?> getPostsFromTag(@PathVariable("tag") String name) {
    Tag tag = tService.findByName(name);
    if(tag == null) { return ResponseEntity.badRequest().body(Boolean.FALSE); }

    return ResponseEntity.ok(tag.getPosts());
  }

  //no UPDATE or DELETE
}
