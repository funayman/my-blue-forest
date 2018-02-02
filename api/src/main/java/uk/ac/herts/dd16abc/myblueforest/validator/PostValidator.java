package uk.ac.herts.dd16abc.myblueforest.validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import uk.ac.herts.dd16abc.myblueforest.model.Post;
import uk.ac.herts.dd16abc.myblueforest.model.PostType;
import uk.ac.herts.dd16abc.myblueforest.service.PostService;

@Component
public class PostValidator implements Validator {
  private static final String NotEmpty = "This field is required";

  @Autowired
  private PostService pService;

  @Override
  public boolean supports(Class<?> theClass) {
    return Post.class.equals(theClass);
  }

  @Override
  public void validate(Object o, Errors errors) {
    Post post = (Post) o;

    //title validation
    ValidationUtils.rejectIfEmpty(errors, "title", NotEmpty);
    if(post.getTitle().length() < 3 || post.getTitle().length() > 32) {
      errors.rejectValue("title", "Title must be between 3 and 32 characters");
    }

    //post body validation
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "description", NotEmpty);

    //post type validation
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "type", NotEmpty);
    if(post.getType() == null) {
      errors.rejectValue("postType", "cannot find provided post type");
    }

    //tag validation
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "tags", NotEmpty);
    if(!(post.getTags().size() > 0)) {
      errors.rejectValue("tags", "must have at least one tag");
    }
  }
}
