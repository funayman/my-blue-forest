package uk.ac.herts.dd16abc.myblueforest.validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import uk.ac.herts.dd16abc.myblueforest.model.user.MoushiKomi;
import uk.ac.herts.dd16abc.myblueforest.service.user.BFUserService;

@Component
public class MoushiKomiValidator implements Validator {

  @Autowired
  private BFUserService uService;

  @Override
  public boolean supports(Class<?> theClass) {
    return MoushiKomi.class.equals(theClass);
  }

  @Override
  public void validate(Object o, Errors errors) {
    MoushiKomi user = (MoushiKomi) o;

    //username validation
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "NotEmpty");
    if( !user.getUsername().replaceAll("[^a-zA-Z0-9]", "").equals( user.getUsername() )) {
      errors.rejectValue("username", "Username cannot contain special characters");
    }
    if (user.getUsername().length() < 3 || user.getUsername().length() > 16) {
      errors.rejectValue("username", "Username must be between 3 and 16 charaters");
    }
    if (uService.findByUsername(user.getUsername()) != null) {
      errors.rejectValue("username", "Username already exists");
    }

    //password validation
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "NotEmpty");
    if (user.getPassword().length() < 8) {
      errors.rejectValue("password", "Password mush be at least 8 characters");
    }

    //password confirmation
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "passconf", "NotEmpty");
    if (!user.getPassconf().equals(user.getPassword())) {
      errors.rejectValue("passconf", "Passwords do not match");
    }
  }
}
