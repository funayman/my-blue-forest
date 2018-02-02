//https://dzone.com/articles/mapping-enums-done-right
package uk.ac.herts.dd16abc.myblueforest.model;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class PostTypeConverter implements AttributeConverter<PostType, String> {

  @Override
  public String convertToDatabaseColumn(PostType attribute) {
    switch (attribute) {
      case QUESTION:
        return "Q";
      case REVIEW:
        return "R";
      case ADVICE:
        return "A";
      default:
        throw new IllegalArgumentException("Unknown" + attribute);
    }
  }

  @Override
  public PostType convertToEntityAttribute(String dbData) {
    switch (dbData) {
      case "Q":
        return PostType.QUESTION;
      case "R":
        return PostType.REVIEW;
      case "A":
        return PostType.ADVICE;
      default:
        throw new IllegalArgumentException("Unknown" + dbData);
    }
  }
}
