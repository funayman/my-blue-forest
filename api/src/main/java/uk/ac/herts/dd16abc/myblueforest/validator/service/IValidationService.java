package uk.ac.herts.dd16abc.myblueforest.validator.service;

import java.util.List;
import java.util.Map;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import uk.ac.herts.dd16abc.myblueforest.model.Comment;
import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.model.user.MoushiKomi;

public interface IValidationService {

  public void validateUser(MoushiKomi user, BindingResult bindingResult);

  public void validatePost(Post post, BindingResult bindingResult);

  public void validateComment(Comment comment, BindingResult bindingResult);

  public Map<String, String> generateErrorMap(List<FieldError> errors);
}
