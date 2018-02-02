package uk.ac.herts.dd16abc.myblueforest.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uk.ac.herts.dd16abc.myblueforest.model.Comment;
import uk.ac.herts.dd16abc.myblueforest.model.user.User;
import uk.ac.herts.dd16abc.myblueforest.repo.CommentRepository;

@Service
public class CommentService {

  @Autowired
  protected CommentRepository cRepo;

  public CommentService() { } //empty constructor

  public Comment findOneByIdAndOwner(String id, User u) {
    long cid = Long.parseLong(id);
    return cRepo.findOneByIdAndOwner(cid, u);
  }

  public void delete(Comment c) {
    cRepo.delete(c);
  }

}
