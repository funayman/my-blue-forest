package uk.ac.herts.dd16abc.myblueforest.validator;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import uk.ac.herts.dd16abc.myblueforest.model.Comment;

@Component
public class CommentValidator implements Validator {
  private static final String NotEmpty = "This field is required";

  @Override
  public boolean supports(Class<?> theClass) {
    return Comment.class.equals(theClass);
  }

  @Override
  public void validate(Object o, Errors errors) {
    Comment comment = (Comment) o;

    //title validation
    ValidationUtils.rejectIfEmpty(errors, "details", NotEmpty);
  }
}
