package uk.ac.herts.dd16abc.myblueforest.service;

import java.util.List;
import java.util.LinkedList;
import java.util.Set;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uk.ac.herts.dd16abc.myblueforest.model.Tag;
import uk.ac.herts.dd16abc.myblueforest.repo.TagRepository;

@Service
public class TagService {
  //regex derived from https://stackoverflow.com/questions/6787716/regular-expression-for-japanese-characters
  private static final String ALLOWED_CHAR_REGEX = "[^一-龠ぁ-ゔァ-ヴーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤]";


  @Autowired
  protected TagRepository tRepo;

  public TagService() { } //empty constructor

  public List<Tag> findAll() {
    return tRepo.findAll();
  }

  public Tag findByName(String name) {
    return tRepo.findByName(name);
  }

  public Tag save(Tag t) {
    return tRepo.save(t);
  }

  public List<Tag> processTags(Tag[] tags) {
    List<Tag> finalTagSet = new LinkedList<Tag>();
    for(Tag t : tags) {
      Tag tag = tRepo.findByName(t.getName());
      if(null == tag) {
        String tagName = t.getName().replaceAll(ALLOWED_CHAR_REGEX, "");
        if(tagName.equals("")) { continue; }

        tag = new Tag(tagName);
        this.save(tag);
      }

      finalTagSet.add(tag);
    }

    return finalTagSet;
  }

  public Set<Tag> processStrings(String[] tags) {
    Set<Tag> finalTagSet = new HashSet<Tag>();
    for(String t : tags) {
      String tagName = t.replaceAll(ALLOWED_CHAR_REGEX, "");
      System.out.println(tagName);
      Tag tag = tRepo.findByName(tagName);
      if(null == tag) {
        if(tagName.equals("")) { continue; }
        tag = new Tag(tagName);
        this.save(tag);
      }

      finalTagSet.add(tag);
    }

    return finalTagSet;
  }
}
