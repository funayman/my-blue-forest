package uk.ac.herts.dd16abc.myblueforest.validator.service;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import uk.ac.herts.dd16abc.myblueforest.model.Comment;
import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.model.user.MoushiKomi;
import uk.ac.herts.dd16abc.myblueforest.validator.MoushiKomiValidator;
import uk.ac.herts.dd16abc.myblueforest.validator.PostValidator;
import uk.ac.herts.dd16abc.myblueforest.validator.CommentValidator;
import uk.ac.herts.dd16abc.myblueforest.validator.service.IValidationService;

@Service
public class ValidationService implements IValidationService {
  @Autowired
  private PostValidator pValidator;

  @Autowired
  private MoushiKomiValidator uValidator;

  @Autowired
  private CommentValidator cValidator;

  public void validateUser(MoushiKomi user, BindingResult bindingResult) {
    uValidator.validate(user, bindingResult);
  }

  public void validatePost(Post post, BindingResult bindingResult) {
    pValidator.validate(post, bindingResult);
  }

  public void validateComment(Comment comment, BindingResult bindingResult) {
    cValidator.validate(comment, bindingResult);
  }

  public Map<String, String> generateErrorMap(List<FieldError> errors) {
    Map<String, String> errMap = new LinkedHashMap<String, String>();
    for (FieldError error : errors) {
      errMap.put(error.getField(), error.getCode());
    }
    return errMap;
  }
}
