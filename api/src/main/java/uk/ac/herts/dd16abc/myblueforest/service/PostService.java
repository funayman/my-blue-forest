package uk.ac.herts.dd16abc.myblueforest.service;

import java.math.BigInteger;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.model.PostType;
import uk.ac.herts.dd16abc.myblueforest.repo.PostRepository;

@Service
public class PostService {

  @Autowired
  protected PostRepository pRepo;

  public PostService() { } //empty constructor

  public PostService(PostRepository pRepo) {
    this.pRepo = pRepo;
  }

  public List<Integer> findLikedPostsByUserId(long id) {
    List<Integer> postIDs = new ArrayList<Integer>();
    List<Object[]> data = pRepo.findLikedPostsByUserId(id);
    for(Object o : data) {
      postIDs.add( ((BigInteger) o).intValue() );
    }

    return postIDs;
  }

  public List<Map<String, Object>> findFollowingCount() {
    List<Map<String, Object>> responseData = new ArrayList<Map<String, Object>>();
    List<Object[]> queryData = pRepo.findFollowingCount();

    for(Object[] o : queryData) {
      Map<String, Object> tmpMap = new HashMap<String, Object>();
      tmpMap.put("pid", o[0]);
      tmpMap.put("count", o[1]);
      responseData.add(tmpMap);
    }

    return responseData;
  }

  public List<Post> findAll() {
    return pRepo.findAll();
  }

  public List<Post> findAllByType(PostType pt) {
    return pRepo.findAllByType(pt);
  }

  public Post findOneById(String id) {
    long pid = Long.parseLong(id);

    return this.findOneById(pid);
  }

  public Post findOneById(long id) {
    return pRepo.findById(id);
  }

  public Post save(Post p) {
    return pRepo.save(p);
  }

  public void delete(Post p) {
    pRepo.delete(p);
  }
}
